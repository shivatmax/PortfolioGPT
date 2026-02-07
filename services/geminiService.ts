import { GoogleGenAI, Type, FunctionDeclaration, Tool, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION, CONFIG } from "../constants";
import { Message } from "../types";

// Define the tools available to the model
const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "openContact",
        description: "Open the contact form modal. Use this when the user wants to book a meeting or contact or message Shiv.",
      },
      {
        name: "sendMessage",
        description: "Send an email message to Shiv. Use this when the user provides specific message content to send.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The name of the sender." },
            email: { type: Type.STRING, description: "The email address of the sender." },
            message: { type: Type.STRING, description: "The message content." },
          },
          required: ["name", "email", "message"],
        },
      },
      {
        name: "showProjects",
        description: "Display Shiv's projects in a visual card format. Use this when the user asks to see projects, portfolio, or work examples.",
      },
      {
        name: "showExperience",
        description: "Display Shiv's professional experience timeline. Use this when the user asks about work history or experience.",
      },
      {
        name: "showAbout",
        description: "Navigate to the About/Skills page. Use this when the user asks about Shiv's profile or wants to see the about page.",
      },
      {
        name: "showSkills",
        description: "Display Shiv's technical skills and expertise. Use this when the user asks about skills, stack, or technologies.",
      },
      {
        name: "showStory",
        description: "Display Shiv's personal story and journey as a timeline/novel. Use this when the user asks about his story, journey, background, or how he started.",
      },
    ],
  },
];

const MODELS = [
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-flash-lite-latest',
  'gemini-2.0-flash',
  'gemma-3-27b-it'
];

// OpenAI-compatible tools definition for fallback
const OPENAI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "openContact",
      description: "Open the contact form modal. Use this when the user wants to book a meeting or contact Shiv.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "sendMessage",
      description: "Send an email message to Shiv. Use this when the user provides specific message content to send.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the sender." },
          email: { type: "string", description: "The email address of the sender." },
          message: { type: "string", description: "The message content." },
        },
        required: ["name", "email", "message"],
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "showProjects",
      description: "Display Shiv's projects in a visual card format. Use this when the user asks to see projects, portfolio, or work examples.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "showExperience",
      description: "Display Shiv's professional experience timeline. Use this when the user asks about work history or experience.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "showAbout",
      description: "Navigate to the About/Skills page. Use this when the user asks about Shiv's profile or wants to see the about page.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "showSkills",
      description: "Display Shiv's technical skills and expertise. Use this when the user asks about skills, stack, or technologies.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "showStory",
      description: "Display Shiv's personal story and journey as a timeline/novel. Use this when the user asks about his story, journey, background, or how he started.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  }
];

