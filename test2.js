function getWordAtIndex(index) {
  let textNodes = getTextNodes(document.body);
  let wordCount = 0;
  for (let node of textNodes) {
    let wordsInNode = node.textContent.trim().split(/\s+/);
    if (wordCount + wordsInNode.length > index) {
      return wordsInNode[index - wordCount];
    }
    wordCount += wordsInNode.length;
  }
  return null;
}