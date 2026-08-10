import os
import requests
import string
from langchain.tools import tool
from tool_helpers import (
    fetch_all_tags,
    fetch_all_categories,
    normalize_accomplishment_fields,
    resolve_category,
    resolve_tags,
    dropped_tags_note,
    unknown_category_message,
)


def _category_error(response) -> str | None:
    """Render the server's 409 closed-set refusal, or None if it isn't one.

    The server enforces the same rule independently of this module, so a write
    can still be refused even when local matching thought the category was fine
    (e.g. it was deleted between the fetch and the write).
    """
    try:
        body = response.json()
    except Exception:
        return None
    if body.get("code") != "UNKNOWN_CATEGORY":
        return None
    available = body.get("availableCategories") or []
    message = body.get("error", "Unknown category")
    if available:
        return (
            f"{message}. Nothing was saved. Existing categories: "
            + ", ".join(f"'{c}'" for c in available)
            + ". Ask the user which one to use, or whether they want a new category created."
        )
    return f"{message}. Nothing was saved."


@tool
def add_accomplishment(
    title: str, category: str, tags: str, description: str = ""
) -> str:
    """
    Adds a new accomplishment to the tracker.

    The category must be one that ALREADY EXISTS — this tool never creates one.
    Call list_categories if you are unsure what exists. If the category you pass
    matches nothing, this tool saves nothing and tells you to ask the user.

    Args:
        title (str): The title of the accomplishment. Must be a clear, concise summary, corrected for typos and grammar.
        category (str): An EXISTING category for the accomplishment (e.g., 'Work', 'Learning', 'Personal').
            Call list_categories if unsure. Close variants (case, plurals, small typos) snap
            automatically to the existing category, so don't worry about exact spelling.
        tags (str): Comma-separated tags to associate with the accomplishment (e.g., 'release,deployment').
            Prefer EXISTING tags — call list_tags when unsure. Close variants snap to an existing
            tag automatically. An accomplishment may introduce at most 2 genuinely-new tags; any
            beyond that are skipped and reported, so put the most important new tags first.
        description (str, optional): A more detailed description of the accomplishment, corrected for typos and grammar.
            If the user did not provide a description, generate a concise one-sentence description
            in natural language from the title and context before calling this tool — do not leave it blank.

    Returns:
        str: A message indicating success or failure of the operation.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }

    # Normalize all fields
    normalized = normalize_accomplishment_fields(
        title=title,
        category=category,
        tags=tags,
        description=description,
        api_url=api_url,
        api_key=api_key
    )

    # Closed set: refuse rather than create. There is deliberately no parameter
    # that lets the caller force this through — creating a category is its own
    # tool call, so the user sees and approves it as a distinct action.
    if normalized["category_is_new"]:
        return unknown_category_message(
            normalized["category"],
            normalized["category_suggestions"],
            normalized["existing_categories"],
        )

    payload = {
        "title": normalized["title"],
        "description": normalized["description"],
        "category": normalized["category"],
        "tags": normalized["tags"],
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        response_data = response.json()
        return (
            f"Successfully added accomplishment: '{normalized['title']}'. "
            f"Response: {response_data.get('message')}"
            + dropped_tags_note(normalized["dropped_tags"])
        )

    except requests.exceptions.HTTPError as http_err:
        # The server enforces the closed category set too — a 409 means it
        # refused the write, not that something broke.
        category_error = _category_error(response)
        if category_error:
            return category_error
        # Surface the server's JSON error message (e.g. validation failures return
        # {"error": "..."} with a 400) instead of a raw stack/status.
        try:
            server_error = response.json().get("error")
        except Exception:
            server_error = None
        if server_error:
            return f"Error ({response.status_code}): {server_error}"
        return f"HTTP error occurred: {http_err}. Response: {response.text}"
    except requests.exceptions.RequestException as req_err:
        return f"An error occurred with the request: {req_err}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

@tool
def list_accomplishments(pageSize: int = 5, page: int = 1) -> str:
    """Lists accomplishments from the tracker with pagination.
    
    Use this tool when the user wants to:
    - View their recent accomplishments
    - See what they've accomplished
    - List their achievements
    - Check their accomplishment history
    
    The accomplishments are returned in reverse chronological order (most recent first).

    Args:
        pageSize (int): Number of accomplishments to return (1-50). Default is 5.
            Use smaller values (3-5) for quick summaries.
            Use larger values (10-20) when user asks for "all" or "many" accomplishments.
        page (int): Page number to retrieve (starts at 1). Default is 1.
            Increment this to see older accomplishments.

    Returns:
        str: A formatted, human-readable list of accomplishments including:
            - Title
            - Category
            - Tags
            - Date (in ISO format)
            - Description (if provided)
            
    Examples:
        - list_accomplishments() -> Returns 5 most recent accomplishments
        - list_accomplishments(pageSize=10) -> Returns 10 most recent accomplishments
        - list_accomplishments(pageSize=5, page=2) -> Returns accomplishments 6-10
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key: 
        return "Error: API URL or API Key is not configured. Please check your .env file."
    
    # Validate and constrain inputs
    pageSize = max(1, min(pageSize, 50))  # Constrain between 1 and 50
    page = max(1, page)  # Ensure page is at least 1
    
    headers = { 
        "x-api-key": api_key,
    }

    try: 
        response = requests.get(api_url, headers=headers, params={"pageSize": pageSize, "page": page})
        response.raise_for_status()

        response_data = response.json()
        
        # Format the response for better readability
        accomplishments = response_data.get('accomplishments', [])
        total_count = response_data.get('totalCount', 0)
        total_pages = response_data.get('totalPages', 1)
        has_more = response_data.get('hasMore', False)
        
        if not accomplishments:
            if page > 1:
                return f"No accomplishments found on page {page}. There are only {total_pages} page(s) total."
            return "No accomplishments found yet. The user hasn't added any accomplishments."
        
        # Create a clear, structured output
        from datetime import datetime
        
        result = f"📋 Showing {len(accomplishments)} accomplishment(s) (Page {page} of {total_pages}, Total: {total_count}):\n"
        result += "=" * 60 + "\n\n"
        
        for idx, acc in enumerate(accomplishments, 1):
            # Parse and format the date
            try:
                date_obj = datetime.fromisoformat(acc['date'].replace('Z', '+00:00'))
                formatted_date = date_obj.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_date = acc['date']
            
            # Format tags
            tags_list = [t['tag']['name'] for t in acc.get('tags', [])]
            tags_str = ", ".join(tags_list) if tags_list else "No tags"
            
            # Build the accomplishment entry
            result += f"{idx}. {acc['title']}\n"
            result += f"   🆔 ID: {acc['id']}\n"
            result += f"   📁 Category: {acc['category']['name']}\n"
            result += f"   🏷️  Tags: {tags_str}\n"
            result += f"   📅 Date: {formatted_date}\n"
            
            if acc.get('description') and acc['description'].strip():
                # Truncate long descriptions for readability
                desc = acc['description']
                if len(desc) > 150:
                    desc = desc[:147] + "..."
                result += f"   📝 Description: {desc}\n"
            
            result += "\n"
        
        # Add helpful pagination info
        if has_more:
            result += f"💡 Tip: There are more accomplishments. Use page={page + 1} to see older ones (up to page {total_pages}).\n"
        elif page < total_pages:
            result += f"💡 Note: This is the last page of accomplishments.\n"
        
        return result

    except requests.exceptions.HTTPError as http_err:
        status_code = response.status_code if 'response' in locals() else 'unknown'
        if status_code == 401:
            return "Error: Authentication failed. The API key may be invalid."
        elif status_code == 404:
            return "Error: The accomplishments API endpoint was not found."
        else:
            return f"HTTP error {status_code}: {http_err}. Response: {response.text}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the API. Is the server running?"
    except requests.exceptions.RequestException as req_err:
        return f"Network error occurred: {req_err}"
    except Exception as e:
        return f"Unexpected error occurred while listing accomplishments: {e}"