export const streamResponse = async (
  history: Message[],
  userPrompt: string,
  onChunk: (text: string) => void,
  toolExecutor: (name: string, args: any) => Promise<any>,
  systemInstruction?: string,
  modelIndex: number = -1 // -1 means OpenAI (primary), 0+ means Gemini fallback
): Promise<void> => {

  // Try OpenAI first (modelIndex === -1)
  if (modelIndex === -1) {
    if (CONFIG.openAiApiKey) {
      try {
        console.log('[Service] Trying primary model: OpenAI gpt-4o-mini');
        await streamResponseOpenAI(history, userPrompt, onChunk, toolExecutor, systemInstruction);
        return;
      } catch (openaiError: any) {
        console.error('[OpenAI] Primary model failed:', openaiError);
        // Fall through to Gemini fallback
        return streamResponse(history, userPrompt, onChunk, toolExecutor, systemInstruction, 0);
      }
    } else {
      console.log('[Service] OpenAI key not found, skipping to Gemini...');
      return streamResponse(history, userPrompt, onChunk, toolExecutor, systemInstruction, 0);
    }
  }

  // Gemini fallback models (modelIndex >= 0)
  const currentModelIndex = Math.min(modelIndex, MODELS.length - 1);
  const modelName = MODELS[currentModelIndex];

  console.log(`[GeminiService] Using Gemini fallback (Tier ${currentModelIndex + 1}): ${modelName}`);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Construct the chat history with system instruction for the chat
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction || SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: tools,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    });

    let result = await chat.sendMessageStream({
      message: userPrompt
    });

    // Handle the initial response (might be text or a function call)
    let functionCalls: any[] = [];

    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }

      // Check for function calls in the stream
      const calls = chunk.functionCalls;
      if (calls && calls.length > 0) {
        functionCalls.push(...calls);
      }
    }

    // If there were function calls, execute them and send results back
    if (functionCalls.length > 0) {
      const toolResponses: Part[] = [];

      for (const call of functionCalls) {
        try {
          // Notify UI that a tool is being executed (optional)
          // onChunk(`\n\n*Executing ${call.name}...*`); 

          const result = await toolExecutor(call.name, call.args);

          toolResponses.push({
            functionResponse: {
              name: call.name,
              id: call.id,
              response: { result: result }
            }
          });
        } catch (err) {
          console.error(`Error executing tool ${call.name}:`, err);
          toolResponses.push({
            functionResponse: {
              name: call.name,
              id: call.id,
              response: { error: "Failed to execute tool" }
            }
          });
        }
      }

      // Send the tool results back to the model to generate the final response
      if (toolResponses.length > 0) {
        // Fix: Pass toolResponses array wrapped in message object.
        // The SDK expects { message: string | (string | Part)[] }
        const nextResult = await chat.sendMessageStream({ message: toolResponses });

        for await (const chunk of nextResult) {
          const text = chunk.text;
          if (text) {
            onChunk(text);
          }
        }
      }
    }

  } catch (error: any) {
    console.error(`Gemini API Error (Model: ${modelName}):`, error);

    // Parse error details
    const errorMessage = error?.message || error?.toString() || '';
    const errorStatus = error?.status || error?.code;

    // Check for various error types
    const isRateLimit = errorMessage.includes('429') ||
      errorStatus === 429 ||
      errorMessage.includes('Quota exceeded') ||
      errorMessage.includes('quota');

    const isOverloaded = errorMessage.includes('UNAVAILABLE') ||
      errorMessage.includes('overloaded') ||
      errorStatus === 503;

    const isNetworkError = errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('network') ||
      errorMessage.includes('ECONNREFUSED');

    const isAuthError = errorMessage.includes('401') ||
      errorMessage.includes('403') ||
      errorMessage.includes('API_KEY') ||
      errorMessage.includes('authentication');

    const isTimeout = errorMessage.includes('timeout') ||
      errorMessage.includes('DEADLINE_EXCEEDED');

    const hasNextModel = currentModelIndex < MODELS.length - 1;

    // Try next Gemini model for rate limits and overloaded errors
    if ((isRateLimit || isOverloaded) && hasNextModel) {
      const nextModel = MODELS[currentModelIndex + 1];
      const reason = isOverloaded ? 'Model overloaded' : 'Rate limit exceeded';
      console.log(`[GeminiService] ${reason} on ${modelName}. Retrying with ${nextModel} (Tier ${currentModelIndex + 2})...`);

      return streamResponse(history, userPrompt, onChunk, toolExecutor, systemInstruction, currentModelIndex + 1);
    }

    // User-friendly error messages based on error type
    let userMessage = "";

    if (isOverloaded) {
      userMessage = `
⚠️ **The AI is currently experiencing high demand**

The servers are temporarily overloaded. This usually resolves within a few minutes.

**What you can do:**
- Wait a moment and try again
- Refresh the page if the issue persists
- Try using voice mode as an alternative

*Don't worry, your conversation is saved!*`;
    } else if (isRateLimit) {
      userMessage = `
⚠️ **Rate limit reached**

We've hit the API usage limit temporarily. This happens during peak usage.

**Please try again in a few seconds.** Your message was received and will work shortly!`;
    } else if (isNetworkError) {
      userMessage = `
🌐 **Network Connection Issue**

There seems to be a problem connecting to the AI service.

**Please check:**
- Your internet connection is stable
- Try refreshing the page
- If using a VPN, try disabling it temporarily`;
    } else if (isAuthError) {
      userMessage = `
🔑 **Authentication Error**

There's an issue with the API configuration. Please contact the administrator.`;
    } else if (isTimeout) {
      userMessage = `
⏱️ **Request Timeout**

The request took too long to process. This can happen with complex queries.

**Try:**
- Breaking your question into smaller parts
- Asking a simpler question first`;
    } else {
      userMessage = `
😔 **Something went wrong**

I encountered an unexpected error while processing your request.

**You can try:**
- Sending your message again
- Refreshing the page
- Using the voice mode for a different experience

*Error details have been logged for debugging.*`;
    }

    onChunk(userMessage);
  }
};

