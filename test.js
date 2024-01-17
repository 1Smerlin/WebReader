function markWord(wordIndex) {
  if (document.getElementById("highlight") !== null) {
    MarketElem = document.getElementById("highlight")
    MarketElem.parentElement.innerText = unmarket(MarketElem.parentElement.innerText)
  }
  let textNodes = getTextNodes(document.body);
  let wordCount = 0;
  let nodeCount = 0;
  for (let node of textNodes) {
    let wordsInNode = node.textContent.trim().split(/\s+/);
    for (let [index, word] of wordsInNode.entries()) {
      if (wordCount === wordIndex) {
        let beforeWord = wordsInNode.slice(0, index).join(" ");
        let afterWord = wordsInNode.slice(index + 1).join(" ");
        let markedWord = `<mark id="highlight">${word}</mark>`;
        let newHTML = `${beforeWord} ${markedWord} ${afterWord}`;
        let span = document.createElement('span');
        span.classList.add("mark-span")
        span.innerHTML = newHTML;
        node.parentNode.replaceChild(span, node);

        console.log(node)
        return;
      }
      wordCount++;
    }
    nodeCount++;
  }
}