const input =
document.getElementById("userInput");

const voiceBar =
document.querySelector(".voice-bar");

const messages =
document.getElementById("messages");

const clearBtn =
document.querySelector(
  ".clear-chat-btn"
);

/* =========================================
   MEMORY
========================================= */

let chatMemory = [];

/* =========================================
   SAVE CHAT
========================================= */

function saveChats(){

  localStorage.setItem(

    "nova_chats",

    messages.innerHTML
  );
}

/* =========================================
   LOAD CHAT
========================================= */

function loadChats(){

  const saved =

  localStorage.getItem(
    "nova_chats"
  );

  if(saved){

    messages.innerHTML = saved;
  }
}

loadChats();

/* =========================================
   COPY CODE
========================================= */

function addCopyButtons(){

  const pres =
  document.querySelectorAll("pre");

  pres.forEach(pre=>{

    if(
      pre.querySelector(".copy-btn")
    ) return;

    const btn =
    document.createElement(
      "button"
    );

    btn.innerText =
    "📋 Copy";

    btn.className =
    "copy-btn";

    btn.onclick = ()=>{

      navigator.clipboard.writeText(
        pre.innerText
      );

      btn.innerText =
      "✅ Copied";

      setTimeout(()=>{

        btn.innerText =
        "📋 Copy";

      },1500);
    };

    pre.appendChild(btn);
  });
}

/* =========================================
   FORMAT REPLY
========================================= */

function formatReply(text){

  return text

  .replace(

    /```([\s\S]*?)```/g,

    `<pre><code>$1</code></pre>`
  )

  .replace(

    /\*\*(.*?)\*\*/g,

    "<b>$1</b>"
  )

  .replace(/\n/g,"<br>");
}

/* =========================================
   SPEAK TEXT
========================================= */

let currentSpeech = null;

function speakText(text){

  window.speechSynthesis.cancel();

  currentSpeech =

  new SpeechSynthesisUtterance(
    text
  );

  currentSpeech.lang =
  currentLanguage;

  currentSpeech.rate = 1;

  currentSpeech.volume =
  aiVolume;

  window.speechSynthesis.speak(
  currentSpeech
);
}

/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage(){

  const text =
  input.value.trim();

  if(text === "") return;

  chatMemory.push({
    role:"user",
    content:text
  });

  /* USER MESSAGE */

  const userMsg =
  document.createElement("div");

  userMsg.className =
  "user-msg";

  userMsg.innerText =
  text;

  messages.appendChild(
    userMsg
  );

  input.value = "";

  messages.scrollTop =
  messages.scrollHeight;

  voiceBar.classList.add(
    "active"
  );

  /* THINKING */

  const loadingMsg =
  document.createElement("div");

  loadingMsg.className =
  "bot-msg";

  loadingMsg.innerHTML =
  "Nova is thinking<span class='dots'>...</span>";

  messages.appendChild(
    loadingMsg
  );

  try{

    const finalPrompt = `
      Reply ONLY in ${selectedLanguage} language.

      User:
      ${text}
      `;

    const response =
    await fetch(

      "https://nova-backend-eight.vercel.app/api/chat",

      {
        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({
          

          message:finalPrompt,

          memory:chatMemory
        })
      }
    );

    const data =
    await response.json();

    loadingMsg.remove();

    /* BOT MESSAGE */

    const botMsg =
    document.createElement("div");

    botMsg.className =
    "bot-msg";

    botMsg.innerHTML =
    formatReply(
      data.reply
    );

    messages.appendChild(
      botMsg
    );

    chatMemory.push({

      role:"assistant",

      content:data.reply
    });

    addCopyButtons();

    saveChats();

    messages.scrollTop =
    messages.scrollHeight;

    speakText(data.reply);

  }

  catch(error){

    loadingMsg.innerText =
    "Nova backend failed 😭";
  }

  setTimeout(()=>{

    voiceBar.classList.remove(
      "active"
    );

  },1200);
}

/* =========================================
   ENTER PRESS
========================================= */

input.addEventListener(

  "keydown",

  function(e){

    if(e.key === "Enter"){

      e.preventDefault();

      sendMessage();
    }
  }
);

/* =========================================
   VOICE INPUT
========================================= */

const SpeechRecognition =

window.SpeechRecognition
||
window.webkitSpeechRecognition;

