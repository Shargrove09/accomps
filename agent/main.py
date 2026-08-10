import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from tool import add_accomplishment, list_accomplishments, list_accomplishments_by_date, search_accomplishments, list_tags, list_categories, create_category, update_accomplishment, delete_accomplishment, get_stats, weekly_summary
from langgraph.checkpoint.memory import InMemorySaver


display_extra = False

def chat_loop(agent):
    print("\nAccomplishment Agent (LangChain) is ready!")
    print("Type 'exit' to quit.")
    print("You can now add or list accomplishments. For example:")
    print("-> Add that I deployed the new feature to production under the 'Work' category, and tag it with 'release' and 'deployment'.")
    print("-> List my recent accomplishments")
    print("-> Show me accomplishments from this week")
    print("-> What did I accomplish today?")
    print("-" * 30)

    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                print("Exiting agent. Goodbye!")
                break

            if not user_input.strip():
                continue

            print("Agent: ", end="", flush=True)
            
            config = {"configurable": {"thread_id": "1"}}
            all_metadata = []  # Collect metadata for optional display at the end
            
            for token, metadata in agent.stream(
                {"messages": [{"role": "user", "content": user_input}]}, 
                stream_mode="messages", 
                config=config
            ):
                # Collect metadata if display_extra is enabled
                if display_extra:
                    all_metadata.append({
                        "node": metadata.get('langgraph_node'),
                        "content_blocks": token.content_blocks
                    })
                
                # Only display text content blocks
                for block in token.content_blocks:
                    if block.get('type') == 'text':
                        print(block.get('text', ''), end="", flush=True)
            
            print()  # New line after streaming completes
            
            # Display extra information if enabled
            if display_extra:
                print("\n" + "="*50)
                print("Extra Information:")
                print("="*50)
                for idx, meta in enumerate(all_metadata, 1):
                    if meta['content_blocks']:  # Only show non-empty blocks
                        print(f"\n[{idx}] Node: {meta['node']}")
                        print(f"Content blocks: {meta['content_blocks']}")
                print("="*50 + "\n")

        except KeyboardInterrupt:
            print("\nExiting agent. Goodbye!")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            import traceback
            traceback.print_exc()
            # Optionally, you might want to break the loop on certain errors
            # break

def main():
    """
    Main function to run the accomplishment tracking agent using LangChain.
    """
    # Load environment variables from .env file
    load_dotenv()

    print("Initializing LangChain agent...")

    # Check for LLM configuration
    llm_model = os.getenv("LLM_MODEL", "llama3.2")
    llm_base_url = os.getenv("LLM_BASE_URL", "http://localhost:8081/v1")
    print(f"Using LLM model: {llm_model}")
    print(f"LLM base URL: {llm_base_url}")

    # Initialize the LLM
    llm = ChatOpenAI(
        model=llm_model,
        temperature=0,
        base_url=llm_base_url,
        api_key="not-needed",  # llama.cpp doesn't require API key
    )

    # Define the tools
    tools = [add_accomplishment, list_accomplishments, list_accomplishments_by_date, search_accomplishments, list_tags, list_categories, create_category, update_accomplishment, delete_accomplishment, get_stats, weekly_summary]

    # Define the system prompt
    system_prompt = """You are a helpful assistant that helps users track their accomplishments.

        AVAILABLE TOOLS:
        - add_accomplishment: Add a new accomplishment (title, category, tags, description)
        - list_accomplishments: List accomplishments with pagination (default 5 per page)
        - list_accomplishments_by_date: Filter by timeframe (today/week/month/year) or date range
        - search_accomplishments: Find accomplishments by title text, date range, tag, and/or category; returns their IDs
        - list_tags: Show all available tags in the system
        - list_categories: Show all available categories in the system
        - create_category: Add a NEW category — only on the user's explicit request (see below)
        - update_accomplishment: Update an existing accomplishment by its ID
        - delete_accomplishment: Delete an accomplishment by its ID (destructive)
        - get_stats: Aggregate statistics (totals, category/tag breakdowns, most active day, streak)
        - weekly_summary: Data for a natural-language recap of a period (today/week/month/year)

        BEHAVIOR GUIDELINES:
        1. **Data Retrieval (Listing/Viewing)**: When a tool returns a list of items or data, output it EXACTLY as received. Do NOT attempt to "correct", "fix", or "rewrite" the output of the list tool. Do not strip emojis. Do not duplicate the content or send the same content more than once.

        WHEN DELETING ACCOMPLISHMENTS:
        1. delete_accomplishment is destructive and cannot be undone.
        2. If you don't already know the ID, use search_accomplishments to find it first.
        3. Confirm the specific accomplishment with the user before calling delete_accomplishment.

        WHEN SUMMARIZING (weekly_summary / get_stats):
        - weekly_summary returns raw stats and a list. Do NOT just echo it back — write a
          short, friendly natural-language recap: totals, top categories/tags, the current
          streak, and a couple of notable accomplishments.
        - Use get_stats for direct "how many / what do I do most / what's my streak" questions.

        WHEN ADDING ACCOMPLISHMENTS:
        1. Extract the accomplishment title from their request
        2. Pick a category from the EXISTING set — call list_categories if you aren't sure
           what exists. Do not invent one and do not fall back to a generic default.
        3. Extract any tags mentioned
        4. Determine the description: if the user provided one, use it. If they did NOT provide a description,
           ALWAYS generate a concise one-sentence description in natural language from the title and context.
           Never send an empty description.
        5. Use the add_accomplishment tool with the appropriate parameters

        CATEGORIES ARE A CLOSED SET:
        - add_accomplishment and update_accomplishment NEVER create a category. If the one
          you pass doesn't exist, they save nothing and tell you so.
        - When that happens, ask the user which existing category to use. Only if they
          explicitly want a new one should you call create_category, then retry.
        - Never call create_category on your own initiative just to unblock a write.

        WHEN UPDATING ACCOMPLISHMENTS:
        1. update_accomplishment requires the accomplishment's ID.
        2. If you don't already know the ID, use search_accomplishments (by title text and/or date) to find it first.
        3. Then call update_accomplishment with the ID and only the fields that should change.

        When a user asks to list or view accomplishments:
        - Use list_accomplishments for general listing with pagination
        - Use list_accomplishments_by_date when the user mentions a specific time period like:
          * "today", "yesterday", "this week", "this month", "this year"
          * A specific date or date range
        
        By default, show accomplishments with page size of 5.

        When displaying accomplishment lists, show them EXACTLY as returned by the tools. Do not reformat, correct, or modify the output.

        Be friendly and encouraging. Offer congratulations and positive reinforcement when accomplishments are added or listed.
        IMPORTANT: 
        - Always confirm successful operations
        - Show list_tags or list_categories when user asks about available options
        - Do not invent or hallucinate information
        """

    # Create the agent
    agent = create_agent(
        llm, 
        tools,
        system_prompt=system_prompt,
        checkpointer=InMemorySaver()
    )

    chat_loop(agent)

if __name__ == "__main__":
    main()
