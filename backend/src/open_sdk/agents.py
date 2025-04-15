from agents import Agent
from src.open_sdk.config import MODEL_NAME
from src.open_sdk.tools import web_search

# Agent: Main Agent
def main_agent():
    return Agent(
        name="Bob",
        instructions="You are a helpful assistant tasked with web searching "
                     "Use 'web_search' tool if external info is needed. "
                     "Consider the chat history to maintain context.",
        model=MODEL_NAME,
        tools=[web_search],
    )