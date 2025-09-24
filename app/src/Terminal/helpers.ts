const randomBucket = [
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '/',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  '{',
  '|',
  '}',
  '~',
];

const findWordSlots = (data: string, size: number, padding = 2): number[] => {
  const slots: number[] = [];

  // Sliding window approach to find all possible indices in which a word can be inserted into the data stream
  // Build initial window
  for (let start = 0, end = 0; end < data.length; ) {
    // Check if character is part of a word - move window beyond word if found
    if ((data[end].match(/[A-Za-z]/) || []).length !== 0) {
      start = end + size;
      end = start;
      continue;
    }

    // Buffer window by padding x2 (both sides of the word, effectively)
    // TODO: Padding should not be applied to edges of the data stream, only between words

    // Window is size of a word (+padding) and we have not encountered a word character
    if (end + 1 - start === size + padding * 2) {
      slots.push(start + padding);
      start++;
    }

    // Move the window along...
    end++;
  }

  return slots;
};

export const getWords = async (
  length: number,
  count: number,
): Promise<string[]> => {
  if (count < 0) {
    console.error('word count cannot be less than 0');
  }

  const wordbank = await import('./dictionary.json');
  const matchedWords = (wordbank.default as { [key: number]: string[] })[
    length
  ];
  if (matchedWords === undefined) {
    console.error('Failed to fetch any words of length: ', length);
    return [];
  }

  const trueCount = count > matchedWords.length ? matchedWords.length : count;

  const selections = new Set<string>();
  while (selections.size !== trueCount) {
    // Get random selection until num selections equals count
    const randomSelection: number = Math.floor(
      Math.random() * matchedWords.length,
    );
    selections.add(matchedWords[randomSelection].toUpperCase());
  }

  return Array.from(selections);
};

export const generateDataStream = (words: string[]): string => {
  // 17 Rows and 12 char per column per row for a total of 17*2*12= 408 characters needed
  let data = '';
  for (let i = 0; i < 408; i++) {
    data += randomBucket[Math.floor(Math.random() * (randomBucket.length - 1))];
  }

  const size = words[0].length;

  for (let i = 0; i < words.length; i++) {
    const slots = findWordSlots(data, size);
    // No more word slots available
    if (slots.length === 0) {
      return data;
    }

    const slot = slots[Math.floor(Math.random() * (slots.length - 1))];

    const front = data.slice(0, slot);
    const back = data.slice(slot + size);

    data = front + words[i] + back;
  }

  return data;
};

// Returns dictionary of matched bracket start indices mapped to their respective string representation
// Each character index is allowed only ONE matched bracket sequence, ex: ("{...}.}" will yield only "{...}")
export const findBrackets = (data: string): Map<number, string> => {
  const pairs = {
    '}': '{',
    ']': '[',
    ')': '(',
    '>': '<',
  };

  const brackets = new Map<number, string>();

  // Usable bracket pairs may only exist within a single row
  for (let row = 0; row < 34; row++) {
    const start = row * 12;
    const segment = data.slice(start, start + 12);

    // { 'open-bracket': index[] }
    // Candidate list for an open-bracket is CLEARED and parsed whenever a closing tag is found
    const candidates = new Map<string, number[]>();
    for (let i = 0; i < 12; i++) {
      const char = segment[i];
      switch (char) {
        case '{':
        case '(':
        case '[':
        case '<': {
          const found = candidates.get(char) ?? [];
          candidates.set(char, [...found, i]);
          break;
        }
        case '}':
        case ')':
        case ']':
        case '>': {
          const openers = candidates.get(pairs[char]) ?? [];
          openers.forEach((open) =>
            brackets.set(open + start, segment.slice(open, i + 1)),
          );
          // All matched previous opening brackets have been closed, remove their positions from candidates
          candidates.set(pairs[char], []);
          break;
        }
        default:
          // If a letter is encountered, all previous candidates become invalid for matching
          // Brackets are not allowed to match if there is a word in between them
          if (/[A-Za-z]/.test(char)) {
            candidates.clear();
          }
      }
    }
  }

  return brackets;
};
