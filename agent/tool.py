import os
import requests
from llama_index.core.tools import FunctionTool

def add_accomplishment(title: str, category: str, tags: list[str], description: str = ""):
    """
    Adds a new accomplishment to the tracker.

    Args:
        title (str): The title of the accomplishment. Must be a clear, concise summary, corrected for typos and grammar.
        category (str): The category for the accomplishment (e.g., 'Work', 'Learning', 'Personal').
        tags (list[str]): A list of tags to associate with the accomplishment.
        description (str, optional): A more detailed description of the accomplishment, corrected for typos and grammar. Defaults to "".
    """
    api_url = os.getenv("ACCOMPLISHMENT_API_URL")
    api_key = os.getenv("AGENT_API_KEY")

    if not api_url or not api_key:
        return "Error: API URL or API Key is not configured. Please check your .env file."

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
    }

    payload = {
        "title": title,
        "description": description,
        "category": category,
        "tags": tags,
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

# Create a LlamaIndex tool from the function
add_accomplishment_tool = FunctionTool.from_defaults(fn=add_accomplishment)
