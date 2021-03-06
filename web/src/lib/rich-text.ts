import {RichTextNode} from 'yngdieng/yngdieng/frontend/v3/service_pb';

export function renderRichTextNode(r: RichTextNode, outermost = true): string {
  if (outermost) {
    let output =
      '<div class="rich-text">' + renderRichTextNode(r, false) + '</div>';
    console.debug(output);
    return output;
  }
  if (r.hasVerticalContainer()) {
    return (
      r
        .getVerticalContainer()
        .getChildrenList()
        .map(c => '<div>' + renderRichTextNode(c, false) + '</div>')
        .join('') || ''
    );
  }
  if (r.hasInlineContainer()) {
    return (
      r
        .getInlineContainer()
        .getChildrenList()
        .map(c => renderInlineNode(c))
        .join('') || ''
    );
  }
  if (r.hasList()) {
    let tag = r.getList().getOrdered() ? 'ol' : 'ul';
    return (
      `<${tag} class="${tag}">` +
      r
        .getList()
        .getChildrenList()
        .map(c => '<li>' + renderRichTextNode(c, false) + '</li>')
        .join('') +
      `</${tag}>`
    );
  }
  return '';
}

export function renderInlineNode(i: RichTextNode.InlineNode): string {
  if (i.hasText()) {
    if (i.getText().getStylesList().length > 0) {
      return `<span class="${i.getText().getStylesList().join(' ')}">${
        i.getText().getText() || ''
      }</span>`;
    }
    return i.getText().getText() || '';
  }
  return '';
}
