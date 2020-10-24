interface RichTextNode {
  vertical_container?: {
    children: RichTextNode[];
  };
  inline_container?: {
    children: InlineNode[];
  };
  list?: {
    ordered?: boolean;
    children?: RichTextNode[];
  };
}

interface InlineNode {
  text?: {
    text?: string;
    styles?: [];
  };
}

export function renderRichTextNode(r: RichTextNode, outermost = true): string {
  if (outermost) {
    let output =
      '<div class="rich-text">' + renderRichTextNode(r, false) + '</div>';
    console.debug(output);
    return output;
  }
  if (r.vertical_container) {
    return (
      r.vertical_container.children
        ?.map(c => '<div>' + renderRichTextNode(c, false) + '</div>')
        .join('') || ''
    );
  }
  if (r.inline_container) {
    return (
      r.inline_container.children?.map(c => renderInlineNode(c)).join('') || ''
    );
  }
  if (r.list) {
    let tag = r.list.ordered ? 'ol' : 'ul';
    return (
      `<${tag} class="${tag}">` +
      r.list.children
        ?.map(c => '<li>' + renderRichTextNode(c, false) + '</li>')
        .join('') +
      `</${tag}>`
    );
  }
  return '';
}

export function renderInlineNode(i: InlineNode): string {
  if (i.text) {
    if (i.text?.styles) {
      return `<span class="${i.text!.styles!.join(' ')}">${
        i.text.text || ''
      }</span>`;
    }
    return i.text.text || '';
  }
  return '';
}
