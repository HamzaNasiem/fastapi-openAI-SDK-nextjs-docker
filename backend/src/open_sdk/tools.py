from agents import function_tool
from tavily import TavilyClient
import os

@function_tool
def web_search(query: str) -> str:
    """
    Perform web search using Tavily API.

    Args:
        query (str): Search query.

    Returns:
        str: Search results or "No results found."
    """
    try:
        tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
        results = tavily_client.search(query)
        if not results:
            return "No results found."
        return str(results)
    except Exception as e:
        return f"Error in web search: {str(e)}"