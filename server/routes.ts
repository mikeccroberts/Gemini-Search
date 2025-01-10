import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  GoogleGenerativeAI,
  type ChatSession,
  type GenerateContentResult,
} from "@google/generative-ai";
import { marked } from "marked";
import { setupEnvironment } from "./env";
import ApiKeyManager from "./apiKeyManager";

const env = setupEnvironment();
const apiKeyManager = new ApiKeyManager(env.GOOGLE_API_KEYS);

// Store chat sessions in memory
const chatSessions = new Map<string, ChatSession>();

function getAIModel() {
  const genAI = new GoogleGenerativeAI(apiKeyManager.getNextKey());
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.9,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    },
  });
}

// Format raw text into proper markdown
async function formatResponseToMarkdown(
  text: string | Promise<string>
): Promise<string> {
  // Ensure we have a string to work with
  const resolvedText = await Promise.resolve(text);

  // First, ensure consistent newlines
  let processedText = resolvedText.replace(/\r\n/g, "\n");

  // Process main sections (lines that start with word(s) followed by colon)
  processedText = processedText.replace(
    /^([A-Za-z][A-Za-z\s]+):(\s*)/gm,
    "## $1$2"
  );

  // Process sub-sections (any remaining word(s) followed by colon within text)
  processedText = processedText.replace(
    /(?<=\n|^)([A-Za-z][A-Za-z\s]+):(?!\d)/gm,
    "### $1"
  );

  // Process bullet points
  processedText = processedText.replace(/^[•●○]\s*/gm, "* ");

  // Split into paragraphs
  const paragraphs = processedText.split("\n\n").filter(Boolean);

  // Process each paragraph
  const formatted = paragraphs
    .map((p) => {
      // If it's a header or list item, preserve it
      if (p.startsWith("#") || p.startsWith("*") || p.startsWith("-")) {
        return p;
      }
      // Add proper paragraph formatting
      return `${p}\n`;
    })
    .join("\n\n");

  // Configure marked options for better header rendering
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Convert markdown to HTML using marked
  return marked.parse(formatted);
}

interface WebSource {
  uri: string;
  title: string;
}

interface GroundingChunk {
  web?: WebSource;
}

interface TextSegment {
  startIndex: number;
  endIndex: number;
  text: string;
}

interface GroundingSupport {
  segment: TextSegment;
  groundingChunkIndices: number[];
  confidenceScores: number[];
}

interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports: GroundingSupport[];
  searchEntryPoint?: any;
  webSearchQueries?: string[];
}

