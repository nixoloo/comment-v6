import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // ✅ CORS headers (VERY IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { draft, stance, post } = req.body;

  if (!draft || !post || !stance) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
You are an expert in executive-level communication.
Refine the user's comment so it is concise, precise, calm, and thoughtful.
Maintain this stance: ${stance}.

Executive post:
"${post}"

User draft:
"${draft}"
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const refined = completion.choices[0].message.content;
    return res.status(200).json({ refined });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI refinement failed" });
  }
}
