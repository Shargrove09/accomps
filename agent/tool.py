import os
import requests
from langchain.tools import tool
from tool_helpers import fetch_all_tags, fetch_all_categories, normalize_accomplishment_fields



@tool
def add_accomplishment(title: str, category: str, tags: str, description: str = "") -> str:
    """
    Adds a new accomplishment to the tracker.

    Args:
        title (str): The title of the accomplishment. Must be a clear, concise summary, corrected for typos and grammar.
        category (str): The category for the accomplishment (e.g., 'Work', 'Learning', 'Personal').
        tags (str): Comma-separated tags to associate with the accomplishment (e.g., 'release,deployment').
        description (str, optional): A more detailed description of the accomplishment, corrected for typos and grammar. Defaults to "".
    
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
        return f"Successfully added accomplishment: '{normalized['title']}'. Response: {response_data.get('message')}"

    except requests.exceptions.HTTPError as http_err:
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
def update_accomplishment(accomplishment_id: str, title: str = "", category: str = "", tags: str = "", description: str = "") -> str:
    """
    Updates an existing accomplishment in the tracker.

    Args:
        accomplishment_id (str): The unique identifier of the accomplishment to update.
        title (str, optional): The new title of the accomplishment. Defaults to "".
        category (str, optional): The new category for the accomplishment. Defaults to "".
        tags (str, optional): Comma-separated new tags to associate with the accomplishment. Defaults to "".
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
        response = requests.patch(f"{api_url}/accomplishments/{accomplishment_id}", json=payload, headers=headers)
        response.raise_for_status()
        return f"Accomplishment with ID {accomplishment_id} updated successfully."
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
        return f"Unexpected error occurred while updating accomplishment: {e}"