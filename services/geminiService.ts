
import { GoogleGenAI, Type } from "@google/genai";
import { Flight } from "../types";

// Always use the required initialization format for GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FLIGHT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    flightNumber: { type: Type.STRING },
    airline: { type: Type.STRING },
    airlineIata: { type: Type.STRING, description: "2-letter IATA code for the airline (e.g., 'LH' for Lufthansa, 'AA' for American Airlines)" },
    origin: {
      type: Type.OBJECT,
      properties: {
        code: { type: Type.STRING },
        name: { type: Type.STRING },
        city: { type: Type.STRING },
        country: { type: Type.STRING },
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
      },
      required: ["code", "name", "city", "country", "lat", "lng"]
    },
    destination: {
      type: Type.OBJECT,
      properties: {
        code: { type: Type.STRING },
        name: { type: Type.STRING },
        city: { type: Type.STRING },
        country: { type: Type.STRING },
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
      },
      required: ["code", "name", "city", "country", "lat", "lng"]
    },
    date: { type: Type.STRING, description: "ISO date format" },
    durationMinutes: { type: Type.NUMBER },
    distanceKm: { type: Type.NUMBER },
  },
  required: ["flightNumber", "airline", "airlineIata", "origin", "destination", "date", "durationMinutes", "distanceKm"]
};

export const parseFlightInput = async (userInput: string): Promise<Partial<Flight> | null> => {
  try {
    // Using gemini-3-pro-preview for complex text parsing and data extraction tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Extract flight details from this input: "${userInput}". If details are missing, estimate coordinates and distances realistically for the airports involved. Strictly identify the correct 2-letter IATA code for the airline. Today's date is ${new Date().toISOString()}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: FLIGHT_RESPONSE_SCHEMA,
      },
    });

    // Access .text property directly as per guidelines
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing flight with Gemini:", error);
    return null;
  }
};
