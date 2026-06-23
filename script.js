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
  const thinkingBubble = addBubble("Pulse is thinking...", "ai");

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
            content: "You are Pulse, a friendly, concise AI assistant. Answer in English by default."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    let aiText = "Error while searrching answer.";
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      aiText = data.choices[0].message.content;
    }

    thinkingBubble.textContent = aiText;
  } catch (err) {
    thinkingBubble.textContent = "Couln't connect to Groq. Check your API key or internet connection.";
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
