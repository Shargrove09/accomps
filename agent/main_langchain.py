import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from tool_langchain import add_accomplishment, list_accomplishments
from langgraph.checkpoint.memory import InMemorySaver


display_extra = False

def chat_loop(agent):
    print("\nAccomplishment Agent (LangChain) is ready!")
    print("Type 'exit' to quit.")
    print("You can now add or list accomplishments. For example:")
    print("-> Add that I deployed the new feature to production under the 'Work' category, and tag it with 'release' and 'deployment'.")
    print("-> List my recent accomplishments")
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
    tools = [add_accomplishment, list_accomplishments]

    # Define the system prompt
    system_prompt = """You are a helpful assistant that helps users track their accomplishments.
        You have access to tools for managing accomplishments:
        - add_accomplishment: Adds a new accomplishment to the database
        - list_accomplishments: Lists existing accomplishments

        When a user asks you to add an accomplishment:
        1. Extract the accomplishment title from their request
        2. Identify the category if mentioned (default to 'General' if not specified)
        3. Extract any tags mentioned
        4. Use the add_accomplishment tool with the appropriate parameters

        When a user asks to list or view accomplishments, use the list_accomplishments tool.

        Be friendly and confirm when you've successfully added an accomplishment."""

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