if(SpeechRecognition){

  const recognition =
  new SpeechRecognition();

  recognition.lang =
  "en-US";

  recognition.continuous =
  false;

  recognition.interimResults =
  false;

  const micBtn =
  document.querySelector(
    ".mic-btn"
  );

  if(micBtn){

    micBtn.addEventListener(

      "click",

      ()=>{

        recognition.start();

      }
    );
  }

  recognition.onresult =
  function(event){

    const transcript =

    event.results[0][0]
    .transcript;

    input.value =
    transcript;

    sendMessage();
  };
}

/* =========================================
   STOP SPEAKING
========================================= */

const stopBtn =

document.querySelector(
  ".stop-btn"
);

if(stopBtn){

  stopBtn.addEventListener(

    "click",

    ()=>{

      window.speechSynthesis.cancel();

    }
  );
}

/* =========================================
   CLEAR CHAT
========================================= */

if(clearBtn){

  clearBtn.addEventListener(

    "click",

    ()=>{

      localStorage.removeItem(
        "nova_chats"
      );

      messages.innerHTML = "";

      chatMemory = [];
    }
  );
}

addCopyButtons();

/* =========================================
   PAGE SWITCHING
========================================= */

const dashboardBtn =
document.querySelector(
  ".menu-dashboard"
);

const chatBtn =
document.querySelector(
  ".menu-chat"
);

const filesBtn =
document.querySelector(
  ".menu-files"
);

const notesBtn =
document.querySelector(
  ".menu-notes"
);

const dashboard =
document.querySelector(
  ".main-panel"
);

const chatPanel =
document.querySelector(
  ".chat-panel"
);

/* =========================================
   ACTIVE MENU
========================================= */

function clearActive(){

  document
  .querySelectorAll(".menu li")
  .forEach(li=>{

    li.classList.remove(
      "active"
    );
  });
}

/* =========================================
   DASHBOARD PAGE
========================================= */

dashboardBtn.onclick = ()=>{

  clearActive();

  dashboardBtn.classList.add(
    "active"
  );

  dashboard.style.display =
  "flex";

  chatPanel.style.display =
  "flex";
};

/* =========================================
   CHAT PAGE
========================================= */

chatBtn.onclick = ()=>{

  clearActive();

  chatBtn.classList.add(
    "active"
  );

  dashboard.style.display =
  "none";

  chatPanel.style.width =
  "100%";

  chatPanel.style.marginLeft =
  "0";
};

/* =========================================
   GOOGLE SEARCH
========================================= */

document
.getElementById(
  "googleSearchBtn"
)

.onclick = ()=>{

  const query =
  prompt(
    "Search Google"
  );

  if(query){

    window.open(

      `https://www.google.com/search?q=${query}`,

      "_blank"
    );
  }
};

/* =========================================
   FILE UPLOAD
========================================= */

const fileInput =
document.getElementById(
  "fileInput"
);

filesBtn.onclick = ()=>{

  clearActive();

  filesBtn.classList.add(
    "active"
  );

  fileInput.click();
};

fileInput.onchange = ()=>{

  const file =
  fileInput.files[0];

  if(file){

    const msg =
    document.createElement(
      "div"
    );

    msg.className =
    "bot-msg";

    msg.innerHTML =
    `📄 ${file.name} uploaded`;

    messages.appendChild(msg);

    saveChats();

    messages.scrollTop =
    messages.scrollHeight;
  }
};

/* =========================================
   NOTES PANEL
========================================= */

const notesPanel =
document.querySelector(
  ".notes-panel"
);

const notesInput =
document.getElementById(
  "notesInput"
);

const saveNotesBtn =
document.getElementById(
  "saveNotesBtn"
);

const closeNotesBtn =
document.getElementById(
  "closeNotesBtn"
);

const deleteNotesBtn =
document.getElementById(
  "deleteNotesBtn"
);

/* OPEN NOTES */

notesBtn.onclick = ()=>{

  clearActive();

  notesBtn.classList.add(
    "active"
  );

  notesPanel.style.display =
  "block";

  notesInput.value =

  localStorage.getItem(
    "nova_notes"
  )
  ||
  "";
};

/* SAVE NOTES */

saveNotesBtn.onclick = ()=>{

  localStorage.setItem(

    "nova_notes",

    notesInput.value
  );

  alert(
    "Notes Saved 😎"
  );
};

/* CLOSE NOTES */

closeNotesBtn.onclick = ()=>{

  notesPanel.style.display =
  "none";
};

/* DELETE NOTES */

