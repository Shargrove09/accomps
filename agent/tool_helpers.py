import difflib
import requests
import string


# Similarity cutoff for snapping a proposed tag/category onto an existing one.
# 0.82 catches case/plural/spacing variants and small typos without collapsing
# genuinely distinct words together.
#
# Categories deliberately keep this STRICTER cutoff rather than the looser tag
# one below. The two fields fail differently: a wrong tag is a slightly-off
# label on an entry that is otherwise filed correctly, while a wrong category
# silently misfiles the entry itself — and a category can't be deleted once
# anything points at it (onDelete: Restrict), only merged. For categories,
# refusing and asking beats snapping onto a near-match and being wrong.
_FUZZY_CUTOFF = 0.82

# Tags use a LOOSER cutoff than categories: we want near-variants to snap onto an
# existing tag aggressively so the tag list doesn't sprout a new entry per
# accomplishment.
_TAG_FUZZY_CUTOFF = 0.70

# How many genuinely-new tags one accomplishment may introduce.
#
# Tags are meant to proliferate more freely than categories, so the brake is a
# budget rather than a closed set. Two is enough to name a genuinely novel topic
# ("kubernetes", "helm") while stopping a ten-tag brainstorm from adding ten rows
# — which is how a 60-entry tracker ended up with 91 tags, 61 of them used once.
#
# This replaces an earlier all-or-nothing rule (keep matched tags, drop every new
# one; but if NOTHING matched, let them all through). That was backwards: it
# braked hardest when good existing tags were already available, and not at all
# when the model was inventing from scratch. A flat budget applies in both cases.
_MAX_NEW_TAGS = 2


def _norm_key(name: str) -> str:
    """Collapse a tag/category name to a comparison key: lowercase, hyphens and
    underscores treated as spaces, whitespace squeezed, and a naive trailing-plural
    stripped so 'Deployments' and 'deployment' share a key."""
    key = name.strip().lower().replace("-", " ").replace("_", " ")
    key = " ".join(key.split())
    if key.endswith("es") and len(key) > 4:
        key = key[:-2]
    elif key.endswith("s") and len(key) > 3:
        key = key[:-1]
    return key


def _match_existing(name: str, existing: list, cutoff: float = _FUZZY_CUTOFF) -> str | None:
    """Return the canonical existing name that `name` should snap to, or None if it
    looks genuinely new. Matches on the normalized key first, then a fuzzy fallback.
    `cutoff` controls fuzzy strictness (lower = snaps more aggressively)."""
    if not existing:
        return None
    # Map each existing name's normalized key -> its canonical spelling (first wins).
    norm_to_canonical = {}
    for existing_name in existing:
        norm_to_canonical.setdefault(_norm_key(existing_name), existing_name)

    key = _norm_key(name)
    if key in norm_to_canonical:
        return norm_to_canonical[key]

    close = difflib.get_close_matches(key, list(norm_to_canonical), n=1, cutoff=cutoff)
    if close:
        return norm_to_canonical[close[0]]
    return None


def _suggest_existing(name: str, existing: list, limit: int = 3) -> list:
    """Best-effort ordered suggestions of existing names closest to `name`, for the
    'this category is new — did you mean…?' confirmation prompt."""
    if not existing:
        return []
    norm_to_canonical = {}
    for existing_name in existing:
        norm_to_canonical.setdefault(_norm_key(existing_name), existing_name)
    close = difflib.get_close_matches(
        _norm_key(name), list(norm_to_canonical), n=limit, cutoff=0.4
    )
    return [norm_to_canonical[k] for k in close]


def resolve_category(category: str, existing_categories: list) -> dict:
    """Resolve a proposed category name against the existing set.

    Categories are a CLOSED SET: this never invents one. It either snaps the
    proposal onto an existing category (case/plural/spacing/typo variants
    included) or reports it as new so the caller can stop and ask the user.
    Creating a category is a separate, deliberate act — see the create_category
    tool — not a side effect of recording an accomplishment.

    Returns:
        dict with keys:
        - name (str): the canonical existing category when matched, otherwise
          the proposal as given (NOT re-cased — don't canonicalize a name that
          isn't going to be created).
        - is_new (bool): True when nothing existing matched.
        - suggestions (list): closest existing categories, best first.
    """
    category = category.strip()
    if not category:
        return {"name": "", "is_new": False, "suggestions": []}

    matched = _match_existing(category, existing_categories)
    if matched:
        return {"name": matched, "is_new": False, "suggestions": []}

    # No categories exist yet — nothing to gate against, so let the first one
    # through to bootstrap the list rather than deadlocking an empty tracker.
    if not existing_categories:
        return {
            "name": string.capwords(category) if category.islower() else category,
            "is_new": False,
            "suggestions": [],
        }

    return {
        "name": category,
        "is_new": True,
        "suggestions": _suggest_existing(category, existing_categories),
    }


def resolve_tags(tags: str, existing_tags: list) -> dict:
    """Resolve a comma-separated tag string against the existing tag vocabulary.

    Unlike categories, tags may still be created — but only on a budget. Each
    proposal either snaps onto an existing tag (case/plural/typo variants
    included) or counts against _MAX_NEW_TAGS; proposals past the budget are
    dropped and reported, never silently discarded.

    Returns:
        dict with keys:
        - tags (list): the tags to save, matched ones first, de-duplicated.
        - dropped (list): new tags refused by the budget, so the caller can say so.
        - matched (list) / created (list): the accepted split, for messaging.
    """
    proposals = [tag.strip() for tag in tags.split(",") if tag.strip()]

    matched = []  # snapped onto an existing tag
    new = []      # nothing existing fits
    for tag in proposals:
        existing_match = _match_existing(tag, existing_tags, cutoff=_TAG_FUZZY_CUTOFF)
        if existing_match:
            matched.append(existing_match)
        else:
            new.append(string.capwords(tag) if tag.islower() else tag)

    # Bootstrap: with no vocabulary yet, nothing can match, so a budget would
    # cripple the first few entries. Let them all through to seed the list —
    # mirrors the same exemption in resolve_category.
    budget = len(new) if not existing_tags else _MAX_NEW_TAGS
    created, dropped = new[:budget], new[budget:]

    # De-duplicate while preserving order (two proposals can snap to one tag).
    seen = set()
    chosen = [t for t in matched + created if not (t in seen or seen.add(t))]

    return {"tags": chosen, "dropped": dropped, "matched": matched, "created": created}


