import os
from dotenv import load_dotenv
from llama_index.llms.ollama import Ollama
from llama_index.core.agent import ReActAgent
from tool import add_accomplishment_tool

def main():
    """
    Main function to run the accomplishment tracking agent.
    """
    # Load environment variables from .env file
    load_dotenv()

    print("Initializing agent...")

    # Check for Ollama model configuration
    ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    print(f"Using Ollama model: {ollama_model}")

    # Initialize the LLM
    llm = Ollama(model=ollama_model, request_timeout=120.0, context_window=8000)

    # Create the agent with the accomplishment tool
    agent = ReActAgent.from_tools([add_accomplishment_tool], llm=llm, verbose=True)

    print("\nAccomplishment Agent is ready!")
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

            response = agent.chat(user_input)
            print(f"Agent: {response}")

        except KeyboardInterrupt:
            print("\nExiting agent. Goodbye!")
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            # Optionally, you might want to break the loop on certain errors
            # break

if __name__ == "__main__":
    main()