export function registerRoutes(app: Express): Server {
  const server = createServer(app);

  // Custom API Keys endpoints
  app.post("/api/keys/custom", (req, res) => {
    try {
      const { keys } = req.body;
      if (!Array.isArray(keys)) {
        return res.status(400).json({ message: "Keys must be an array" });
      }
      
      apiKeyManager.setCustomKeys(keys);
      res.json({ 
        message: "Custom keys set successfully",
        isUsingCustomKeys: apiKeyManager.isUsingCustomKeys(),
        keyCount: apiKeyManager.getKeyCount()
      });
    } catch (error: any) {
      console.error("Error setting custom keys:", error);
      res.status(500).json({
        message: error.message || "Failed to set custom keys"
      });
    }
  });

  app.delete("/api/keys/custom", (req, res) => {
    try {
      apiKeyManager.clearCustomKeys();
      res.json({ 
        message: "Custom keys cleared successfully",
        isUsingCustomKeys: false,
        keyCount: apiKeyManager.getKeyCount()
      });
    } catch (error: any) {
      console.error("Error clearing custom keys:", error);
      res.status(500).json({
        message: error.message || "Failed to clear custom keys"
      });
    }
  });

  app.get("/api/keys/status", (req, res) => {
    try {
      res.json({
        isUsingCustomKeys: apiKeyManager.isUsingCustomKeys(),
        keyCount: apiKeyManager.getKeyCount()
      });
    } catch (error: any) {
      console.error("Error getting key status:", error);
      res.status(500).json({
        message: error.message || "Failed to get key status"
      });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }

      const model = getAIModel();
      // Create a new chat session with search capability
      const chat = model.startChat({
        tools: [
          {
            // @ts-ignore - google_search is a valid tool but not typed in the SDK yet
            google_search: {},
          },
        ],
      });
      
      const result = await chat.sendMessage(query);
      const response = await result.response;
      
      console.log(
        "Raw Google API Response:",
        JSON.stringify(
          {
            text: response.text(),
            candidates: response.candidates,
            groundingMetadata: response.candidates?.[0]?.groundingMetadata,
          },
          null,
          2
        )
      );

      const text = response.text();
      const formattedText = await formatResponseToMarkdown(text);

      // Extract sources from grounding metadata
      const sourceMap = new Map<
        string,
        { title: string; url: string; snippet: string }
      >();

      // Get grounding metadata from response
      const metadata = response.candidates?.[0]?.groundingMetadata as any;
      if (metadata) {
        const chunks = metadata.groundingChunks || [];
        const supports = metadata.groundingSupports || [];

        chunks.forEach((chunk: any, index: number) => {
          if (chunk.web?.uri && chunk.web?.title) {
            const url = chunk.web.uri;
            if (!sourceMap.has(url)) {
              // Find snippets that reference this chunk
              const snippets = supports
                .filter((support: any) =>
                  support.groundingChunkIndices.includes(index)
                )
                .map((support: any) => support.segment.text)
                .join(" ");

              sourceMap.set(url, {
                title: chunk.web.title,
                url: url,
                snippet: snippets || "",
              });
            }
          }
        });
      }

      const sources = Array.from(sourceMap.values());
      console.log('Extracted sources:', JSON.stringify(sources, null, 2));

      // Generate a session ID and store the chat
      const sessionId = Math.random().toString(36).substring(7);
      chatSessions.set(sessionId, chat);

      res.json({
        sessionId,
        summary: formattedText,
        sources,
      });
    } catch (error: any) {
      console.error("Search error:", error);
      res.status(500).json({
        message: error.message || "An error occurred while processing your search",
      });
    }
  });

  // Follow-up endpoint
  app.post("/api/follow-up", async (req, res) => {
    try {
      const { sessionId, query } = req.body;
      const chat = chatSessions.get(sessionId);

      if (!chat) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      const result = await chat.sendMessage(query);
      const response = await result.response;
      
      console.log(
        "Raw Google API Response (Follow-up):",
        JSON.stringify(
          {
            text: response.text(),
            candidates: response.candidates,
            groundingMetadata: response.candidates?.[0]?.groundingMetadata,
          },
          null,
          2
        )
      );

      const text = response.text();
      const formattedText = await formatResponseToMarkdown(text);

      // Extract sources from grounding metadata
      const sourceMap = new Map<
        string,
        { title: string; url: string; snippet: string }
      >();

      // Get grounding metadata from response
      const metadata = response.candidates?.[0]?.groundingMetadata as any;
      if (metadata) {
        const chunks = metadata.groundingChunks || [];
        const supports = metadata.groundingSupports || [];

        chunks.forEach((chunk: any, index: number) => {
          if (chunk.web?.uri && chunk.web?.title) {
            const url = chunk.web.uri;
            if (!sourceMap.has(url)) {
              // Find snippets that reference this chunk
              const snippets = supports
                .filter((support: any) =>
                  support.groundingChunkIndices.includes(index)
                )
                .map((support: any) => support.segment.text)
                .join(" ");

              sourceMap.set(url, {
                title: chunk.web.title,
                url: url,
                snippet: snippets || "",
              });
            }
          }
        });
      }

      const sources = Array.from(sourceMap.values());
      console.log('Extracted sources (Follow-up):', JSON.stringify(sources, null, 2));

      res.json({
        summary: formattedText,
        sources,
      });
    } catch (error: any) {
      console.error("Follow-up error:", error);
      res.status(500).json({
        message: error.message || "An error occurred while processing your follow-up",
      });
    }
  });

  return server;
}