def dropped_tags_note(dropped: list) -> str:
    """Trailing sentence for a save that hit the new-tag budget. Empty when it didn't."""
    if not dropped:
        return ""
    names = ", ".join(f"'{t}'" for t in dropped)
    return (
        f" Note: skipped {len(dropped)} new tag(s) — {names} — because an accomplishment "
        f"may introduce at most {_MAX_NEW_TAGS} new tag(s). Tell the user, and if one of "
        f"those matters, suggest an existing tag (list_tags) or re-save with fewer new ones."
    )


def unknown_category_message(name: str, suggestions: list, existing: list) -> str:
    """The refusal returned when a tool is handed a category outside the set.

    Deliberately does NOT offer the model a way to force the write through —
    the only path forward is create_category, and only after the user asks.
    """
    options = suggestions or existing
    lines = [f"'{name}' is not an existing category, and nothing was saved."]
    if options:
        lines.append("Closest existing categories: " + ", ".join(f"'{c}'" for c in options) + ".")
    lines.append(
        "Ask the user which existing category to use. Only if they explicitly want a "
        f"NEW category '{name}' should you call create_category, then retry. "
        "Never call create_category on your own initiative."
    )
    return " ".join(lines)


def fetch_all_tags(api_url: str, api_key: str) -> list:
    """Helper to fetch all tags from the API."""
    # Construct tags URL from accomplishments URL
    if "/accomplishments" in api_url:
        tags_url = api_url.replace("/accomplishments", "/tags")
    else:
        # Fallback or assumption about URL structure
        base_url = api_url.rsplit('/', 1)[0]
        tags_url = f"{base_url}/tags"
    
    headers = {
        "x-api-key": api_key,
    }
    
    try:
        response = requests.get(tags_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            # Tolerate both shapes: a wrapped { "tags": [...] } object (current)
            # or a bare array (older API), so a shape change can't silently break us.
            tags = data if isinstance(data, list) else data.get('tags', [])
            return [tag['name'] for tag in tags]
    except Exception as e:
        print(f"Warning: Failed to fetch tags for normalization: {e}")
    
    return []

def fetch_all_categories(api_url: str, api_key: str) -> list:
    """Helper to fetch all categories from the API."""
    # Construct categories URL from accomplishments URL
    if "/accomplishments" in api_url:
        categories_url = api_url.replace("/accomplishments", "/categories")
    else:
        # Fallback or assumption about URL structure
        base_url = api_url.rsplit('/', 1)[0]
        categories_url = f"{base_url}/categories"
    
    headers = {
        "x-api-key": api_key,
    }
    
    try:
        response = requests.get(categories_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return [cat['name'] for cat in data.get('categories', [])]
    except Exception as e:
        print(f"Warning: Failed to fetch categories for normalization: {e}")
    
    return []

def normalize_accomplishment_fields(
    title: str,
    category: str, 
    tags: str,
    description: str,
    api_url: str,
    api_key: str
) -> dict:
    """
    Normalize and capitalize all accomplishment fields.
    
    Args:
        title (str): Raw title input
        category (str): Raw category input
        tags (str): Comma-separated tags string
        description (str): Raw description input
        api_url (str): API URL for fetching existing data
        api_key (str): API key for authentication
    
    Returns:
        dict: Normalized fields with keys: title, category, tags (list), description,
            plus:
            - dropped_tags (list): new tags refused by the _MAX_NEW_TAGS budget. The
              save still proceeds; report these with dropped_tags_note.
            and metadata for the closed-set category gate:
            - category_is_new (bool): True when the category matched no existing one
              (and existing categories were available to match against). The caller
              must refuse the write when this is True — see unknown_category_message.
            - category_suggestions (list): closest existing categories, best first.
            - existing_categories (list): all existing categories, for context.
    """
    # Fetch existing tags and categories for normalization
    existing_tags = fetch_all_tags(api_url, api_key)
    existing_categories = fetch_all_categories(api_url, api_key)

    # Normalize and capitalize title
    title = title.strip()
    if title and not title[0].isupper():
        title = title[0].upper() + title[1:]

    # Normalize and capitalize description
    description = description.strip()
    if description and not description[0].isupper():
        description = description[0].upper() + description[1:]

    # Resolve the category against the closed set. Never invents one — an
    # unmatched proposal comes back flagged so the caller refuses the write.
    resolved_category = resolve_category(category, existing_categories)
    category = resolved_category["name"]
    category_is_new = resolved_category["is_new"]
    category_suggestions = resolved_category["suggestions"]

    # Snap tags onto the existing vocabulary, letting at most _MAX_NEW_TAGS
    # genuinely-new ones through. Overflow comes back in `dropped` to be reported.
    resolved_tags = resolve_tags(tags, existing_tags)

    return {
        "title": title,
        "category": category,
        "tags": resolved_tags["tags"],
        "description": description,
        "dropped_tags": resolved_tags["dropped"],
        "category_is_new": category_is_new,
        "category_suggestions": category_suggestions,
        "existing_categories": existing_categories,
    }
