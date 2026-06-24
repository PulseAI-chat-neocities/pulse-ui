const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// CHAT MEMORY
let history = [
  {
    role: "system",
    content: "You are Neurai, a friendly, casual AI assistant. Beszélj természetesen, emberien, egyszerűen. Légy támogató, humoros, de soha nem sértő. Ne légy túl formális vagy robotikus. Válaszolj világosan és lényegre törően."
.`
  }
];

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  sendBtn.disabled = true;

  // USER bubble
  addBubble(text, "user");

  // ADD USER MESSAGE TO MEMORY
  history.push({
    role: "user",
    content: text
  });

  input.value = "";

  const thinkingBubble = addBubble("Neurai is thinking...", "ai");

  try {
    const response = await fetch("https://pulse-proxy-3n26.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: history
      })
    });

    const data = await response.json();

    let aiText = "Error while searching answer.";
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      aiText = data.choices[0].message.content;
    }

    thinkingBubble.textContent = aiText;

    // ADD AI RESPONSE TO MEMORY
    history.push({
      role: "assistant",
      content: aiText
    });

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

