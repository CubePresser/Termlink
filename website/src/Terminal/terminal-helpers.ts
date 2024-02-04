import wordbank from './dictionary.json';

const randomBucket = ['!','"','#','$','%','&','\'','(',')','*','+',',','-','/',':',';','<','=','>','?','@','[','\\',']','^','_','`','{','|','}','~',];

// TODO: Implement padding
const findWordSlots = (data: string, size: number, padding = 2): number[] => {
  const slots: number[] = [];

  // Sliding window approach to find all possible indices in which a word can be inserted into the data stream
  // Build initial window
  for (let start = 0, end = 0; end < data.length;) {
    // Check if character is part of a word - move window beyond word if found
    if ((data[end].match(/[A-Za-z]/) || []).length !== 0) {
      start = end + size;
      end = start;
      continue;
    }

    // Window is size of a word and we have not encountered a word character
    if (end - start == size) { 
      slots.push(start);
      start++;
    }

    end++;
  }

  return slots;
}

export const getWords = (length: number, count: number): string[] => {
  const matchedWords = (wordbank as { [key: string]: string[] })[String(length)];
  if (matchedWords === undefined) {
    console.error('Failed to fetch any words of length: ', length);
    return [];
  }

  const trueCount = (count > matchedWords.length) ? matchedWords.length : count;

  const selections = new Set<string>();
  while (selections.size !== trueCount) {
    // Get random selection until num selections equals count
    const randomSelection: number = Math.floor(Math.random() * matchedWords.length);
    selections.add(matchedWords[randomSelection].toUpperCase());
  }

  return Array.from(selections);
}

export const generateDataStream = (words: string[]): string => {
  // 17 Rows and 12 char per column per row for a total of 17*2*12= 408 characters needed
  let data = "";
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
}
