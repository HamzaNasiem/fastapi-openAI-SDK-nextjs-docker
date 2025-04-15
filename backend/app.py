# Required imports
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai.types.responses import ResponseTextDeltaEvent
from fastapi.middleware.cors import CORSMiddleware
import uuid
import json
from openai import AsyncOpenAI

# Import the agent modulopenai_openai_agents_e and tools
from src.open_sdk.agents import main_agent
from agents import Runner

# Initialize FastAPI app
app = FastAPI(title="Chatbot + web search")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dictionary to store chat sessions
sessions = {}

# Query model for request validation
class Query(BaseModel):
    query: str  # User's input query
    session_id: str | None = None  # Optional session ID

async def stream_agent_response(agent, chat_history, session_id):
    """
    Generator function to stream agent responses as Server-Sent Events (SSE).
    """
    try:
        # Return session ID as initial event
        yield f"data: {json.dumps({'type': 'session', 'session_id': session_id})}\n\n"
        
        # Run the agent with streaming
        result = Runner.run_streamed(agent, chat_history)
        response_content = []
        
        # Stream each token as it's generated
        async for event in result.stream_events():
            if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
                delta = event.data.delta
                if delta:  # Only send non-empty deltas
                    response_content.append(delta)
                    # Send delta as SSE
                    yield f"data: {json.dumps({'type': 'delta', 'content': delta})}\n\n"
        
        # Combine all deltas to get the full response
        full_response = "".join(response_content)
        
        # Add the complete response to chat history
        chat_history.append({"role": "assistant", "content": full_response})
        sessions[session_id] = chat_history
        
        # Send complete response as final event
        yield f"data: {json.dumps({'type': 'complete', 'content': full_response, 'history': chat_history[-4:]})}\n\n"
    
    except Exception as e:
        # Send error event
        yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

@app.post("/agent")
async def my_agent(query: Query):
    try:
        # Generate new session ID if not provided
        session_id = query.session_id or str(uuid.uuid4())

        # Initialize new chat history for new sessions
        if session_id not in sessions:
            sessions[session_id] = []
        chat_history = sessions[session_id].copy()  # Make a copy to avoid mutations during streaming
        
        # Add user query to chat history
        chat_history.append({"role": "user", "content": query.query})
        
        # Initialize agent
        agent = main_agent()
        
        # Return streaming response
        return StreamingResponse(
            stream_agent_response(agent, chat_history, session_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
                "Access-Control-Allow-Origin": "*"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}