@tool
def list_accomplishments_by_date(start_date: str = "", end_date: str = "", timeframe: str = "") -> str:
    """Lists accomplishments filtered by date range or common timeframes.
    
    Use this tool when the user wants to:
    - See accomplishments from a specific date range
    - View accomplishments from today, this week, this month, or this year
    - Filter accomplishments by time period
    
    You can either specify exact dates OR use a timeframe shortcut (not both).
    
    Args:
        start_date (str): Start date in YYYY-MM-DD format (e.g., "2025-11-01"). 
            Required if timeframe is not specified. Defaults to empty string.
        end_date (str): End date in YYYY-MM-DD format (e.g., "2025-11-13").
            Optional - if not provided with start_date, will use current date. Defaults to empty string.
        timeframe (str): Common timeframe shortcut. Valid values:
            - "today": Accomplishments from today
            - "yesterday": Accomplishments from yesterday  
            - "week": Accomplishments from this week (Monday to Sunday)
            - "month": Accomplishments from this month
            - "year": Accomplishments from this year
            If specified, start_date and end_date are ignored. Defaults to empty string.
    
    Returns:
        str: A formatted list of accomplishments within the specified date range.
        
    Examples:
        - list_accomplishments_by_date(timeframe="today") -> Today's accomplishments
        - list_accomplishments_by_date(timeframe="week") -> This week's accomplishments
        - list_accomplishments_by_date(start_date="2025-11-01", end_date="2025-11-13") -> Custom range
        - list_accomplishments_by_date(start_date="2025-11-01") -> From Nov 1 to now
    """
    from datetime import datetime, timedelta
    
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."
    
    # Calculate date range based on timeframe or explicit dates
    try:
        now = datetime.now()
        
        if timeframe:
            timeframe = timeframe.lower()
            if timeframe == "today":
                start_dt = now.replace(hour=0, minute=0, second=0, microsecond=0)
                end_dt = now.replace(hour=23, minute=59, second=59, microsecond=999999)
                period_label = "today"
            elif timeframe == "yesterday":
                yesterday = now - timedelta(days=1)
                start_dt = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
                end_dt = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
                period_label = "yesterday"
            elif timeframe == "week":
                # Start from Monday of current week
                start_dt = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
                end_dt = now
                period_label = "this week"
            elif timeframe == "month":
                start_dt = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                end_dt = now
                period_label = "this month"
            elif timeframe == "year":
                start_dt = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
                end_dt = now
                period_label = "this year"
            else:
                return f"Error: Invalid timeframe '{timeframe}'. Valid options: today, yesterday, week, month, year"
        elif start_date:
            start_dt = datetime.fromisoformat(start_date)
            end_dt = datetime.fromisoformat(end_date) if end_date else now
            period_label = f"from {start_date} to {end_dt.strftime('%Y-%m-%d')}"
        else:
            return "Error: Must specify either 'timeframe' or 'start_date'. Use timeframe='today', 'week', 'month', 'year', or provide start_date in YYYY-MM-DD format."
        
        # Format dates for API (ISO format)
        start_iso = start_dt.isoformat()
        end_iso = end_dt.isoformat()
        
    except ValueError as ve:
        return f"Error: Invalid date format. Use YYYY-MM-DD format (e.g., '2025-11-13'). Details: {ve}"
    
    headers = {
        "x-api-key": api_key,
    }
    
    params = {
        "startDate": start_iso,
        "endDate": end_iso,
    }
    
    try:
        response = requests.get(api_url, headers=headers, params=params)
        response.raise_for_status()
        
        response_data = response.json()
        accomplishments = response_data.get('accomplishments', [])
        
        if not accomplishments:
            return f"No accomplishments found for {period_label}."
        
        # Format the response
        result = f"📋 Accomplishments for {period_label} ({len(accomplishments)} found):\n"
        result += "=" * 60 + "\n\n"
        
        for idx, acc in enumerate(accomplishments, 1):
            # Parse and format the date
            try:
                date_obj = datetime.fromisoformat(acc['date'].replace('Z', '+00:00'))
                formatted_date = date_obj.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_date = acc['date']
            
            # Format tags
            tags_list = [t['tag']['name'] for t in acc.get('tags', [])]
            tags_str = ", ".join(tags_list) if tags_list else "No tags"
            
            # Build the accomplishment entry
            result += f"{idx}. {acc['title']}\n"
            result += f"   🆔 ID: {acc['id']}\n"
            result += f"   📁 Category: {acc['category']['name']}\n"
            result += f"   🏷️  Tags: {tags_str}\n"
            result += f"   📅 Date: {formatted_date}\n"
            
            if acc.get('description') and acc['description'].strip():
                desc = acc['description']
                if len(desc) > 150:
                    desc = desc[:147] + "..."
                result += f"   📝 Description: {desc}\n"
            
            result += "\n"
        
        return result
        
    except requests.exceptions.HTTPError as http_err:
        status_code = response.status_code if 'response' in locals() else 'unknown'
        if status_code == 401:
            return "Error: Authentication failed. The API key may be invalid."
        elif status_code == 404:
            return "Error: The accomplishments API endpoint was not found."
        else:
            return f"HTTP error {status_code}: {http_err}. Response: {response.text}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the API. Is the server running?"
    except requests.exceptions.RequestException as req_err:
        return f"Network error occurred: {req_err}"
    except Exception as e:
        return f"Unexpected error occurred while listing accomplishments: {e}"

