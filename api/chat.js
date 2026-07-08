export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Csak POST engedélyezett" });
  }

  const userMessage = req.body.message;

  // valódi memória
  global.history = global.history || [
    {
      role: "system",
      content: "You are Neurai, a friendly, casual Hungarian AI assistant."
    }
  ];

  // user üzenet hozzáadása
  global.history.push({ role: "user", content: userMessage });

  // elküldjük a teljes history-t a modellnek
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: global.history
    })
  });

  const data = await response.json();

  const aiMessage = data.choices?.[0]?.message?.content || "Hiba történt.";

  // AI válasz hozzáadása a memóriához
  global.history.push({ role: "assistant", content: aiMessage });

  res.status(200).json({ reply: aiMessage });
}
