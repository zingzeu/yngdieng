import {Explanation} from 'yngdieng/shared/zingzeudata/explanation_pb';


export function renderExplanation(e: Explanation, currentWord: string = '～'): string {
  var output = '';
  output += '<span class="label">释义</span>';
  output += '<ol>';
  let senses: Explanation.Sense[] = e.getSensesList();
  for (let i = 0; i < senses.length; ++i) {
    output += '<li class="sense">';
    output += renderSense(senses[i], currentWord);
    output += '</li>'
  }
  output += '</ol>';
  if (e.getNotesOriginal().length > 0) {
    output += '<span class="label">注</span>';
    output += '<p class="notes">' + e.getNotesOriginal() + '</p>';
  }
  if (e.getNotesOurs().length > 0) {
    output += '<span class="label">榕典注</span>';
    output += '<p class="notes">' + e.getNotesOurs() + '</p>';
  }
  return output;
}

function renderSense(s: Explanation.Sense, currentWord: string): string {
  var output = '';
  if (s.getText().length > 0) {
    output += s.getText();
  }
  if (s.getExamplesList().length > 0) {
    output += '<ul class="examples-list">';
    for (let e in s.getExamplesList()) {
      output +=
          '<li class="example">' + renderExample(s.getExamplesList()[e], currentWord) + '</li>';
    }
    output += '</ul>';
  }
  if (s.getChildSensesList().length > 0) {
    output += '<ol>';
    for (let i = 0; i < s.getChildSensesList().length; ++i) {
      output +=
          '<li class="sense">' + renderSense(s.getChildSensesList()[i], currentWord) + '</li>';
    }
    output += '</ol>';
  }
  return output;
}

function renderExample(e: string, currentWord: string): string {
  return e.replace(/～/g, '<span class="current-word">' + currentWord + '</span>');
}