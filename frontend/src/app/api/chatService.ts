interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  session_id: string;
  query: string;
  response: string;
  history: ChatMessage[];
}

interface StreamEvent {
  type: 'session' | 'delta' | 'complete' | 'error';
  content?: string;
  session_id?: string;
  history?: ChatMessage[];
}

let currentSessionId: string | null = null;

export const sendMessage = (message: string): Promise<ChatResponse> =>
  new Promise((resolve, reject) => {
    try {
      // Create URL with query parameters
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/agent`);
      
      // Instead of using EventSource which makes GET requests, we'll use fetch with POST
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          session_id: currentSessionId,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        // Create a reader to read the stream
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is null');
        }
        
        let fullResponse = '';
        let sessionId = currentSessionId;
        let receivedHistory: ChatMessage[] = [];
        let buffer = '';
        
        // Function to process chunks of data
        const processStream = async () => {
          try {
            // Read data chunk
            const { done, value } = await reader.read();
            
            // If stream is done, resolve the promise
            if (done) {
              resolve({
                session_id: sessionId || 'unknown',
                query: message,
                response: fullResponse,
                history: receivedHistory,
              });
              return;
            }
            
            // Convert chunk to text
            const chunk = new TextDecoder().decode(value);
            buffer += chunk;
            
            // Process each line
            let lastEventEnd = 0;
            while (true) {
              const eventEnd = buffer.indexOf('\n\n', lastEventEnd);
              if (eventEnd === -1) break;
              
              const eventContent = buffer.substring(lastEventEnd, eventEnd);
              lastEventEnd = eventEnd + 2;
              
              // Process the event
              if (eventContent.startsWith('data: ')) {
                try {
                  const jsonData = JSON.parse(eventContent.substring(6).trim());
                  
                  // Handle different event types
                  if (jsonData.type === 'session' && jsonData.session_id) {
                    sessionId = jsonData.session_id;
                    currentSessionId = sessionId;
                  } else if (jsonData.type === 'delta' && jsonData.content) {
                    fullResponse += jsonData.content;
                    // Dispatch custom event for streaming updates
                    window.dispatchEvent(new CustomEvent('stream-delta', {
                      detail: { delta: jsonData.content, role: 'assistant' }
                    }));
                  } else if (jsonData.type === 'complete' && jsonData.history) {
                    receivedHistory = jsonData.history;
                  } else if (jsonData.type === 'error') {
                    throw new Error(jsonData.content || 'Unknown error occurred');
                  }
                } catch (e) {
                  console.error('Error parsing event:', e);
                }
              }
            }
            
            // Remove processed data from buffer
            buffer = buffer.substring(lastEventEnd);
            
            // Continue reading
            processStream();
          } catch (error) {
            reject(error);
          }
        };
        
        // Start processing the stream
        processStream();
      })
      .catch(error => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};