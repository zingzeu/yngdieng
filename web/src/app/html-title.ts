

export const APP_NAME = '榕典'

export function getSearchResultPageTitle(query: string):
    string {
      let trimmed = query.trim();
      return (trimmed == '' ? '搜索' : trimmed) + ' | ' + APP_NAME;
    }

export function getDetailsPageTitle(word: string): string {
  let trimmed = word.trim();
  return trimmed == '' ? APP_NAME : (trimmed + ' | ' + APP_NAME);
}
