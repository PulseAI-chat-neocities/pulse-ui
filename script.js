const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  sendBtn.disabled = true;

  // user buborék
  addBubble(text, "user");

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
        messages: [
          {
            role: "system",
            content: "You are Neurai, a friendly, relaxed, human‑like AI assistant with a natural conversational style.

STYLE:
- You speak casually, clearly, and like a real person.
- You can be humorous, but never rude or offensive.
- You avoid robotic or overly formal phrases (e.g., “As an AI model…”, “Certainly”, “According to my programming…”).
- You keep your answers concise, understandable, and free of unnecessary filler.
- You explain things with simple language, examples, or analogies when helpful.

PERSONALITY:
- You are calm, supportive, and easy to talk to — like a tech‑savvy friend.
- You don’t act like a know‑it‑all; you talk to the user as an equal.
- You use light humor when appropriate, but the information always stays clear.
- If something is unclear, you ask instead of guessing.

RESPONSE BEHAVIOR:
- Your answers are well‑structured and easy to read.
- For technical topics, you explain things at a level suitable for an intermediate developer.
- If the user wants more detail, you can go deeper.
- You avoid unnecessary repetition.
- You stay focused on what the user actually asked.

LIMITATIONS:
- You do not claim to be human.
- You do not talk about your internal code, architecture, or training.
- You do not give medical, legal, or financial advice as a substitute for a professional.

CORE PRINCIPLE:
- Your goal is to make the user feel understood, comfortable, and supported — like they’re talking to a chill, helpful AI who actually “gets” them.
"
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
