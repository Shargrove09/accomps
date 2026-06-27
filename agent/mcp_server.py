"""accomps MCP server — exposes the Accomplishments tracker to a LangGraph agent.

A thin MCP facade over the existing LangChain tools in `tool.py`, which call the
Next.js REST backend (ACCOMPLISHMENT_API_URL, header x-api-key=AGENT_API_KEY).
Those env vars are read at call time, so we load `.env` here before serving.

Run:
    uv run python -m mcp_server                 # stdio (default; local dev)
    uv run python -m mcp_server --transport sse # SSE on :8002 (deployed)
"""
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

load_dotenv()

import tool as accomps_tools  # noqa: E402  (import after load_dotenv so env is ready)

mcp = FastMCP(
    "accomps",
    instructions=(
        "You are connected to the user's personal Accomplishments tracker. "
        "Use it to record achievements and to recall what the user has done — "
        "by recency or by date range. Reuse existing categories and tags for "
        "consistency (call list_tags / list_categories when unsure)."
    ),
)


@mcp.tool()
def add_accomplishment(title: str, category: str, tags: str, description: str = "") -> str:
    """Record a new accomplishment. `tags` is a comma-separated string. Clean up the
    title/description for typos and grammar before saving."""
    return accomps_tools.add_accomplishment.invoke(
        {"title": title, "category": category, "tags": tags, "description": description}
    )


@mcp.tool()
def list_accomplishments(pageSize: int = 5, page: int = 1) -> str:
    """List recent accomplishments (most recent first), paginated. pageSize 1-50."""
    return accomps_tools.list_accomplishments.invoke({"pageSize": pageSize, "page": page})


@mcp.tool()
def list_accomplishments_by_date(start_date: str = "", end_date: str = "", timeframe: str = "") -> str:
    """List accomplishments by date range (YYYY-MM-DD) or a timeframe shortcut:
    today | yesterday | week | month | year. Use either dates or a timeframe, not both."""
    return accomps_tools.list_accomplishments_by_date.invoke(
        {"start_date": start_date, "end_date": end_date, "timeframe": timeframe}
    )


@mcp.tool()
def list_tags() -> str:
    """List all existing tags, so new entries can reuse them for consistency."""
    return accomps_tools.list_tags.invoke({})


@mcp.tool()
def list_categories() -> str:
    """List all existing categories, so new entries can reuse them for consistency."""
    return accomps_tools.list_categories.invoke({})


@mcp.tool()
def update_accomplishment(
    accomplishment_id: str, title: str = "", category: str = "", tags: str = "", description: str = ""
) -> str:
    """Update an existing accomplishment by id. Only non-empty fields are changed."""
    return accomps_tools.update_accomplishment.invoke(
        {
            "accomplishment_id": accomplishment_id,
            "title": title,
            "category": category,
            "tags": tags,
            "description": description,
        }
    )


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--transport", choices=["stdio", "sse"], default="stdio")
    parser.add_argument("--port", type=int, default=8002)  # SCOUT MCP uses 8001
    args = parser.parse_args()

    if args.transport == "sse":
        # host/port live on settings in this FastMCP version, not run() kwargs
        mcp.settings.host = "0.0.0.0"
        mcp.settings.port = args.port
        mcp.run(transport="sse")
    else:
        mcp.run(transport="stdio")
