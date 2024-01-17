const synth = window.speechSynthesis;
let wordIndex = 0;
let words = [];
let utterance
let readRate = 1.4

/*
getTotalWordCount()
getWordAtIndex(191)
markWord(191)
MouseClick = 189
word = 'Baukosten'
*/
// Test Code
// document.addEventListener('click', function (event) {
//   let range, textNode, offset;

//   // Moderner Browser - einschließlich IE 9+
//   if (document.caretRangeFromPoint) {
//     range = document.caretRangeFromPoint(event.clientX, event.clientY);
//     textNode = range.startContainer;
//     offset = range.startOffset;
//   }
//   // IE 8 und darunter
//   else if (document.caretPositionFromPoint) {
//     range = document.caretPositionFromPoint(event.clientX, event.clientY);
//     textNode = range.offsetNode;
//     offset = range.offset;
//   }

//   // Nicht auf einen Textknoten geklickt
//   if (textNode.nodeType !== 3) {
//     return;
//   }

//   // Finden Sie das angeklickte Wort
//   let data = textNode.data;
//   let start = offset;
//   let end = offset;
//   while (start > 0 && /\s/.test(data[start - 1]) === false) {
//     start--;
//   }
//   while (end < data.length && /\s/.test(data[end]) === false) {
//     end++;
//   }

//   let clickedWord = data.substring(start, end).trim();
//   console.log('Clicked word:', clickedWord);

//   // Holen Sie alle Textknoten und finden Sie den Index des angeklickten Worts
//   let textNodes = getTextNodes(document.body);
//   let wordIndex = 0;
//   let found = false;
//   for (let node of textNodes) {
//     let wordsInNode = node.textContent.trim().split(/\s+/);
//     for (let word of wordsInNode) {
//       if (node === textNode && word === clickedWord) {
//         console.log('Word index:', wordIndex);
//         found = true;
//         break;
//       }
//       wordIndex++;
//     }
//     if (found) {
//       break;
//     }
//   }
// });


function getTextFromWordIndex(index) {
  let textNodes = getTextNodes(document.body);
  let wordCount = 0;
  let textFromIndex = '';
  let indexReached = false; // Boolean, um zu überprüfen, ob der gewünschte Index erreicht ist

  for (let node of textNodes) {
    let wordsInNode = node.textContent.trim().split(/\s+/);
    if (wordCount + wordsInNode.length > index && !indexReached) {
      // Fügen Sie die Wörter ab dem gegebenen Index zum Text hinzu
      textFromIndex += wordsInNode.slice(index - wordCount).join(' ');
      indexReached = true; // Setzen Sie indexReached auf true, da der Index erreicht wurde
    } else if (indexReached) {
      // Fügen Sie alle Wörter des aktuellen Knotens zum Text hinzu, wenn der Wortindex bereits erreicht wurde
      textFromIndex += ' ' + wordsInNode.join(' ');
    }
    wordCount += wordsInNode.length;
  }
  return textFromIndex;
}
function getTotalWordCount() {
  let textNodes = getTextNodes(document.body);
  let totalWords = 0;
  for (let node of textNodes) {
    let wordsInNode = node.textContent.trim().split(/\s+/);
    totalWords += wordsInNode.length;
  }
  return totalWords;
}
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
// Market
// document.getElementsByClassName("mark-span")
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
function unmarket() {
  // Suchen Sie das Element mit der Klasse "mark-span"
  let spanElem = document.querySelector(".mark-span");

  // Überprüfen Sie, ob das Element existiert
  if (spanElem) {
    // Ersetzen Sie die mark-Tags durch einen leeren String
    let textWithoutMark = spanElem.innerHTML
      .replace('<mark id="highlight">', "")
      .replace("</mark>", "");

    // Erstellen Sie einen neuen Textknoten mit dem bereinigten Text
    let textNode = document.createTextNode(textWithoutMark);

    // Ersetzen Sie das span-Element durch den neuen Textknoten
    spanElem.parentNode.replaceChild(textNode, spanElem);
  } else {
    console.log("Es gibt kein Element mit der Klasse 'mark-span'.");
  }
}


