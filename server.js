const path = require("path");
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { fetch: undiciFetch } = require("undici");

// Load .env from this file's directory (not process.cwd()), so the key is found even if you
// start Node from another folder.
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/explain", async (req, res) => {
  try {
    const question = req.body?.question?.trim();
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!question) {
      return res.status(400).json({
        explanation: "Please provide a question.",
      });
    }

    if (!apiKey || apiKey === "your_openai_api_key_here") {
      return res.status(500).json({
        explanation:
          "Missing OPENAI_API_KEY. Copy .env.example to .env, set your real key, and restart the server.",
      });
    }

    const openai = new OpenAI({
      apiKey,
      fetch: undiciFetch,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful tutor that explains step by step in simple language.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content ?? "No explanation generated.";
    return res.json({ explanation: answer });
  } catch (error) {
    console.error("OPENAI ERROR:", error?.response?.data || error?.message || error);

    return res.status(500).json({
      explanation: `Error: ${error?.message || "Failed to generate explanation"}`,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

