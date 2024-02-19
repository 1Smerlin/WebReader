console.log("Hallo Bambi");

// Stimmen laden und im Dropdown anzeigen
let voices = window.speechSynthesis.getVoices();
let voiceSelect = document.getElementById("voiceSelect");
let DeleteVoice = document.getElementById("DeleteVoice");

function loadVoices() {
  let voices = window.speechSynthesis.getVoices();
  console.log("voices2");
  console.log(voices);
  voices.forEach(function (voice, i) {
    var option = document.createElement("option");
    option.value = voice.name;
    option.innerHTML = voice.name;
    voiceSelect.appendChild(option);
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
    window.speechSynthesis.onvoiceschanged = loadVoices;
    break;
  default:
    break;
}
// Ausgewählte Stimme speichern

voiceSelect.addEventListener("change", async function () {
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
      case "Edge":
        await chrome.storage.sync.set({ selectedVoice: selectedVoice });
        console.log("Die Stimme wurde gespeichert.");
        break;
      // Füge Fallunterscheidungen für andere Browser hinzu, falls nötig
    }
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten beim Speichern der Stimme: ", error);
  }
});

async function getStorage() {
  let result;
  switch (browserName) {
    case "Firefox":
      console.log(browserName);
      console.log(browser);
      result = await browser.storage.sync.get("selectedVoice");
      console.log("Wert von selectedVoice:", result.selectedVoice);
      return result;
    case "Chrome":
      console.log(browserName);
      console.log(chrome);
      result = await chrome.storage.sync.get("selectedVoice");
      console.log("Wert von selectedVoice:", result.selectedVoice);
      return result;
    case "Edge":
      console.log(browserName);
      console.log(chrome);
      result = await chrome.storage.sync.get("selectedVoice");
      console.log("Wert von selectedVoice:", result.selectedVoice);
      return result;
    default:
      console.log(browserName);
      console.log("Fehler beim Brovsernamen");
      break;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Verwende direkt chrome.storage.sync.get, um den Wert von selectedVoice zu erhalten
    const result = await getStorage();
    const selectedVoice = result.selectedVoice || "defaultVoiceValue"; // Verwende den gespeicherten Wert oder einen Standardwert
    console.log("Wert von selectedVoice:", selectedVoice);

    // Setze den Wert im Dropdown-Menü
    voiceSelect.value = "";
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten beim Laden der Stimme:", error);
  }
});

// Delede Voice
DeleteVoice.addEventListener("click", function () {
  switch (browserName) {
    case "Chrome":
      chrome.storage.sync.remove("selectedVoice", function () {
        if (chrome.runtime.lastError) {
          console.error("Fehler beim Entfernen des Wertes:", chrome.runtime.lastError);
        } else {
          console.log("Wert wurde erfolgreich entfernt.");
          voiceSelect.value = "";
        }
      });
      break;
    case "Edge":
      chrome.storage.sync.remove("selectedVoice", function () {
        if (chrome.runtime.lastError) {
          console.error("Fehler beim Entfernen des Wertes:", chrome.runtime.lastError);
        } else {
          console.log("Wert wurde erfolgreich entfernt.");
          voiceSelect.value = "";
        }
      });
      break;
    case "Firefox":
      browser.storage.sync.remove("selectedVoice").then(
        () => {
          console.log("Wert wurde erfolgreich entfernt.");
        },
        (error) => {
          console.error("Fehler beim Entfernen des Wertes:", error);
          voiceSelect.value = "";
        }
      );
      break;
  }
});