// Read aloud
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
async function readAloud(text = "", wordstart = 0) {
  if (!text) {
    text = getSkippedContent(0);
  }
  wordIndex = wordstart
  utterance = new SpeechSynthesisUtterance(text);
  // Voices
  let voices = await getVoices()
  const specificVoice = voices.find(voice => voice.name === 'Microsoft Amala Online (Natural) - German (Germany)');
  if (specificVoice) {
    utterance.voice = specificVoice;
  } else {
    console.log("Die gesuchte Stimme konnte nicht gefunden werden.");
    return;
  }
  utterance.rate = readRate;
  utterance.lang = "de-DE";
  utterance.onboundary = (event) => {
    if (event.name === "word") {
      console.log(wordIndex)
      markWord(wordIndex);
      wordIndex++;
    }
  }

  synth.speak(utterance); // Startet die Sprachausgabe
  window.addEventListener('beforeunload', function () {
    if (synth && synth.speaking) {
      synth.cancel();
    }
  });
}
function getVoices() {
  return new Promise((resolve) => {
    let voices = synth.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      resolve(voices);
    };
  });
}


function getWordIndexFromElement(element) {
  const allTextNodes = getTextNodes(document.body);
  const clickedTextNodes = getTextNodes(element);

  const allWords = allTextNodes.map(node => node.textContent.trim()).join(' ').split(/\s+/);
  const clickedWords = clickedTextNodes.map(node => node.textContent.trim()).join(' ').split(/\s+/);

  let wordCount = 0;

  for (const word of allWords) {
    if (word === clickedWords[0]) {
      break;
    }
    wordCount++;
  }

  return wordCount;
}

async function startReadingFromElement(element) {
  const allTextNodes = getTextNodes(document.body);
  const clickedTextNodes = getTextNodes(element);

  const allWords = allTextNodes.map(node => node.textContent.trim()).join(' ').split(/\s+/);
  const clickedWords = clickedTextNodes.map(node => node.textContent.trim()).join(' ').split(/\s+/);

  let wordCount = 0;

  for (const word of allWords) {
    if (word === clickedWords[0]) {
      break;
    }
    wordCount++;
  }

  wordIndex = wordCount;
  const textToRead = allWords.slice(wordIndex).join(' ');

  if (synth.speaking) {
    synth.cancel();
  }
  await readAloud(textToRead);
}

// controlle audio output
function pauseOrResumeSpeech() {
  if (synth.speaking) {
    if (synth.paused) {
      synth.resume();
    } else {
      synth.pause();
    }
  }
}
function getSkippedContent(skipCount) {
  const textNodes = getTextNodes(document.body);
  const pageContent = textNodes.map(node => node.textContent.trim()).join(" ");
  words = pageContent.split(/\s+/);
  if (wordIndex + skipCount >= 0 && wordIndex + skipCount < words.length) {
    wordIndex += skipCount;
  } else if (wordIndex + skipCount >= words.length) {
    wordIndex = words.length - 1;
  } else {
    wordIndex = 0;
  }
  return words.slice(wordIndex).join(" ");
}

function skipWords(skipCount) {
  if (synth.speaking) {
    synth.cancel();
    const skippedContent = getSkippedContent(skipCount);
    readAloud(skippedContent);
  }
}




