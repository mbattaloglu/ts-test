export type HighlightPart = {
  text: string;
  isHighlighted: boolean;
};

const highlightTextSearch = (text: string, highlightedText: string): Array<number> => {
  let results: Array<number> = [];
  let startIndex = 0;
  let index;

  let smallText: string = text.toLowerCase(); //case insensitive search
  let highlightedSmallText = highlightedText.toLowerCase(); //case insensitive search

  while ((index = smallText.indexOf(highlightedSmallText, startIndex)) > -1) { //indexOf returns -1 if not found
    results.push(index);
    startIndex = index + highlightedSmallText.length;
  }
  return results;
};

const patternSearch = (text: string, patternText: string): Map<number, number> => {
  let results: Map<number, number> = new Map;

  let patterning: boolean = false;
  let startingIndex: number = -1
  let patternLength: number = 0;

  for (let i: number = 0; i < text.length; i++) {
    let substring = text.slice(i, i + patternText.length).toLowerCase();
    if (substring === patternText) {
      if (!patterning) { startingIndex = i };
      patterning = true;
      patternLength += substring.length;
      i += substring.length - 1
    }
    else {
      if (startingIndex !== -1 && patternLength !== substring.length) {
        results.set(startingIndex, patternLength)
      }
      startingIndex = -1;
      patterning = false;
      patternLength = 0;
    }
  }
  return results;
}

const createHighlightPart = (text: string, isHighlighted: boolean): HighlightPart => {
  return {
    text: text,
    isHighlighted: isHighlighted
  };
};

export const extractHighlight = (text: string, substring?: string): Array<HighlightPart> => {
  if (!text) return [];
  if (!substring) {
    return [createHighlightPart(text, false)];
  }

  const substringIndexes: Array<number> = highlightTextSearch(text, substring); //Substrings
  if (substringIndexes.length === 0) {
    return [createHighlightPart(text, false)];
  }

  let result: Array<HighlightPart> = []

  let patterns: Map<number, number> = patternSearch(text, substring); //Patterns in the text

  let traversedLetters: string = ""; //Letters traversed

  //Traverse all letters in the text
  for (let index: number = 0; index < text.length; index++) {
    //Check if we are in the substring found indexes
    if (substringIndexes.includes(index)) {
      if (traversedLetters !== "") { //push the part before substring, if not empty
        result.push(createHighlightPart(traversedLetters, false))
      }

      //If we have pattern
      if (patterns.size > 0) {
        let patternLength: number | undefined = patterns.get(index);
        if (patternLength) {
          let patternText = text.slice(index, index + patternLength); //Get the pattern substring from text
          result.push(createHighlightPart(patternText, true));
          index += patternLength //Increment the index we already passed patterns lettersby pushing
          continue;
        }
      } else { //If we dont have pattern we have substring itself
        let highlightedText = text.slice(index, index + substring.length); // Get it from the text because case might be different.
        result.push(createHighlightPart(highlightedText, true));
        index += substring.length - 1; //Increment the i because we already skipped the substring letters.
        traversedLetters = ""; //We pushed the letters so reset.
        continue;
      }
    } else {
      //If nothing matches just concat the letter with the traversedLetters
      traversedLetters = traversedLetters.concat("", text[index]);

      //At the end just push traversed letters
      if (index === text.length - 1) {
        result.push(createHighlightPart(traversedLetters, false));
      }
    }
  }
  return result;
}