deleteNotesBtn.onclick = ()=>{

  localStorage.removeItem(
    "nova_notes"
  );

  notesInput.value = "";

  alert(
    "Notes Deleted 😎"
  );
};

/* =========================================
   CAMERA
========================================= */

const cameraBtn =
document.getElementById(
  "cameraBtn"
);

const cameraPanel =
document.querySelector(
  ".camera-panel"
);

const cameraVideo =
document.getElementById(
  "cameraVideo"
);

const closeCameraBtn =
document.getElementById(
  "closeCameraBtn"
);

const captureBtn =
document.getElementById(
  "captureBtn"
);

/* OPEN CAMERA */

cameraBtn.onclick =
async()=>{

  try{

    const stream =
    await navigator
    .mediaDevices
    .getUserMedia({

      video:true
    });

    cameraPanel.style.display =
    "block";

    cameraVideo.srcObject =
    stream;

  }

  catch(err){

    alert(
      "Camera access denied 😭"
    );
  }
};

/* CLOSE CAMERA */

closeCameraBtn.onclick = ()=>{

  cameraPanel.style.display =
  "none";

  const stream =
  cameraVideo.srcObject;

  if(stream){

    stream
    .getTracks()
    .forEach(track=>{

      track.stop();
    });
  }
};

/* CAPTURE PHOTO */

captureBtn.onclick = ()=>{

  const canvas =
  document.createElement(
    "canvas"
  );

  canvas.width =
  cameraVideo.videoWidth;

  canvas.height =
  cameraVideo.videoHeight;

  const ctx =
  canvas.getContext("2d");

  ctx.drawImage(

    cameraVideo,

    0,
    0
  );

  const image =
  canvas.toDataURL(
    "image/png"
  );

  const img =
  document.createElement(
    "img"
  );

  img.src = image;

  img.style.width =
  "220px";

  img.style.borderRadius =
  "18px";

  img.style.marginTop =
  "10px";

  const msg =
  document.createElement(
    "div"
  );

  msg.className =
  "bot-msg";

  msg.appendChild(img);

  messages.appendChild(msg);

  messages.scrollTop =
  messages.scrollHeight;

  saveChats();
};

/* =========================================
   PHOTO UPLOAD
========================================= */

document
.getElementById(
  "photoBtn"
)

.onclick = ()=>{

  fileInput.accept =
  "image/*";

  fileInput.click();
};

/* =========================================
   SYSTEM SCAN
========================================= */

document
.getElementById(
  "scanBtn"
)

.onclick = ()=>{

  document.body.classList.add(
    "scan-active"
  );

  const msg =
  document.createElement(
    "div"
  );

  msg.className =
  "bot-msg";

  msg.innerHTML =

  `
  📈 Scanning System...<br>
  ✅ AI Modules Stable<br>
  ✅ GPU Optimized<br>
  ✅ No Threats Found
  `;

  messages.appendChild(msg);

  setTimeout(()=>{

    document.body.classList.remove(
      "scan-active"
    );

  },3000);
};

/* =========================================
/* =========================================
   CLEAR MEMORY
========================================= */

const clearMemoryBtn =
document.getElementById(
  "clearMemoryBtn"
);

clearMemoryBtn.onclick = ()=>{

  chatMemory = [];

  alert(
    "AI Memory Cleared 😎"
  );
};

/* =========================================
   CLEAR ALL CHATS
========================================= */

const clearAllChatsBtn =
document.getElementById(
  "clearAllChatsBtn"
);

clearAllChatsBtn.onclick = ()=>{

  localStorage.removeItem(
    "nova_chats"
  );

  messages.innerHTML = "";

  alert(
    "Chats Cleared 😎"
  );
};

/* =========================================
   NOTIFICATION PANEL
========================================= */

const bellBtn =
document.getElementById(
  "bellBtn"
);

const notificationPanel =
document.querySelector(
  ".notification-panel"
);

const closeBellBtn =
document.getElementById(
  "closeBellBtn"
);

bellBtn.onclick = ()=>{

  notificationPanel.style.display =
  "block";
};

closeBellBtn.onclick = ()=>{

  notificationPanel.style.display =
  "none";
};


/* =========================================
   BELL OPEN
========================================= */

const bell =
document.getElementById(
  "bellBtn"
);

const bellPanel =
document.querySelector(
  ".notification-panel"
);

const closeBell =
document.getElementById(
  "closeBellBtn"
);

bell.onclick = ()=>{

  bellPanel.style.display =
  "block";
};

