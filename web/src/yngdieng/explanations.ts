import {Explanation} from 'yngdieng/shared/zingzeudata/explanation_pb';


export function renderExplanation(e: Explanation, currentWord: string = '～'): string {
  var output = '<ol>';
  let senses: Explanation.Sense[] = e.getSensesList();
  for (let i = 0; i < senses.length; ++i) {
    output += '<li class="sense">';
    output += renderSense(senses[i], currentWord);
    output += '</li>'
  }
  output += '</ol>';
  if (e.getNotesOriginal().length > 0) {
    output += '<p class="notes-original">' + maybeAddPeriod(e.getNotesOriginal()) + '</p>';
  }
  if (e.getNotesOurs().length > 0) {
    output += '<p class="notes-ours">' + maybeAddPeriod(e.getNotesOurs()) + '</p>';
  }
  return output;
}

function renderSense(s: Explanation.Sense, currentWord: string): string {
  var output = '';
  if (s.getText().length > 0) {
    output += maybeAddPeriod(s.getText());
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
  return maybeAddPeriod(e).replace(/～/g, '<span class="current-word">' + currentWord + '</span>');
}

function maybeAddPeriod(text: string): string {
  if (text.length == 0) {
    return text;
  }
  const lastChar = text[text.length - 1];
  if (lastChar === '。' || lastChar === '，' || lastChar === '！' || lastChar === '？') {
    return text;
  }
  return text + '。';
}