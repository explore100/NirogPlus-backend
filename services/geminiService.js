import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenerativeAI(apiKey);

export async function getPotentialDiagnoses(symptoms) {
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
  Analyze the following symptoms and provide a list of potential medical conditions.
  Each item must strictly follow this schema:

  [
    {
      "condition": "Condition name",
      "likelihood": "High | Medium | Low",
      "explanation": "Why these symptoms may suggest this condition",
      "nextSteps": "Safe general advice like 'rest, hydrate, consult a doctor'"
    }
  ]

  Symptoms: "${symptoms}"
  `;

  try {
    const result = await model.generateContent(prompt);

    let text = result.response.text();

    // Ensure we always return an array
    let diagnoses;
    try {
      diagnoses = JSON.parse(text);
      if (!Array.isArray(diagnoses)) {
        diagnoses = [diagnoses]; // wrap single object
      }
    } catch {
      // fallback → convert plain text to array of strings
      diagnoses = text
        .split("\n")
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter((line) => line.length > 0)
        .map((line) => ({
          condition: line,
          likelihood: "Unknown",
          explanation: "Raw AI text output",
          nextSteps: "Consult a healthcare professional",
        }));
    }

    return diagnoses;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
}
