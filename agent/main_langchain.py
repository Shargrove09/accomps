import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from tool_langchain import add_accomplishment, list_accomplishments, list_accomplishments_by_date, list_tags, list_categories, update_accomplishment
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

    # Check for Ollama model configuration
    ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    print(f"Using Ollama model: {ollama_model}")

    # Initialize the LLM
    llm = ChatOllama(
        model=ollama_model,
        temperature=0,
    )

    # Define the tools
    tools = [add_accomplishment, list_accomplishments, list_accomplishments_by_date, list_tags, list_categories, update_accomplishment]

    # Define the system prompt
    system_prompt = """You are a helpful assistant that helps users track their accomplishments.

        AVAILABLE TOOLS:
        - add_accomplishment: Add a new accomplishment (title, category, tags, description)
        - list_accomplishments: List accomplishments with pagination (default 5 per page)
        - list_accomplishments_by_date: Filter by timeframe (today/week/month/year) or date range
        - list_tags: Show all available tags in the system
        - list_categories: Show all available categories in the system
                
        BEHAVIOR GUIDELINES:        
        1. **Data Retrieval (Listing/Viewing)**: When a tool returns a list of items or data, output it EXACTLY as received. Do NOT attempt to "correct", "fix", or "rewrite" the output of the list tool. Do not strip emojis. Do not duplicate the content or send the same content more than once.

        WHEN ADDING ACCOMPLISHMENTS:
        1. Extract the accomplishment title from their request
        2. Identify the category if mentioned (default to 'General' if not specified)
        3. Extract any tags mentioned
        4. Extract the description if provided (if not provided, you can provide a brief description based on the title)
        5. Use the add_accomplishment tool with the appropriate parameters

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