@tool
def search_accomplishments(query: str = "", start_date: str = "", end_date: str = "", tag: str = "", category: str = "") -> str:
    """Searches accomplishments by title text, date range, tag, and/or category, returning their IDs.

    Use this tool when the user refers to a specific accomplishment (e.g. "the one
    about the auth deploy") and you need its ID before updating or deleting it, or
    when the user wants to filter by a tag or category. The returned entries include
    an "ID:" line.

    Args:
        query (str): Case-insensitive text to match against accomplishment titles
            (e.g. "authentication"). Optional.
        start_date (str): Start date in YYYY-MM-DD format. Optional.
        end_date (str): End date in YYYY-MM-DD format. Optional.
        tag (str): Filter to accomplishments having ANY of these tags. Single name or
            comma-separated (e.g. "release,deployment"). Case-insensitive. Optional.
        category (str): Filter to a single category name (case-insensitive). Optional.

    Returns:
        str: A formatted list of matching accomplishments, each including its ID,
            or a message if none match.

    Examples:
        - search_accomplishments(query="react hooks") -> matches by title
        - search_accomplishments(tag="deployment") -> everything tagged deployment
        - search_accomplishments(category="Work", start_date="2025-11-01") -> category + date
    """
    from datetime import datetime

    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    if not query and not start_date and not end_date and not tag and not category:
        return "Error: Provide at least a 'query', date range, tag, or category to search."

    headers = {
        "x-api-key": api_key,
    }

    params = {"pageSize": 20}
    if query:
        params["search"] = query
    if start_date:
        params["startDate"] = start_date
    if end_date:
        params["endDate"] = end_date
    if tag:
        params["tag"] = tag
    if category:
        params["category"] = category

    try:
        response = requests.get(api_url, headers=headers, params=params)
        response.raise_for_status()

        response_data = response.json()
        accomplishments = response_data.get('accomplishments', [])

        if not accomplishments:
            return f"No accomplishments found matching your search."

        result = f"🔎 Found {len(accomplishments)} matching accomplishment(s):\n"
        result += "=" * 60 + "\n\n"

        for idx, acc in enumerate(accomplishments, 1):
            try:
                date_obj = datetime.fromisoformat(acc['date'].replace('Z', '+00:00'))
                formatted_date = date_obj.strftime('%B %d, %Y at %I:%M %p')
            except:
                formatted_date = acc['date']

            tags_list = [t['tag']['name'] for t in acc.get('tags', [])]
            tags_str = ", ".join(tags_list) if tags_list else "No tags"

            result += f"{idx}. {acc['title']}\n"
            result += f"   🆔 ID: {acc['id']}\n"
            result += f"   📁 Category: {acc['category']['name']}\n"
            result += f"   🏷️  Tags: {tags_str}\n"
            result += f"   📅 Date: {formatted_date}\n\n"

        return result

    except requests.exceptions.HTTPError as http_err:
        status_code = response.status_code if 'response' in locals() else 'unknown'
        if status_code == 401:
            return "Error: Authentication failed. The API key may be invalid."
        elif status_code == 404:
            return "Error: The accomplishments API endpoint was not found."
        else:
            return f"HTTP error {status_code}: {http_err}. Response: {response.text}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the API. Is the server running?"
    except requests.exceptions.RequestException as req_err:
        return f"Network error occurred: {req_err}"
    except Exception as e:
        return f"Unexpected error occurred while searching accomplishments: {e}"

