console.log("Hallo Bambi");

// Stimmen laden und im Dropdown anzeigen
let voices = window.speechSynthesis.getVoices();

function loadVoices() {
  let voices = window.speechSynthesis.getVoices();
  console.log("voices2");
  console.log(voices);
  voices.forEach(function (voice, i) {
    var option = document.createElement("option");
    option.value = voice.name;
    option.innerHTML = voice.name;
    document.getElementById("voiceSelect").appendChild(option);
  });
}

function getBrowser() {
  const userAgent = navigator.userAgent;

  if (userAgent.match(/firefox|fxios/i)) {
    return "Firefox";
  } else if (userAgent.match(/opr\//i)) {
    return "Opera";
  } else if (userAgent.match(/edg/i)) {
    return "Edge";
  } else if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Chrome";
  } else if (userAgent.match(/safari/i)) {
    return "Safari";
  } else {
    return "Unknown";
  }
}
let browserName = getBrowser();
console.log(browserName);

switch (browserName) {
  case "Firefox":
    loadVoices();
    break;
  case "Chrome":
    window.speechSynthesis.onvoiceschanged = loadVoices;
    break;
  case "Edge":
    break;
  default:
    break;
}
// Ausgewählte Stimme speichern

document.getElementById("voiceSelect").addEventListener("change", async function () {
  var selectedVoice = this.value;
  try {
    switch (browserName) {
      case "Firefox":
        await browser.storage.sync.set({ selectedVoice: selectedVoice });
        console.log("Die Stimme wurde gespeichert.");
        break;
      case "Chrome":
        await chrome.storage.sync.set({ selectedVoice: selectedVoice });
        console.log("Die Stimme wurde gespeichert.");
        break;
      // Füge Fallunterscheidungen für andere Browser hinzu, falls nötig
    }
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten beim Speichern der Stimme: ", error);
  }
});

function getStorage() {
  switch (browserName) {
    case "Firefox":
      console.log(browser);
      console.log(browser.storage);
      return browser.storage;
    case "Chrome":
      console.log(chrome);
      console.log(chrome.storage);
      return chrome.storage;
    case "Edge":
      break;
    default:
      break;
  }
  // if (typeof browser !== "undefined" && browser.storage) {
  // } else if (typeof chrome !== "undefined" && chrome.storage) {
  // } else {
  //   throw new Error("Storage API not found.");
  // }
}

document.addEventListener("DOMContentLoaded", function () {
  const storage = getStorage();
  console.log(storage.sync.hasOwnProperty("selectedVoice"));
  storage.sync.get("selectedVoice", function (data) {
    if (data) {
      console.log("data.selectedVoice");
      console.log(data.selectedVoice);
      document.getElementById("voiceSelect").value = data.selectedVoice;
      // if (data.selectedVoice) {
      // } else {
      // }
    } else {
      // var option = document.createElement("option");
      // option.value = "undefined";
      // option.innerHTML = "undefined";
      // document.getElementById("voiceSelect").appendChild(option);
      document.getElementById("voiceSelect").value = "defaultVoiceValue";
    }
  });
});
