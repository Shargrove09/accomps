import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain.agents import create_agent
from tool_langchain import add_accomplishment


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
    tools = [add_accomplishment]

    # Define the system prompt
    system_prompt = """You are a helpful assistant that helps users track their accomplishments.
You have access to a tool called 'add_accomplishment' that allows you to add new accomplishments to the database.

When a user asks you to add an accomplishment:
1. Extract the accomplishment title from their request
2. Identify the category if mentioned (default to 'General' if not specified)
3. Extract any tags mentioned
4. Use the add_accomplishment tool with the appropriate parameters

Be friendly and confirm when you've successfully added an accomplishment."""

    # Create the agent
    agent = create_agent(
        llm, 
        tools, 
        system_prompt=system_prompt
    )

    print("\nAccomplishment Agent (LangChain) is ready!")
    print("Type 'exit' to quit.")
    print("You can now add accomplishments. For example:")
    print("-> Add that I deployed the new feature to production under the 'Work' category, and tag it with 'release' and 'deployment'.")
    print("-" * 30)

    # Start the chat loop
    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                print("Exiting agent. Goodbye!")
                break
            
            if not user_input.strip():
                continue

            response = agent.invoke({"messages": [{"role": "user", "content": user_input}]})
            
            # Extract the last message from the response
            if response and "messages" in response:
                last_message = response["messages"][-1]
                # Get the content from the message
                if hasattr(last_message, 'content'):
                    print(f"Agent: {last_message.content}")
                else:
                    print(f"Agent: {last_message}")
            else:
                print(f"Agent: {response}")

        except KeyboardInterrupt:
            print("\nExiting agent. Goodbye!")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            import traceback
            traceback.print_exc()
            # Optionally, you might want to break the loop on certain errors
            # break

if __name__ == "__main__":
    main()
