import type { CaptionChunk, ContextType, AIProvider } from '@/types';

interface AIProcessingOptions {
  captions: CaptionChunk[];
  context: ContextType;
  aiProvider: AIProvider;
  apiKey: string;
}

interface AIResult {
  success: boolean;
  summary?: string;
  suggestions?: string[];
  actionItems?: string[];
  error?: string;
}

// Main AI processing handler
export async function handleAIProcessing(options: AIProcessingOptions): Promise<AIResult> {
  const { captions, context, aiProvider, apiKey } = options;

  try {
    // Get system prompt based on context
    const systemPrompt = getSystemPrompt(context);

    // Build transcript text from captions
    const transcript = captions
      .map((c) => `[${new Date(c.timestamp).toLocaleTimeString()}] ${c.speaker}: ${c.text}`)
      .join('\n');

    // Call AI provider
    const aiResponse = await callAIProvider({
      systemPrompt,
      transcript,
      aiProvider,
      apiKey,
    });

    // Parse AI response
    const parsed = parseAIResponse(aiResponse);

    return {
      success: true,
      summary: parsed.summary,
      suggestions: parsed.suggestions,
      actionItems: parsed.actionItems,
    };
  } catch (error) {
    console.error('[MeetAssist] AI processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown AI processing error',
    };
  }
}

// Get system prompt based on meeting context
function getSystemPrompt(context: ContextType): string {
  switch (context) {
    case 'technical':
      return `You are a helpful technical meeting assistant. Analyze the meeting transcript and provide:

1. A concise technical summary (in Vietnamese) focusing on:
   - Architecture decisions
   - Technical discussions and debates
   - Bug reports and root causes
   - Tech stack mentions
   - GitHub issues or PR references
   - Libraries or frameworks discussed
   - Deployment strategies

2. Suggested solutions (in Vietnamese) for any technical blockers or challenges mentioned.

3. Action items (in Vietnamese) for technical tasks.

Format your response as JSON with the following structure:
{
  "summary": "Meeting summary in Vietnamese...",
  "action_items": ["Task 1", "Task 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

    case 'business':
      return `You are a professional business meeting assistant. Analyze the meeting transcript and provide:

1. A business summary (in Vietnamese) focusing on:
   - Customer pain points and needs
   - Budget discussions and KPIs
   - Deadlines and deliverables
   - Contract negotiations
   - Pricing models
   - Business decisions made

2. Suggested solutions (in Vietnamese) for business challenges.

3. Action items (in Vietnamese) for business tasks and follow-ups.

Format your response as JSON with the following structure:
{
  "summary": "Meeting summary in Vietnamese...",
  "action_items": ["Task 1", "Task 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

    case 'general':
    default:
      return `You are a helpful meeting assistant. Analyze the meeting transcript and provide:

1. A clear summary (in Vietnamese) including:
   - Who said what
   - Key decisions made
   - Main topics discussed

2. Action items (in Vietnamese) for follow-up tasks.

3. Any suggestions (in Vietnamese) for improvements or solutions.

Format your response as JSON with the following structure:
{
  "summary": "Meeting summary in Vietnamese...",
  "action_items": ["Task 1", "Task 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;
  }
}

// Call the selected AI provider
async function callAIProvider(options: {
  systemPrompt: string;
  transcript: string;
  aiProvider: AIProvider;
  apiKey: string;
}): Promise<string> {
  const { systemPrompt, transcript, aiProvider, apiKey } = options;

  switch (aiProvider) {
    case 'glm':
      return callGLMAPI(systemPrompt, transcript, apiKey);
    case 'openai':
      return callOpenAIAPI(systemPrompt, transcript, apiKey);
    case 'gemini':
      return callGeminiAPI(systemPrompt, transcript, apiKey);
    default:
      throw new Error(`Unsupported AI provider: ${aiProvider}`);
  }
}

// Call GLM API
async function callGLMAPI(systemPrompt: string, transcript: string, apiKey: string): Promise<string> {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4.5v',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcript },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GLM API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Call OpenAI API
async function callOpenAIAPI(systemPrompt: string, transcript: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcript },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Call Gemini API
async function callGeminiAPI(systemPrompt: string, transcript: string, apiKey: string): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: transcript },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

// Parse AI response (handles JSON and markdown code blocks)
function parseAIResponse(response: string): {
  summary: string;
  actionItems: string[];
  suggestions: string[];
} {
  try {
    // Try to parse as JSON directly
    const parsed = JSON.parse(response);

    return {
      summary: parsed.summary || '',
      actionItems: parsed.action_items || [],
      suggestions: parsed.suggestions || [],
    };
  } catch {
    // Try to extract JSON from markdown code block
    const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return {
          summary: parsed.summary || '',
          actionItems: parsed.action_items || [],
          suggestions: parsed.suggestions || [],
        };
      } catch {
        console.warn('[MeetAssist] Failed to parse JSON from markdown block');
      }
    }

    // Fallback: return response as summary
    return {
      summary: response,
      actionItems: [],
      suggestions: [],
    };
  }
}

