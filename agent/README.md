# Accomplishments AI Agent

This directory contains a Python-based AI agent that uses LlamaIndex and Ollama to add accomplishments to your tracker via a chat interface.

## Setup

1.  **Install Dependencies**: Make sure you have [Poetry](https://python-poetry.org/docs/#installation) installed. Then, from within this `agent` directory, run:

    ```bash
    poetry install
    ```

2.  **Configure Environment**:

    - Copy the `.env` file.
    - `AGENT_API_KEY`: Set a secure, secret ke
      `y. This same key must be added to a `.env.local` file in the root of your Next.js project.
    - `ACCOMPLISHMENT_API_URL`: This is pre-configured for the local Next.js development server.
    - `OLLAMA_MODEL`: (Optional) Specify which Ollama model to use (e.g., `llama3`, `mistral`). Defaults to `llama3`.

3.  **Configure Next.js**:
    - In the root directory of the `accomps` project, create a file named `.env.local`.
    - Add the following line, ensuring the key matches the one in the agent's `.env` file:
      ```
      AGENT_API_KEY="your-secret-api-key-here"
      ```

## How It Works

- `main.py`: The entry point for the agent. It initializes the Ollama LLM and a `ReActAgent` from LlamaIndex. It then starts a command-line chat loop.
- `tool.py`: Defines the `add_accomplishment` function, which is the "tool" the agent can use. This function makes a secure API call to the Next.js backend.
- `pyproject.toml`: Manages the Python project dependencies.

## Running the Agent

1.  **Start the Next.js App**: Make sure your main web application is running. From the root directory:

    ```bash
    npm run dev
    ```

2.  **Run the Agent**: From within this `agent` directory, run:
    ```bash
    poetry run python main.py
    ```

You can now chat with the agent to add your accomplishments.