// Keyboard
let altLeftPressed = false;
let intlBackslashPressed = false;
document.addEventListener('keydown', (event) => {
  if (synth.speaking) {
    if (event.code === "Space") {
      event.preventDefault();
      pauseOrResumeSpeech();
    }
    if (event.code === "Escape") {
      if (document.getElementById("highlight") !== null) {
        MarketElem = document.getElementById("highlight")
        MarketElem.parentElement.innerText = unmarket(MarketElem.parentElement.innerText)
      }
      event.preventDefault();
      synth.cancel();
    }
    if (!altLeftPressed && event.code === "ArrowRight") {
      console.log("ArrowRight")
      event.preventDefault();
      wordIndex = wordIndex + 5
      synth.cancel()
      readAloud(getTextFromWordIndex(wordIndex), wordIndex)
    }
    if (!altLeftPressed && event.code === "ArrowLeft") {
      console.log("ArrowLeft")
      event.preventDefault();
      wordIndex = wordIndex - 5
      synth.cancel()
      readAloud(getTextFromWordIndex(wordIndex), wordIndex)
    }
    if (altLeftPressed && event.code === "ArrowRight") {
      event.preventDefault();
      readRate = readRate + 0.1;
      synth.cancel()
      readAloud(getTextFromWordIndex(wordIndex), wordIndex)
    }
    if (altLeftPressed && event.code === "ArrowLeft") {
      event.preventDefault();
      readRate = readRate - 0.1;
      synth.cancel()
      readAloud(getTextFromWordIndex(wordIndex), wordIndex)
    }
  }
  // Start
  if (event.code === 'AltLeft') {
    altLeftPressed = true;
  }
  if (event.code === 'IntlBackslash') {
    intlBackslashPressed = true;
  }
  if (altLeftPressed && intlBackslashPressed) {
    if (synth.speaking) {
      if (document.getElementById("highlight") !== null) {
        MarketElem = document.getElementById("highlight")
        MarketElem.parentElement.innerText = unmarket(MarketElem.parentElement.innerText)
      }
      synth.cancel();
    }
    wordIndex = 0;
    let skippedContent = getSkippedContent(0);
    readAloud(skippedContent);
  }
});
document.addEventListener('keyup', (event) => {
  if (event.code === 'AltLeft') {
    altLeftPressed = false;
  }
  if (event.code === 'IntlBackslash') {
    intlBackslashPressed = false;
  }
});
document.addEventListener('mousedown', handleMouseDown);

// Funktion, um den Mausklick zu behandeln
async function handleMouseDown(event) {
  if (altLeftPressed && event.button === 0) {
    if (document.getElementById("highlight") !== null) {
      MarketElem = document.getElementById("highlight")
      MarketElem.parentElement.innerText = unmarket(MarketElem.parentElement.innerText)
    }
    event.preventDefault();
    synth.cancel();
    const clickedElement = event.target;
    if (clickedElement.nodeType === Node.TEXT_NODE || clickedElement.nodeType === Node.ELEMENT_NODE) {
      let range, textNode, offset;

      // Moderner Browser - einschließlich IE 9+
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(event.clientX, event.clientY);
        textNode = range.startContainer;
        offset = range.startOffset;
      }
      // IE 8 und darunter
      else if (document.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(event.clientX, event.clientY);
        textNode = range.offsetNode;
        offset = range.offset;
      }

      // Nicht auf einen Textknoten geklickt
      if (textNode.nodeType !== 3) {
        return;
      }

      // Finden Sie das angeklickte Wort
      let data = textNode.data;
      let start = offset;
      let end = offset;
      while (start > 0 && /\s/.test(data[start - 1]) === false) {
        start--;
      }
      while (end < data.length && /\s/.test(data[end]) === false) {
        end++;
      }

      let clickedWord = data.substring(start, end).trim();
      console.log('Clicked word:', clickedWord);

      // Holen Sie alle Textknoten und finden Sie den Index des angeklickten Worts
      let textNodes = getTextNodes(document.body);
      let wordIndex = 0;
      let found = false;
      for (let node of textNodes) {
        let wordsInNode = node.textContent.trim().split(/\s+/);
        for (let word of wordsInNode) {
          if (node === textNode && word === clickedWord) {
            if (synth.speaking) {
              synth.cancel();
            }
            readAloud(getTextFromWordIndex(wordIndex), wordIndex)
            console.log('Word index:', wordIndex);
            found = true;
            break;
          }
          wordIndex++;
        }
        if (found) {
          break;
        }
      }
    }
  }
}


