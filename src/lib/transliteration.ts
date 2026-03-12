// Google Input Tools API for Tamil transliteration
export interface TransliterationOption {
  text: string;
  score?: number;
}

// Simple cache to avoid duplicate API calls
const transliterationCache = new Map<string, TransliterationOption[]>();

export async function transliterateToTamil(
  englishText: string
): Promise<TransliterationOption[]> {
  if (!englishText.trim()) {
    return [];
  }

  // Check cache first
  const cacheKey = englishText.toLowerCase();
  if (transliterationCache.has(cacheKey)) {
    return transliterationCache.get(cacheKey)!;
  }

  try {
    // Google Input Tools API endpoint
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
      englishText
    )}&itc=ta-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Transliteration API error:', response.status);
      return [];
    }

    const data = await response.json();

    // Parse Google Input Tools response format
    // Response format: [status, [["SUCCESS", [input, suggestions, metadata]]]]
    if (
      data &&
      data[0] === 'SUCCESS' &&
      data[1] &&
      data[1][0] &&
      data[1][0][1]
    ) {
      const suggestions = data[1][0][1] as string[];
      const result = suggestions.map((text, index) => ({
        text,
        score: 1 - index * 0.1, // Higher score for earlier suggestions
      }));
      
      // Cache the result
      transliterationCache.set(cacheKey, result);
      
      return result;
    }

    return [];
  } catch (error) {
    console.error('Transliteration error:', error);
    return [];
  }
}

// Split text into words and transliterate the last word
export async function transliterateLastWord(
  text: string
): Promise<{ prefix: string; word: string; suggestions: TransliterationOption[] }> {
  const words = text.split(/\s+/);
  
  if (words.length === 0) {
    return { prefix: '', word: '', suggestions: [] };
  }

  const lastWord = words[words.length - 1];
  const prefix = words.slice(0, -1).join(' ');

  // Only transliterate if the last word contains English characters
  if (!/[a-zA-Z]/.test(lastWord)) {
    return { prefix, word: lastWord, suggestions: [] };
  }

  const suggestions = await transliterateToTamil(lastWord);

  return {
    prefix: prefix ? prefix + ' ' : '',
    word: lastWord,
    suggestions,
  };
}

// Check if we should show suggestions (always show for English text)
export function shouldShowSuggestions(text: string): boolean {
  if (!text.trim()) return false;
  
  const words = text.trim().split(/\s+/);
  const lastWord = words[words.length - 1];
  
  // Show if last word has English characters and is at least 1 character
  return /[a-zA-Z]/.test(lastWord) && lastWord.length > 0;
}
