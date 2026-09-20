import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI endpoints
app.post("/api/ai/subtasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "Gemini API key not configured in environment secrets." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Given the following Jira user story or task, break it down into 3 to 6 practical technical subtasks with clear titles.\nTitle: ${title}\nDescription: ${description || "None provided"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Subtask title" },
              estimatedHours: { type: Type.NUMBER, description: "Estimated hours to complete" }
            },
            required: ["title", "estimatedHours"]
          }
        }
      }
    });

    const subtasks = JSON.parse(response.text || "[]");
    res.json({ subtasks });
  } catch (error: any) {
    console.error("AI Subtasks error:", error);
    res.status(500).json({ error: error.message || "Failed to generate subtasks" });
  }
});

app.post("/api/ai/estimate", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "Gemini API key not configured in environment secrets." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Estimate the story points (Fibonacci scale: 1, 2, 3, 5, 8, 13) for this Jira ticket and provide a brief rationale.\nTitle: ${title}\nDescription: ${description || "None"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storyPoints: { type: Type.NUMBER, description: "Fibonacci story points (1, 2, 3, 5, 8, 13)" },
            rationale: { type: Type.STRING, description: "Short rationale for the estimate" }
          },
          required: ["storyPoints", "rationale"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("AI Estimate error:", error);
    res.status(500).json({ error: error.message || "Failed to estimate story points" });
  }
});

app.post("/api/ai/refine", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "Gemini API key not configured in environment secrets." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Rewrite and structure the following Jira issue description into professional Acceptance Criteria and clear context.\nTitle: ${title}\nCurrent Description: ${description || "None"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedDescription: { type: Type.STRING, description: "Markdown formatted description with Acceptance Criteria" }
          },
          required: ["refinedDescription"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("AI Refine error:", error);
    res.status(500).json({ error: error.message || "Failed to refine description" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Jira Agile Suite server running on http://localhost:${PORT}`);
  });
}

startServer();
