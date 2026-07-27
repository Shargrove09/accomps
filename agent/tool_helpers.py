import difflib
import requests
import string


# Similarity cutoff for snapping a proposed tag/category onto an existing one.
# 0.82 catches case/plural/spacing variants and small typos without collapsing
# genuinely distinct words together.
_FUZZY_CUTOFF = 0.82


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


def _match_existing(name: str, existing: list) -> str | None:
    """Return the canonical existing name that `name` should snap to, or None if it
    looks genuinely new. Matches on the normalized key first, then a fuzzy fallback."""
    if not existing:
        return None
    # Map each existing name's normalized key -> its canonical spelling (first wins).
    norm_to_canonical = {}
    for existing_name in existing:
        norm_to_canonical.setdefault(_norm_key(existing_name), existing_name)

    key = _norm_key(name)
    if key in norm_to_canonical:
        return norm_to_canonical[key]

    close = difflib.get_close_matches(key, list(norm_to_canonical), n=1, cutoff=_FUZZY_CUTOFF)
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
            plus metadata for the new-category confirmation gate:
            - category_is_new (bool): True when the category matched no existing one
              (and existing categories were available to match against).
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

    # Normalize category. Snap onto an existing category (case/plural/spacing/typo
    # variants included). If none matches, flag it as new so the caller can confirm
    # with the user before it gets created. When there are no existing categories to
    # match against, don't gate — let the first one through to bootstrap the list.
    category = category.strip()
    category_is_new = False
    category_suggestions = []
    if category:
        matched_category = _match_existing(category, existing_categories)
        if matched_category:
            category = matched_category
        elif existing_categories:
            category_is_new = True
            category_suggestions = _suggest_existing(category, existing_categories)
            if category.islower():
                category = string.capwords(category)
        elif category.islower():
            category = string.capwords(category)

    # Parse and normalize tags. Snap near-duplicates onto existing tags; let a
    # genuinely new tag through (medium strictness — tags stay flexible).
    raw_tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
    tags_list = []

    for tag in raw_tags_list:
        matched_tag = _match_existing(tag, existing_tags)
        if matched_tag:
            tags_list.append(matched_tag)
        elif tag.islower():
            tags_list.append(string.capwords(tag))
        else:
            tags_list.append(tag)

    return {
        "title": title,
        "category": category,
        "tags": tags_list,
        "description": description,
        "category_is_new": category_is_new,
        "category_suggestions": category_suggestions,
        "existing_categories": existing_categories,
    }