@tool
def list_tags() -> str:
    """Lists all available tags in the system.
    
    Use this tool to see what tags are already defined to maintain consistency.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured."

    tags = fetch_all_tags(api_url, api_key)
    
    if not tags:
        return "No tags found or error fetching tags."
        
    return f"Available tags ({len(tags)}): {', '.join(tags)}"

@tool
def list_categories() -> str:
    """Lists all available categories in the system.
    
    Use this tool to see what categories are already defined to maintain consistency.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured."

    categories = fetch_all_categories(api_url, api_key)
    
    if not categories:
        return "No categories found or error fetching categories."

    return f"Available categories ({len(categories)}): {', '.join(categories)}"

@tool
def create_category(name: str, description: str = "") -> str:
    """
    Creates a NEW category in the tracker. This changes the shared taxonomy that every
    accomplishment is filed under, so use it sparingly.

    ONLY call this when the user has explicitly asked for a new category, or has agreed
    to one you proposed by name. Never call it on your own initiative to make an
    add_accomplishment or update_accomplishment call succeed — if those tools refused a
    category, the correct next step is to ASK THE USER, not to create it.

    Prefer an existing category: call list_categories first and reuse one if it fits.
    A category cannot be deleted once accomplishments are filed under it, only merged.

    Args:
        name (str): The new category name. Keep it short and general (a bucket, not a topic).
        description (str, optional): A brief description of what belongs in this category.

    Returns:
        str: A message indicating success or failure of the operation.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    if not name or not name.strip():
        return "Error: A category name is required."

    name = string.capwords(name.strip()) if name.strip().islower() else name.strip()

    if "/accomplishments" in api_url:
        categories_url = api_url.replace("/accomplishments", "/categories")
    else:
        categories_url = f"{api_url.rsplit('/', 1)[0]}/categories"

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }
    payload = {"name": name}
    if description.strip():
        payload["description"] = description.strip()

    try:
        response = requests.post(categories_url, json=payload, headers=headers)
        if response.status_code == 409:
            # Already there under a different casing — reuse it rather than
            # reporting failure; the user's intent is satisfied either way.
            existing = response.json().get("existingCategory", name)
            return (
                f"Category '{existing}' already exists — no new category was created. "
                f"Use '{existing}' for the accomplishment."
            )
        response.raise_for_status()
        return (
            f"Created the category '{name}'. You can now record the accomplishment "
            f"under it."
        )
    except requests.exceptions.HTTPError as http_err:
        try:
            server_error = response.json().get("error")
        except Exception:
            server_error = None
        if server_error:
            return f"Error ({response.status_code}): {server_error}"
        return f"HTTP error occurred: {http_err}. Response: {response.text}"
    except requests.exceptions.RequestException as req_err:
        return f"An error occurred with the request: {req_err}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

@tool
def update_accomplishment(accomplishment_id: str, title: str = "", category: str = "", tags: str = "", description: str = "") -> str:
    """
    Updates an existing accomplishment in the tracker.

    As with add_accomplishment, the category must ALREADY EXIST — this tool never
    creates one.

    Args:
        accomplishment_id (str): The unique identifier of the accomplishment to update.
        title (str, optional): The new title of the accomplishment. Defaults to "".
        category (str, optional): An EXISTING category to move the accomplishment to. Defaults to "".
        tags (str, optional): Comma-separated tags, REPLACING the current set. Defaults to "".
            Same rules as add_accomplishment: prefer existing tags, at most 2 new ones per call.
        description (str, optional): A new detailed description of the accomplishment. Defaults to "".

    Returns:
        str: A message indicating success or failure of the operation.
    """
    # Implementation would be similar to add_accomplishment but using PATCH or PUT method
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }

    # Same closed-set gate as add_accomplishment — an edit must not be a back
    # door for minting categories.
    if category:
        existing_categories = fetch_all_categories(api_url, api_key)
        resolved = resolve_category(category, existing_categories)
        if resolved["is_new"]:
            return unknown_category_message(
                resolved["name"], resolved["suggestions"], existing_categories
            )
        category = resolved["name"]

    # Same new-tag budget as add_accomplishment. Without this the cap would be
    # trivially bypassable — an agent could just call update to bolt on ten new
    # tags — so the edit path has to honour it too.
    dropped = []
    if tags:
        resolved_tags = resolve_tags(tags, fetch_all_tags(api_url, api_key))
        dropped = resolved_tags["dropped"]
        tags = ",".join(resolved_tags["tags"])
        if not tags:
            return (
                "No tags could be applied: every proposed tag was refused by the new-tag "
                "budget. Call list_tags and reuse an existing tag instead."
            )

    payload = {}
    if title:
        payload["title"] = title
    if category:
        payload["category"] = category
    if tags:
        payload["tags"] = tags
    if description:
        payload["description"] = description

    if not payload:
        return "No fields to update were provided."

    try:
        response = requests.patch(f"{api_url}/{accomplishment_id}", json=payload, headers=headers)
        response.raise_for_status()
        return (
            f"Accomplishment with ID {accomplishment_id} updated successfully."
            + dropped_tags_note(dropped)
        )
    except requests.exceptions.HTTPError as http_err:
        status_code = response.status_code if 'response' in locals() else 'unknown'
        if status_code == 401:
            return "Error: Authentication failed. The API key may be invalid."
        elif status_code == 404:
            return f"Error: Accomplishment with ID {accomplishment_id} not found."
        category_error = _category_error(response)
        if category_error:
            return category_error
        return f"HTTP error {status_code}: {http_err}. Response: {response.text}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the API. Is the server running?"
    except requests.exceptions.RequestException as req_err:
        return f"Network error occurred: {req_err}"
    except Exception as e:
        return f"Unexpected error occurred while updating accomplishment: {e}"

@tool
def delete_accomplishment(accomplishment_id: str) -> str:
    """
    Deletes an accomplishment from the tracker by its ID. This is DESTRUCTIVE and
    cannot be undone.

    Before calling this tool:
    - Use search_accomplishments to find and confirm the correct ID.
    - Confirm the user actually intends to delete that specific accomplishment.

    Args:
        accomplishment_id (str): The unique ID of the accomplishment to delete.

    Returns:
        str: A message indicating success or failure of the operation.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    headers = {
        "x-api-key": api_key,
    }

    try:
        response = requests.delete(f"{api_url}/{accomplishment_id}", headers=headers)
        response.raise_for_status()
        return f"Accomplishment with ID {accomplishment_id} deleted successfully."
    except requests.exceptions.HTTPError as http_err:
        status_code = response.status_code if 'response' in locals() else 'unknown'
        if status_code == 401:
            return "Error: Authentication failed. The API key may be invalid."
        elif status_code == 404:
            return f"Error: Accomplishment with ID {accomplishment_id} not found."
        else:
            return f"HTTP error {status_code}: {http_err}. Response: {response.text}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the API. Is the server running?"
    except requests.exceptions.RequestException as req_err:
        return f"Network error occurred: {req_err}"
    except Exception as e:
        return f"Unexpected error occurred while deleting accomplishment: {e}"

