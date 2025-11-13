import os
import requests
from langchain.tools import tool

@tool
def add_accomplishment(title: str, category: str, tags: str, description: str = "") -> str:
    """
    Adds a new accomplishment to the tracker.

    Args:
        title (str): The title of the accomplishment. Must be a clear, concise summary.
        category (str): The category for the accomplishment (e.g., 'Work', 'Learning', 'Personal').
        tags (str): Comma-separated tags to associate with the accomplishment (e.g., 'release,deployment').
        description (str, optional): A more detailed description of the accomplishment. Defaults to "".
    
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

    # Parse tags from comma-separated string to list
    tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

    payload = {
        "title": title,
        "description": description,
        "category": category,
        "tags": tags_list,
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        response_data = response.json()
        return f"Successfully added accomplishment: '{title}'. Response: {response_data.get('message')}"

    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err}. Response: {response.text}"
    except requests.exceptions.RequestException as req_err:
        return f"An error occurred with the request: {req_err}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

@tool
def list_accomplishments(pageSize: int = 5, page: int = 1) -> str:
    """Lists all accomplishments in the tracker.

    Args:
        pageSize (int): Number of accomplishments to return per page.
        page (int): Page number to retrieve.

    Returns:
        str: A formatted string containing the list of accomplishments.
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key: 
        return "Error: API URL or API Key is not configured. Please check your .env file."
    
    headers = { 
        "x-api-key": api_key,
    }

    try: 
        response = requests.get(api_url, headers=headers, params={"pageSize": pageSize, "page": page})
        response.raise_for_status()

        response_data = response.json()
        
        # Format the response for better readability
        accomplishments = response_data.get('accomplishments', [])
        if not accomplishments:
            return "No accomplishments found."
        
        result = f"Found {len(accomplishments)} accomplishment(s):\n\n"
        for acc in accomplishments:
            tags_str = ", ".join([t['tag']['name'] for t in acc.get('tags', [])])
            result += f"- {acc['title']}\n"
            result += f"  Category: {acc['category']['name']}\n"
            result += f"  Tags: {tags_str}\n"
            result += f"  Date: {acc['date']}\n"
            if acc.get('description'):
                result += f"  Description: {acc['description']}\n"
            result += "\n"
        
        return result

    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err}. Response: {response.text}"
    except requests.exceptions.RequestException as req_err:
        return f"An error occurred with the request: {req_err}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"