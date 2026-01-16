import { Request, Response } from "express";
import { prisma } from "../db";

const checkFingerPrint = async (req: Request, res: Response) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "visitorID missing" });
    }
    const user = await prisma.user.upsert({
      where: { visitor_id: visitorId },
      update: { visited: { increment: 1 } },
      create: { visitor_id: visitorId, visited: 1, seekerPosition: 33 },
    });
    res.json({
      isReturning: user.visited > 1,
      visited: user.visited,
      seekerPosition: user.seekerPosition,
    });
  } catch (e) {
    console.log("error occured at", e);
  }
};

const updateSlider = async (req: Request, res: Response) => {
  try {
    const { visitorId, sliderValue } = req.body;

    if (!visitorId) {
      return res.status(400).json({ error: "No slider value found" });
    }

    if (typeof sliderValue !== "number") {
      return res.status(400).json({ error: "Invalid slider value" });
    }

    const sliderValueUpdate = await prisma.user.update({
      where: { visitor_id: visitorId },
      data: { seekerPosition: sliderValue },
    });
    res.json({
      success: true,
      sliderValue: sliderValueUpdate.seekerPosition,
    });
  } catch (error) {
    console.log("Error occured at", error);
  }
};

export { checkFingerPrint, updateSlider };
