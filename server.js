const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const envPath = path.join(__dirname, ".env");

// Load .env from this file's directory (not process.cwd()).
// override: true — if GROQ_API_KEY is set to an empty string in your shell/IDE, dotenv would
// otherwise skip it and you'd see "missing key" even with a valid .env file.
require("dotenv").config({ path: envPath, override: true });

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, serve the original HTML file
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
}

app.post("/explain", async (req, res) => {
  try {
    const question = req.body?.question?.trim();
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!question) {
      return res.status(400).json({
        explanation: "Please provide a question.",
      });
    }

    if (!apiKey || apiKey === "your_groq_api_key_here") {
      return res.status(500).json({
        explanation:
          "Missing GROQ_API_KEY. Copy .env.example to .env, set your real key, and restart the server.",
      });
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
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

    const answer = completion.choices?.[0]?.message?.content || "No explanation generated.";
    return res.json({ explanation: answer });
  } catch (error) {
    console.error("GROQ ERROR:", error?.message || error);

    return res.status(500).json({
      explanation: `Error: ${error?.message || "Failed to generate explanation"}`,
    });
  }
});

app.listen(3000, () => {
  const hasKey = Boolean(process.env.GROQ_API_KEY?.trim());
  console.log("Server running on port 3000");
  console.log(
    hasKey
      ? "GROQ_API_KEY: loaded from .env"
      : `GROQ_API_KEY: missing — add it to ${envPath} (file exists: ${fs.existsSync(envPath)})`
  );
});