closeBell.onclick = ()=>{

  bellPanel.style.display =
  "none";
};

/* =========================================
   FINAL DASHBOARD + SETTINGS SYSTEM
========================================= */

/* DROPDOWNS */

const dashboardDropdown =
document.querySelector(
  ".dashboard-dropdown"
);

const settingsDropdown =
document.querySelector(
  ".settings-dropdown"
);

const settingsBtn =
document.querySelector(
  ".menu-settings"
);

/* DASHBOARD OPEN/CLOSE */

dashboardBtn.addEventListener(

  "click",

  ()=>{

    dashboardDropdown.classList.toggle(
      "show"
    );
  }
);

/* =========================================
   SIDEBAR SETTINGS
========================================= */

settingsBtn.onclick = ()=>{

  settingsDropdown.classList.toggle(
    "show"
  );
};

/* =========================================
   LIVE CPU + RAM
========================================= */

const cpuBar =
document.getElementById("cpu");

const ramBar =
document.getElementById("ram");

setInterval(()=>{

  const cpu =
  Math.floor(Math.random()*100);

  const ram =
  Math.floor(Math.random()*100);

  cpuBar.style.width =
  cpu + "%";

  ramBar.style.width =
  ram + "%";

},2000);


/* =========================================
   INTERNET STATUS
========================================= */

document
.getElementById(
  "internetBtn"
)

.onclick = ()=>{

  if(navigator.onLine){

    alert(
      "🌐 Internet Connected"
    );
  }

  else{

    alert(
      "❌ Internet Offline"
    );
  }
};

/* =========================================
   AI STATUS
========================================= */

document
.getElementById(
  "aiStatusBtn"
)

.onclick = ()=>{

  alert(
    "🧠 NOVA AI Active 😎"
  );
};

/* =========================================
   RECENT ACTIVITY
========================================= */

document
.getElementById(
  "activityBtn"
)

.onclick = ()=>{

  alert(
    "📂 Recent Activity Loaded 😎"
  );
};


/* =========================================
   VOICE VOLUME
========================================= */

let aiVolume = 1;

document
.getElementById(
  "voiceVolumeBtn"
)

.onclick = ()=>{

  const volume =
  prompt(
    "Enter volume 0 to 100"
  );

  aiVolume =
  volume / 100;

  alert(
    "🔊 Volume set to " +
    volume + "%"
  );
};

/* =========================================
   LANGUAGE
========================================= */

let currentLanguage =
"en-US";

let selectedLanguage =
"English";

document
.getElementById(
  "languageBtn"
)

.onclick = ()=>{

  const lang =
  prompt(
    `
Hindi
English
German
French
Spanish
Japanese
Russian
`
  );

  if(!lang) return;

  if(lang.toLowerCase() === "hindi"){

    currentLanguage =
    "hi-IN";

    selectedLanguage =
    "Hindi";
  }

  else if(
    lang.toLowerCase() === "german"
  ){

    currentLanguage =
    "de-DE";

    selectedLanguage =
    "German";
  }

  else if(
    lang.toLowerCase() === "french"
  ){

    currentLanguage =
    "fr-FR";

    selectedLanguage =
    "French";
  }

  else if(
    lang.toLowerCase() === "spanish"
  ){

    currentLanguage =
    "es-ES";

    selectedLanguage =
    "Spanish";
  }

  else if(
    lang.toLowerCase() === "japanese"
  ){

    currentLanguage =
    "ja-JP";

    selectedLanguage =
    "Japanese";
  }

  else if(
    lang.toLowerCase() === "russian"
  ){

    currentLanguage =
    "ru-RU";

    selectedLanguage =
    "Russian";
  }

  else{

    currentLanguage =
    "en-US";

    selectedLanguage =
    "English";
  }

  alert(
    "🌍 Language changed to " +
    selectedLanguage
  );
};

/* =========================================
   NOTIFICATIONS
========================================= */

let notifyOn = true;

document
.getElementById(
  "notificationToggleBtn"
)

.onclick = ()=>{

  notifyOn = !notifyOn;

  const notifyItem =
  document.createElement(
    "div"
  );

  notifyItem.className =
  "notify-item";

  notifyItem.innerHTML =

  notifyOn

  ?

  "🔔 Notifications Enabled"

  :

  "❌ Notifications Disabled";

  document
  .getElementById(
    "notificationList"
  )
  .appendChild(
    notifyItem
  );
};