def _stats_url(api_url: str) -> str:
    """Derive the /stats endpoint URL from the accomplishments API URL."""
    if "/accomplishments" in api_url:
        return api_url.replace("/accomplishments", "/stats")
    return api_url.rsplit('/', 1)[0] + "/stats"

@tool
def get_stats(timeframe: str = "", start_date: str = "", end_date: str = "") -> str:
    """Gets aggregate statistics about the user's accomplishments.

    Returns totals (all-time, in-range, this week, number of categories and tags),
    breakdowns by category and by tag, the most active day, and the current
    consecutive-day logging streak. Use for questions like "how many accomplishments
    do I have", "what do I work on most", or "what's my streak".

    Args:
        timeframe (str): Optional scope preset: today | week | month | year.
            Omit (or "all") for all-time stats.
        start_date (str): Optional explicit start date (YYYY-MM-DD); overrides timeframe.
        end_date (str): Optional explicit end date (YYYY-MM-DD).

    Returns:
        str: A formatted summary of the statistics.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    headers = {
        "x-api-key": api_key,
    }

    params = {}
    if timeframe:
        params["timeframe"] = timeframe
    if start_date:
        params["startDate"] = start_date
    if end_date:
        params["endDate"] = end_date

    try:
        response = requests.get(_stats_url(api_url), headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        totals = data.get("totals", {})
        trends = data.get("trends", {})
        by_category = data.get("byCategory", [])
        by_tag = data.get("byTag", [])

        result = "📊 Accomplishment Stats\n"
        result += "=" * 40 + "\n"
        result += f"Total (all time): {totals.get('total', 0)}\n"
        result += f"In selected range: {totals.get('inRange', 0)}\n"
        result += f"This week: {totals.get('thisWeek', 0)}\n"
        result += f"Categories: {totals.get('categories', 0)} | Tags: {totals.get('tags', 0)}\n"
        result += f"Current streak: {trends.get('currentStreak', 0)} day(s)\n"

        most_active = trends.get("mostActiveDay")
        if most_active:
            result += f"Most active day: {most_active.get('date')} ({most_active.get('count')} logged)\n"

        if by_category:
            result += "\nTop categories:\n"
            for c in by_category[:5]:
                result += f"  - {c.get('category')}: {c.get('count')}\n"
        if by_tag:
            result += "\nTop tags:\n"
            for t in by_tag[:5]:
                result += f"  - {t.get('tag')}: {t.get('count')}\n"

        return result

    except requests.exceptions.HTTPError as http_err:
        status_code = response.status_code if 'response' in locals() else 'unknown'
        if status_code == 401:
            return "Error: Authentication failed. The API key may be invalid."
        elif status_code == 404:
            return "Error: The stats API endpoint was not found."
        else:
            return f"HTTP error {status_code}: {http_err}. Response: {response.text}"
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the API. Is the server running?"
    except requests.exceptions.RequestException as req_err:
        return f"Network error occurred: {req_err}"
    except Exception as e:
        return f"Unexpected error occurred while fetching stats: {e}"

@tool
def weekly_summary(timeframe: str = "week") -> str:
    """Gathers the data needed to narrate a natural-language accomplishment summary.

    Fetches both the aggregate stats and the list of accomplishments for the
    timeframe. IMPORTANT: do not just echo the raw numbers back — write a short,
    friendly prose recap for the user (e.g. "This week you logged 7 accomplishments,
    mostly in Engineering, and kept a 4-day streak going. Highlights included ...").
    Call out totals, top categories/tags, the streak, and a couple of notable entries.

    Args:
        timeframe (str): today | week | month | year. Defaults to "week".

    Returns:
        str: Stats plus the accomplishments for the period, for you to summarize.
    """
    tf = timeframe or "week"
    stats = get_stats.invoke({"timeframe": tf})
    listing = list_accomplishments_by_date.invoke({"timeframe": tf})
    return (
        f"Write a short natural-language {tf} summary for the user based on the data "
        f"below. Highlight the totals, top categories/tags, the current streak, and a "
        f"few notable accomplishments. Do not just list raw numbers.\n\n"
        f"--- STATS ---\n{stats}\n\n"
        f"--- ACCOMPLISHMENTS ---\n{listing}"
    )