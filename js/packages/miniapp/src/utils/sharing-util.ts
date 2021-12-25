/**
 * 单个词条分享到朋友圈的标题.
 */
export function getWordShareTimelineTitle(hanzi: string) {
  if (hanzi.length >= 8) {
    return `${hanzi} | 榕典`;
  }
  return `“${hanzi}”的福州话释义 | 榕典`;
}

/**
 * 词表分享到朋友圈的标题.
 */
export function getWordListShareTimelineTitle(wordListTitle: string) {
  return `${wordListTitle} | 榕典`;
}
