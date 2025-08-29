import express from "express";
import { getPotentialDiagnoses } from "../services/geminiService.js";

const router = express.Router();

router.post("/diagnose", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    const diagnoses = await getPotentialDiagnoses(symptoms);
    res.json({ diagnoses });
  } catch (error) {
    console.error("Diagnosis error:", error);
    res.status(500).json({ error: "Failed to analyze symptoms" });
  }
});

export default router;
