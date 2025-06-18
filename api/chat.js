
export default async function handler(req, res) {
  console.log("🔍 Incoming request to /api/chat");

  if (req.method !== 'POST') {
    console.warn("❌ Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;
    console.log("🧠 Messages received:", messages);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        temperature: 0.6
      })
    });

    const data = await response.json();
    console.log("✅ OpenAI response:", data);

    if (data.choices && data.choices[0]) {
      return res.status(200).json({ result: data.choices[0].message.content });
    } else {
      console.error("❌ No valid choices from OpenAI:", data);
      return res.status(500).json({ error: "No result from OpenAI" });
    }

  } catch (err) {
    console.error("❌ Internal server error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