/* =========================================
   CLEAR CACHE
========================================= */

document
.getElementById(
  "clearCacheBtn"
)

.onclick = ()=>{

  localStorage.clear();

  alert(
    "🧹 Cache Cleared"
  );
};

/* =========================================
   PRIVACY MODE
========================================= */

document
.getElementById(
  "privacyBtn"
)

.onclick = ()=>{

  document.body.classList.toggle(
    "privacy-mode"
  );
};

/* =========================================
   BACKUP DATA
========================================= */

document
.getElementById(
  "backupBtn"
)

.onclick = ()=>{

  const data =

  localStorage.getItem(
    "nova_chats"
  )
  ||
  "No Chats";

  const blob =
  new Blob([data],{

    type:"text/plain"
  });

  const a =
  document.createElement("a");

  a.href =
  URL.createObjectURL(blob);

  a.download =
  "nova-backup.txt";

  a.click();
};

/* =========================================
   TOP SETTINGS DROPDOWN
========================================= */

const topSettingsBtn =
document.getElementById(
  "topSettingsBtn"
);

const topSettingsDropdown =
document.querySelector(
  ".top-settings-dropdown"
);

let topSettingsOpen = false;

/* YAHAN YE CODE 😎👇 */

topSettingsBtn.onclick = ()=>{

  topSettingsOpen =
  !topSettingsOpen;

  if(topSettingsOpen){

    topSettingsDropdown.style.display =
    "flex";
  }

  else{

    topSettingsDropdown.style.display =
    "none";
  }
};

/* =========================================
ADVANCED NOVA AI SYSTEM FINAL
========================================= */

/* REQUIRED VARIABLES */

const micBtn =
document.querySelector(".mic-btn");

/* =========================================
BOT MESSAGE
========================================= */

function addBotMessage(text){

const msg =
document.createElement("div");

msg.className =
"bot-msg";

msg.innerHTML =
text;

messages.appendChild(msg);

messages.scrollTop =
messages.scrollHeight;

speakText(text);
}

/* =========================================
BUTTONS
========================================= */

const jokeBtn =
document.getElementById("jokeBtn");

const youtubeBtn =
document.getElementById("youtubeBtn");

const newsBtn =
document.getElementById("newsBtn");

const reminderBtn =
document.getElementById("reminderBtn");

/* =========================================
JOKE BUTTON
========================================= */

if(jokeBtn){

jokeBtn.onclick = ()=>{

const jokes = [

  "🤣 Why don’t programmers like nature? Too many bugs 😎",

  "😂 AI took my job... now it asks me for help.",

  "😎 Error 404: Joke not found.",

  "🤣 Java and JavaScript are like car and carpet."

];

const randomJoke =

jokes[
  Math.floor(
    Math.random()*jokes.length
  )
];

addBotMessage(
  randomJoke
);

};
}

/* =========================================
YOUTUBE BUTTON
========================================= */

if(youtubeBtn){

youtubeBtn.onclick = ()=>{

window.open(
  "https://youtube.com",
  "_blank"
);

addBotMessage(
  "▶ Opening YouTube 😎"
);

};
}

/* =========================================
NEWS BUTTON
========================================= */

if(newsBtn){

newsBtn.onclick = ()=>{

addBotMessage(

`📰 AI reached new speed record 🚀

📰 NOVA upgraded successfully 😎

📰 Quantum chips launching soon 🤖`

);

};
}

/* =========================================
REMINDER BUTTON
========================================= */

if(reminderBtn){

reminderBtn.onclick = ()=>{

const reminderText =
prompt("Enter Reminder");

const seconds =
prompt("Enter seconds");

addBotMessage(
  "⏰ Reminder Set: " +
  reminderText
);

setTimeout(()=>{

  addBotMessage(
    "⏰ Reminder: " +
    reminderText
  );

  alert(
    "⏰ " + reminderText
  );

},seconds*1000);

};
}

/* =========================================
CHAT COMMANDS FINAL
========================================= */

const originalSendMessage =
sendMessage;

