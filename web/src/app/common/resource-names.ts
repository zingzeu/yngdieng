const WORD_NAME_PREFIX = 'words/';

export function wordNameToDocId(wordName: string): string {
  if (!wordName.startsWith(WORD_NAME_PREFIX)) {
    throw new Error(`${wordName} is not a valid Word resource name`);
  }
  return wordName.substr(WORD_NAME_PREFIX.length);
}
