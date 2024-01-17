function getTextFromWordIndex(index) {
  let textNodes = getTextNodes(document.body);
  let wordCount = 0;
  let textFromIndex = '';
  for (let node of textNodes) {
    let wordsInNode = node.textContent.trim().split(/\s+/);
    if (wordCount + wordsInNode.length > index) {
      // Fügen Sie die Wörter ab dem gegebenen Index zum Text hinzu
      textFromIndex += wordsInNode.slice(index - wordCount).join(' ');
    } else if (wordCount > index) {
      // Fügen Sie alle Wörter des aktuellen Knotens zum Text hinzu, wenn der Wortindex bereits erreicht wurde
      textFromIndex += ' ' + wordsInNode.join(' ');
    }
    wordCount += wordsInNode.length;
  }
  return textFromIndex;
}
function getTextNodes(element) {
  let textNodes = [];
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      textNodes.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE && window.getComputedStyle(node).display !== "none") {
      textNodes.push(...getTextNodes(node));
    }
  }
  return textNodes;
}
