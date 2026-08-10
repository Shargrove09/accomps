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
        "by recency or by date range.\n\n"
        "ADDING: Only call add_accomplishment when the user's CURRENT message "
        "describes a brand-new accomplishment. If the current message is a greeting, "
        "a question, a request about existing entries, empty, or ambiguous, do NOT add "
        "anything — ask what they'd like to record. Never re-add a previously logged "
        "accomplishment. When a message is NOT a new accomplishment, respond to that "
        "message on its own — do NOT restate, re-confirm, or echo an accomplishment "
        "from an earlier turn unless the user explicitly asks about it.\n\n"
        "TAGS: Reuse existing tags for consistency — call list_tags when unsure, and "
        "prefer an existing name over a new variant. Close variants snap onto an "
        "existing tag automatically. An accomplishment may introduce at most 2 "
        "genuinely-new tags; extras are skipped and reported back to you, so lead with "
        "the new tags that matter most and relay any skips to the user.\n\n"
        "CATEGORIES ARE A CLOSED SET. add_accomplishment and update_accomplishment "
        "will NEVER create a category; if the one you pass doesn't exist they save "
        "nothing and say so. When that happens, ASK THE USER which existing category "
        "to use. Only if the user explicitly wants a new category should you call "
        "create_category — never call it on your own initiative to get a blocked "
        "write to go through."
    ),
)


@mcp.tool()
def add_accomplishment(
    title: str, category: str, tags: str, description: str = ""
) -> str:
    """Record a new accomplishment described in the user's CURRENT message. `tags` is a
    comma-separated string. Reuse existing categories/tags (call list_categories /
    list_tags when unsure). Clean up the title/description for typos and grammar. When
    this is a new accomplishment and the user gave no description, generate a concise
    one-sentence description from the title/context.

    `category` must ALREADY EXIST — this tool never creates one. Close variants (case,
    plurals, small typos) snap to the existing category automatically. If it matches
    nothing, this returns WITHOUT saving and you must ask the user which category to
    use."""
    return accomps_tools.add_accomplishment.invoke(
        {
            "title": title,
            "category": category,
            "tags": tags,
            "description": description,
        }
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
def search_accomplishments(
    query: str = "", start_date: str = "", end_date: str = "", tag: str = "", category: str = ""
) -> str:
    """Search accomplishments by title text, date range (YYYY-MM-DD), tag, and/or
    category. `tag` may be a single name or comma-separated (matches ANY). Returns
    matching entries including their IDs — use this to find an accomplishment's ID
    before calling update_accomplishment or delete_accomplishment."""
    return accomps_tools.search_accomplishments.invoke(
        {
            "query": query,
            "start_date": start_date,
            "end_date": end_date,
            "tag": tag,
            "category": category,
        }
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
def create_category(name: str, description: str = "") -> str:
    """Add a NEW category to the tracker's taxonomy. Separate from add_accomplishment
    on purpose: recording an accomplishment never creates a category, so this is the
    single deliberate act that grows the set — and the user gets to see and approve it
    as its own step.

    ONLY call this when the user explicitly asked for a new category, or agreed to one
    you proposed by name. Do NOT call it to unblock a refused add_accomplishment — ask
    the user instead. Categories cannot be deleted once used, only merged."""
    return accomps_tools.create_category.invoke({"name": name, "description": description})


@mcp.tool()
def update_accomplishment(
    accomplishment_id: str, title: str = "", category: str = "", tags: str = "", description: str = ""
) -> str:
    """Update an existing accomplishment by id. Only non-empty fields are changed.
    As with add_accomplishment, `category` must already exist — this never creates one."""
    return accomps_tools.update_accomplishment.invoke(
        {
            "accomplishment_id": accomplishment_id,
            "title": title,
            "category": category,
            "tags": tags,
            "description": description,
        }
    )


@mcp.tool()
def delete_accomplishment(accomplishment_id: str) -> str:
    """Delete an accomplishment by id. DESTRUCTIVE and irreversible — first confirm
    the id via search_accomplishments and confirm the user's intent to delete it."""
    return accomps_tools.delete_accomplishment.invoke(
        {"accomplishment_id": accomplishment_id}
    )


@mcp.tool()
def get_stats(timeframe: str = "", start_date: str = "", end_date: str = "") -> str:
    """Get aggregate stats: totals, per-category and per-tag breakdowns, most active
    day, and the current logging streak. Optional scope: timeframe (today|week|month|
    year) or explicit start_date/end_date (YYYY-MM-DD); omit for all-time."""
    return accomps_tools.get_stats.invoke(
        {"timeframe": timeframe, "start_date": start_date, "end_date": end_date}
    )


@mcp.tool()
def weekly_summary(timeframe: str = "week") -> str:
    """Gather stats + accomplishments for a period (today|week|month|year, default
    week) and narrate a short natural-language recap — do not just echo raw numbers."""
    return accomps_tools.weekly_summary.invoke({"timeframe": timeframe})


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