// OpenAI  Implementation using gpt-4o-mini
const streamResponseOpenAI = async (
  history: Message[],
  userPrompt: string,
  onChunk: (text: string) => void,
  toolExecutor: (name: string, args: any) => Promise<any>,
  systemInstruction?: string
): Promise<void> => {
  const apiKey = CONFIG.openAiApiKey;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Convert history to OpenAI format
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemInstruction || SYSTEM_INSTRUCTION }
  ];

  for (const msg of history) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.content
    });
  }

  // Add current user message
  messages.push({ role: 'user', content: userPrompt });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      tools: OPENAI_TOOLS,
      stream: true,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';
  let toolCalls: Array<{ id: string; name: string; arguments: string }> = [];
  let currentToolCall: { id: string; name: string; arguments: string } | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const delta = json.choices?.[0]?.delta;

        if (delta?.content) {
          onChunk(delta.content);
        }

        // Handle tool calls
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            if (tc.index !== undefined) {
              if (tc.id) {
                // New tool call started
                if (currentToolCall) {
                  toolCalls.push(currentToolCall);
                }
                currentToolCall = { id: tc.id, name: tc.function?.name || '', arguments: '' };
              }
              if (tc.function?.name && currentToolCall) {
                currentToolCall.name = tc.function.name;
              }
              if (tc.function?.arguments && currentToolCall) {
                currentToolCall.arguments += tc.function.arguments;
              }
            }
          }
        }
      } catch (e) {
        // Skip invalid JSON lines
      }
    }
  }

  // Push the last tool call if exists
  if (currentToolCall) {
    toolCalls.push(currentToolCall);
  }

  // Execute tool calls if any
  if (toolCalls.length > 0) {
    const toolMessages: Array<{ role: string; content: string; tool_call_id?: string }> = [];

    for (const call of toolCalls) {
      try {
        let args = {};
        if (call.arguments) {
          try {
            args = JSON.parse(call.arguments);
          } catch { }
        }
        const result = await toolExecutor(call.name, args);
        toolMessages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify({ result })
        });
      } catch (err) {
        toolMessages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify({ error: 'Failed to execute tool' })
        });
      }
    }

    // Send tool results back to get final response
    const followUpMessages = [
      ...messages,
      {
        role: 'assistant',
        content: null,
        tool_calls: toolCalls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: { name: tc.name, arguments: tc.arguments }
        }))
      },
      ...toolMessages
    ];

    const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: followUpMessages,
        stream: true,
        temperature: 0.7
      })
    });

    if (followUpResponse.ok) {
      const followReader = followUpResponse.body?.getReader();
      if (followReader) {
        let followBuffer = '';
        while (true) {
          const { done, value } = await followReader.read();
          if (done) break;

          followBuffer += decoder.decode(value, { stream: true });
          const lines = followBuffer.split('\n');
          followBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (!trimmed.startsWith('data: ')) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch { }
          }
        }
      }
    }
  }
};

export const generateChatTitle = async (userPrompt: string): Promise<string> => {
  const tryGenerate = async (model: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: model,
      contents: `Generate a short, concise title (max 5-6 words) for a chat session that starts with this user message: "${userPrompt}". Return ONLY the title text. Do not use quotes.`,
    });
    return response.text?.trim() || '';
  };

  try {
    return await tryGenerate('gemma-3-27b-it');
  } catch (error: any) {
    if (error?.message?.includes('429') || error?.status === 429) {
      // Fallback to the lightest model available
      const fallbackModel = MODELS[MODELS.length - 1];
      console.log(`[GeminiService] Title gen rate limit on gemma-3-27b-it. Retrying with ${fallbackModel}...`);
      try {
        return await tryGenerate(fallbackModel);
      } catch (e) {
        console.error("Error generating title (fallback failed):", e);
      }
    }
    console.error("Error generating title:", error);
    return '';
  }
};