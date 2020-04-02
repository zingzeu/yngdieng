import {Explanation} from 'yngdieng/shared/zingzeudata/explanation_pb';


export function renderExplanation(e: Explanation): string {
  var output = '<ol>';
  let senses: Explanation.Sense[] = e.getSensesList();
  for (let i = 0; i < senses.length; ++i) {
    output += '<li>';
    output += renderSense(senses[i]);
    output += '</li>'
  }
  output += '</ol>';
  if (e.getNotesOriginal().length > 0) {
    output += '<p class="notes-original">' + e.getNotesOriginal() + '</p>';
  }
  if (e.getNotesOurs().length > 0) {
    output += '<p class="notes-ours">' + e.getNotesOurs() + '</p>';
  }
  return output;
}

function renderSense(s: Explanation.Sense): string {
  var output = '';
  if (s.getText().length > 0) {
    output += '<p>' + s.getText() + '</p>';
  }
  if (s.getExamplesList().length > 0) {
    output += '例句: <ul>';
    for (let e in s.getExamplesList()) {
      output += '<li>' + s.getExamplesList()[e] + '</li>';
    }
    output += '</ul>';
  }
  if (s.getChildSensesList().length > 0) {
    output += '<ol>';
    for (let i = 0; i < s.getChildSensesList().length; ++i) {
      output += '<li>' + renderSense(s.getChildSensesList()[i]) + '</li>';
    }
    output += '</ol>';
  }
  return output;
}