sendMessage = async ()=>{

const text =
input.value
.trim()
.toLowerCase();

/* OPEN YOUTUBE */

if(
text.includes(
"open youtube"
)
){

window.open(
  "https://youtube.com",
  "_blank"
);

addBotMessage(
  "▶ Opening YouTube 😎"
);

return;

}

/* OPEN GOOGLE */

if(
text.includes(
"open google"
)
){

window.open(
  "https://google.com",
  "_blank"
);

addBotMessage(
  "🌐 Opening Google 😎"
);

return;

}

/* OPEN WHATSAPP */

if(
text.includes(
"open whatsapp"
)
){

window.open(
  "https://web.whatsapp.com",
  "_blank"
);

addBotMessage(
  "💬 Opening WhatsApp 😎"
);

return;

}

/* OPEN INSTAGRAM */

if(
text.includes(
"open instagram"
)
){

window.open(
  "https://instagram.com",
  "_blank"
);

addBotMessage(
  "📸 Opening Instagram 😎"
);

return;

}

/* OPEN CHATGPT */

if(
text.includes(
"open chatgpt"
)
){

window.open(
  "https://chatgpt.com",
  "_blank"
);

addBotMessage(
  "🤖 Opening ChatGPT 😎"
);

return;

}

/* NORMAL CHAT */

await originalSendMessage();

};

/* =========================================
VOICE COMMANDS
========================================= */

if(
window.SpeechRecognition
||
window.webkitSpeechRecognition
){

const SpeechRecognition =

window.SpeechRecognition
||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.continuous =
false;

recognition.lang =
currentLanguage;

recognition.onresult =
(event)=>{

const transcript =

event.results[0][0]
.transcript;

input.value =
transcript;

addBotMessage(
  "🎤 " + transcript
);

sendMessage();

};

if(micBtn){

micBtn.addEventListener(

  "click",

  ()=>{

    recognition.start();

    addBotMessage(
      "🎤 Listening..."
    );

  }
);

}
}

/* =========================================
   THEME COLORS FINAL
========================================= */

const body = document.body;

/* REMOVE OLD THEMES */

function clearThemes(){

body.classList.remove(
"red-theme",
"blue-theme",
"green-theme",
"purple-theme",
"normal-theme"
);

}

/* RED */

document.querySelector(".red").onclick = ()=>{

clearThemes();

body.classList.add("red-theme");

};

/* BLUE */

document.querySelector(".blue").onclick = ()=>{

clearThemes();

body.classList.add("blue-theme");

};

/* GREEN */

document.querySelector(".green").onclick = ()=>{

clearThemes();

body.classList.add("green-theme");

};

/* PURPLE */

document.querySelector(".purple").onclick = ()=>{

clearThemes();

body.classList.add("purple-theme");

};

/* NORMAL */

document.querySelector(".normal").onclick = ()=>{

clearThemes();

body.classList.add("normal-theme");

};





/* =========================================
PERFORMANCE MODE CIRCLES
========================================= */

const lowMode =
document.getElementById("lowMode");

const mediumMode =
document.getElementById("mediumMode");

const highMode =
document.getElementById("highMode");

const normalMode =
document.getElementById("normalMode");

/* LOW */

lowMode.onclick = ()=>{

document.body.classList.remove(
"medium-performance",
"high-performance"
);

document.body.classList.add(
"low-performance"
);

};

/* MEDIUM */

mediumMode.onclick = ()=>{

document.body.classList.remove(
"low-performance",
"high-performance"
);

};

/* HIGH */

highMode.onclick = ()=>{

document.body.classList.remove(
"low-performance",
"medium-performance"
);

document.body.classList.add(
"high-performance"
);

};

/* NORMAL */

normalMode.onclick = ()=>{

document.body.classList.remove(
"low-performance",
"medium-performance",
"high-performance"
);

};

/* =========================================
NIGHT MODE CIRCLES
========================================= */

const darkMode =
document.getElementById("darkMode");

const neonMode =
document.getElementById("neonMode");

const midnightMode =
document.getElementById("midnightMode");

const normalNight =
document.getElementById("normalNight");

/* DARK */

darkMode.onclick = ()=>{

document.body.classList.remove(
"neon-mode",
"midnight-mode"
);

document.body.classList.add(
"dark-mode"
);

};

/* NEON */

neonMode.onclick = ()=>{

document.body.classList.remove(
"dark-mode",
"midnight-mode"
);

document.body.classList.add(
"neon-mode"
);

};

/* MIDNIGHT */

midnightMode.onclick = ()=>{

document.body.classList.remove(
"dark-mode",
"neon-mode"
);

document.body.classList.add(
"midnight-mode"
);

};

/* NORMAL */

normalNight.onclick = ()=>{

document.body.classList.remove(
"dark-mode",
"neon-mode",
"midnight-mode"
);

};




