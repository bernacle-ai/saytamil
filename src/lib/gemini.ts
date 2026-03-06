export interface Suggestion {
  id: string;
  type: "grammar" | "spelling" | "style" | "clarity";
  original: string;
  suggestion: string;
  reason: string;
  position?: { start: number; end: number };
}

export interface AnalysisResult {
  suggestions: Suggestion[];
  summary: string;
  score: number;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file"
    );
  }

  // Check if we should use demo mode
  if (apiKey === 'DEMO_MODE' || apiKey.startsWith('DEMO')) {
    return getDemoAnalysis(text);
  }

  const prompt = `You are an expert Tamil language assistant. Analyze the following Tamil text and provide detailed suggestions.

Text to analyze:
"${text}"

Return ONLY valid JSON in this format:

{
  "suggestions": [
    {
      "type": "grammar|spelling|style|clarity",
      "original": "original text",
      "suggestion": "corrected text",
      "reason": "explanation in English"
    }
  ],
  "summary": "Overall assessment of the text",
  "score": 85
}

Focus on:
1. Grammar errors (தமிழ் இலக்கணம்)
2. Spelling mistakes (எழுத்துப்பிழைகள்)
3. Style improvements (நடை மேம்பாடு)
4. Clarity enhancements (தெளிவு)

Provide at least 3–5 suggestions if there are issues. If the text is perfect, say so in the summary.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      
      // Fallback to demo mode if API fails
      console.warn('⚠️ Gemini API failed. Using DEMO MODE.');
      console.warn('To fix: Go to https://aistudio.google.com/app/apikey and create a NEW API key');
      return getDemoAnalysis(text);
    }

    const data = await response.json();

    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      return getDemoAnalysis(text);
    }

    // Clean markdown if Gemini returns ```json blocks
    const cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanText);

      const suggestionsWithIds =
        parsed.suggestions?.map((s: any, index: number) => ({
          ...s,
          id: `suggestion-${Date.now()}-${index}`,
        })) || [];

      return {
        suggestions: suggestionsWithIds,
        summary: parsed.summary || "Analysis complete",
        score: parsed.score || 80,
      };
    } catch {
      // fallback if JSON parsing fails
      return {
        suggestions: [],
        summary: responseText,
        score: 75,
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to demo mode on any error
    return getDemoAnalysis(text);
  }
}

// Demo mode for testing UI without working API
function getDemoAnalysis(text: string): AnalysisResult {
  const words = text.split(/\s+/).filter(w => w.trim());
  const suggestions: Suggestion[] = [];

  // Generate demo suggestions based on the text
  if (words.length > 0) {
    suggestions.push({
      id: `suggestion-${Date.now()}-1`,
      type: 'grammar',
      original: words[0] || 'text',
      suggestion: words[0] + ' (corrected)',
      reason: 'Demo: This is a sample grammar correction to show how suggestions work.',
    });
  }

  if (words.length > 1) {
    suggestions.push({
      id: `suggestion-${Date.now()}-2`,
      type: 'spelling',
      original: words[1] || 'text',
      suggestion: words[1] + ' (fixed)',
      reason: 'Demo: This is a sample spelling correction.',
    });
  }

  if (words.length > 2) {
    suggestions.push({
      id: `suggestion-${Date.now()}-3`,
      type: 'style',
      original: words.slice(0, 3).join(' '),
      suggestion: words.slice(0, 3).join(' ') + ' (improved)',
      reason: 'Demo: This is a sample style improvement suggestion.',
    });
  }

  return {
    suggestions,
    summary: '⚠️ DEMO MODE: Your API key is not working. These are sample suggestions to demonstrate the UI. To get real AI suggestions:\n\n1. Go to https://aistudio.google.com/app/apikey\n2. DELETE your old API key\n3. CREATE a new API key\n4. Update .env.local\n5. Restart dev server',
    score: 75,
  };
}