const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // gomb tiltása, amíg gondolkodik
  sendBtn.disabled = true;

  // user buborék
  addBubble(text, "user");
  input.value = "";

  // „Pulse gondolkodik…” buborék
  const thinkingBubble = addBubble("Neurai is thinking...", "ai");

  try {
    const response = await fetch("https://pulse-proxy-3n26.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are Neurai, a friendly, concise AI assistant. Answer in English by default."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    let aiText = "Error while searching answer.";
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      aiText = data.choices[0].message.content;
    }

    thinkingBubble.textContent = aiText;
  } catch (err) {
    thinkingBubble.textContent = "Couldn't connect to Neurai. Check your internet connection.";
  } finally {
    sendBtn.disabled = false;
    scrollToBottom();
  }
}

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chat.appendChild(bubble);
  scrollToBottom();
  return bubble;
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Menü működés
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");

menuButton.onclick = () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
};

overlay.onclick = () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
};

// Chat rendszer
let chats = JSON.parse(localStorage.getItem("neurai_chats")) || [];
let activeChatId = localStorage.getItem("neurai_active_chat") || null;

// Chatlista kirajzolása
function renderChatList() {
  const list = document.getElementById("chatList");
  list.innerHTML = "";

  chats.forEach(chat => {
    const btn = document.createElement("button");
    btn.className = "chat-item" + (chat.id === activeChatId ? " active" : "");
    btn.textContent = chat.title;

    btn.onclick = () => {
      activeChatId = chat.id;
      saveChats();
      renderChatList();
      renderChat();
    };

    list.appendChild(btn);
  });
}

// Új chat
document.getElementById("newChat").onclick = () => {
  const id = Date.now().toString();

  const newChat = {
    id,
    title: "Új chat",
    messages: []
  };

  chats.push(newChat);
  activeChatId = id;

  saveChats();
  renderChatList();
  renderChat();
};

// Üzenet hozzáadása
function addMessage(role, text) {
  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  chat.messages.push({
    role,
    text,
    time: Date.now()
  });

  saveChats();
  renderChat();
}

// Chat kirajzolása
function renderChat() {
  const chat = chats.find(c => c.id === activeChatId);
  const container = document.getElementById("chatContainer");

  if (!chat) {
    container.innerHTML = "<p>Nincs kiválasztott chat.</p>";
    return;
  }

  container.innerHTML = chat.messages
    .map(m => `<div class="msg ${m.role}">${m.text}</div>`)
    .join("");
}

// Mentés
function saveChats() {
  localStorage.setItem("neurai_chats", JSON.stringify(chats));
  localStorage.setItem("neurai_active_chat", activeChatId);
}

// Induláskor
renderChatList();
renderChat();


