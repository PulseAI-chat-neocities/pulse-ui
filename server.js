import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// valódi memória a szerveren
let history = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // hozzáadjuk a user üzenetet a memóriához
  history.push({ role: "user", content: userMessage });

  // elküldjük a teljes history-t a modellnek
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer YOUR_GROQ_API_KEY`
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: history
    })
  });

  const data = await response.json();
  const aiText = data.choices[0].message.content;

  // AI válasz hozzáadása a memóriához
  history.push({ role: "assistant", content: aiText });

  res.json({ reply: aiText });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
