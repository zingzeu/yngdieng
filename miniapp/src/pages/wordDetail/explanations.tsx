interface Sense {
  text?: string;
  examples: string[];
  child_senses: Sense[];
}
interface Explanation {
  senses: Sense[];
  notes_original?: any;
  notes_ours?: any;
}

export function renderExplanation(
  e: Explanation,
  currentWord: string = '～'
): string {
  var output = '';
  output += '<span class="label">释义</span>';
  output += '<ol>';
  let senses: Sense[] = e.senses;
  for (let i = 0; i < senses.length; ++i) {
    output += '<li class="sense">';
    output += renderSense(senses[i], currentWord);
    output += '</li>';
  }
  output += '</ol>';
  if (e.notes_original?.length > 0) {
    output += '<span class="label">注</span>';
    output += '<p class="notes">' + maybeAddPeriod(e.notes_original) + '</p>';
  }
  if (e.notes_ours?.length > 0) {
    output += '<span class="label">榕典注</span>';
    output += '<p class="notes">' + maybeAddPeriod(e.notes_ours) + '</p>';
  }
  return output;
}

function renderSense(s: Sense, currentWord: string): string {
  var output = '';
  if (s.text !== undefined && s.text.length > 0) {
    output += maybeAddPeriod(s.text);
  }
  if (s.examples?.length > 0) {
    output += '<ul class="examples-list">';
    for (let e in s.examples) {
      output +=
        '<li class="example">' +
        renderExample(s.examples[e], currentWord) +
        '</li>';
    }
    output += '</ul>';
  }
  if (s.child_senses?.length > 0) {
    output += '<ol>';
    for (let i = 0; i < s.child_senses.length; ++i) {
      output +=
        '<li class="sense">' +
        renderSense(s.child_senses[i], currentWord) +
        '</li>';
    }
    output += '</ol>';
  }
  return output;
}

function renderExample(e: string, currentWord: string): string {
  let x = maybeAddPeriod(e).replace(
    /～/g,
    '<span class="current-word">' + currentWord + '</span>'
  );
  console.log(x);
  return x;
}

function maybeAddPeriod(text: string): string {
  if (text.trim().length == 0) {
    return text;
  }
  const trimmed = text.trim();
  const lastChar = trimmed[trimmed.length - 1];
  if (
    lastChar === '。' ||
    lastChar === '，' ||
    lastChar === '！' ||
    lastChar === '？'
  ) {
    return trimmed;
  }
  return trimmed + '。';
}
