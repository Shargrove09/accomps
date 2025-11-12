# Accomplishment Agent - LangChain Implementation

This directory contains a LangChain-based implementation of the accomplishment tracking agent, alongside the original LlamaIndex version.

## Files

- **main_langchain.py** - Main agent implementation using LangChain
- **tool_langchain.py** - Tool definition for adding accomplishments using LangChain
- **pyproject_langchain.toml** - Dependencies for the LangChain version

## Original Files (LlamaIndex)

- **main.py** - Original LlamaIndex implementation
- **tool.py** - Original LlamaIndex tool definition
- **pyproject.toml** - Original dependencies

## Setup

### Prerequisites

1. Install dependencies:
```bash
# For LangChain version
pip install langchain langchain-ollama python-dotenv requests

# Or use uv (recommended)
uv pip install langchain langchain-ollama python-dotenv requests
```

2. Make sure you have Ollama installed and running with a compatible model (e.g., `llama3.2:3b`)

3. Create a `.env` file in the agent directory with the following variables:
```
OLLAMA_MODEL=llama3.2:3b
ACCOMPLISHMENT_API_URL=http://localhost:3000/api/agent/accomplishments
AGENT_API_KEY=your-api-key-here
```

## Running the LangChain Agent

```bash
python main_langchain.py
```

## Key Differences from LlamaIndex

### Architecture
- **LlamaIndex**: Uses `ReActAgent.from_tools()` with `FunctionTool`
- **LangChain**: Uses `create_react_agent()` with the `@tool` decorator and `AgentExecutor`

### Tool Definition
- **LlamaIndex**: `FunctionTool.from_defaults(fn=add_accomplishment)`
- **LangChain**: Uses the `@tool` decorator directly on the function

### Agent Interaction
- **LlamaIndex**: `agent.chat(user_input)` returns a response directly
- **LangChain**: `agent_executor.invoke({"input": user_input})` returns a dictionary with `output` key

### Tags Handling
- **LlamaIndex**: Accepts `list[str]` directly
- **LangChain**: Accepts comma-separated string (parsed to list internally for better LLM compatibility)

## Features

Both implementations support:
- ✅ Natural language accomplishment tracking
- ✅ Category assignment
- ✅ Tag management
- ✅ Integration with the Next.js API
- ✅ ReAct (Reasoning and Acting) agent pattern
- ✅ Verbose mode for debugging
- ✅ Error handling and recovery

## Example Usage

```
You: Add that I deployed the new feature to production under the 'Work' category, and tag it with 'release' and 'deployment'.

Agent: [Processes the request and adds the accomplishment]

You: Add that I completed the LangChain tutorial in the 'Learning' category, tag it with 'AI' and 'tutorial'.

Agent: [Processes and confirms]
```

## Choosing Between Implementations

### Use LlamaIndex (`main.py`) if:
- You're already invested in the LlamaIndex ecosystem
- You want tighter integration with LlamaIndex's data connectors
- You prefer the simpler API surface

### Use LangChain (`main_langchain.py`) if:
- You need more flexibility in agent design
- You want access to LangChain's extensive ecosystem
- You plan to add more complex chains or workflows
- You need better community support and documentation

## Troubleshooting

If the agent fails to connect to the API:
1. Make sure the Next.js server is running (`npm run dev`)
2. Verify the `ACCOMPLISHMENT_API_URL` in your `.env` file
3. Check that the `AGENT_API_KEY` matches the one configured in your API route

If Ollama models aren't loading:
1. Ensure Ollama is running: `ollama serve`
2. Pull the model: `ollama pull llama3.2:3b`
3. Verify the model name in your `.env` file matches an available model
