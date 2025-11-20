import requests
import string


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
            return [tag['name'] for tag in data.get('tags', [])]
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
        dict: Normalized fields with keys: title, category, tags (list), description
    """
    # Fetch existing tags and categories for normalization
    existing_tags = fetch_all_tags(api_url, api_key)
    existing_tags_lower = {t.lower(): t for t in existing_tags}
    
    existing_categories = fetch_all_categories(api_url, api_key)
    existing_categories_lower = {c.lower(): c for c in existing_categories}
    
    # Normalize and capitalize title
    title = title.strip()
    if title and not title[0].isupper():
        title = title[0].upper() + title[1:]
    
    # Normalize and capitalize description
    description = description.strip()
    if description and not description[0].isupper():
        description = description[0].upper() + description[1:]
    
    # Normalize category
    category = category.strip()
    if category.lower() in existing_categories_lower:
        category = existing_categories_lower[category.lower()]
    elif category.islower():
        category = string.capwords(category)
    
    # Parse and normalize tags
    raw_tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
    tags_list = []
    
    for tag in raw_tags_list:
        # Check if tag exists (case-insensitive)
        if tag.lower() in existing_tags_lower:
            tags_list.append(existing_tags_lower[tag.lower()])
        elif tag.islower():
            tags_list.append(string.capwords(tag))
        else:
            tags_list.append(tag)
    
    return {
        "title": title,
        "category": category,
        "tags": tags_list,
        "description": description
    }
