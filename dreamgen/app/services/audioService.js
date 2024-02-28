"use server";

import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });

const guidedMeditation =
  "You are an experienced meditation guide and trainer.  You are calm and patient, forgiving and caring.  You are a master of your craft, and you are able to guide others to a place of calm.";
const model = "gpt-4-turbo-preview";
const speed = 0.8;
const voice = "nova"

const getText = async (
  systemMessage = guidedMeditation,
  prompt = "Write a two paragraph guided meditation for sleep. Don't introduce the practice and don't tell me to open my eyes at the end."
) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      model: model,
    });

    console.log(completion.choices[0]);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};

const getSpeech = async (text) => {
  const speechId = uuidv4();
  const speechPath = `speech/${speechId}.mp3`;
  const speechSavePath = path.join("public", speechPath);

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
      speed: speed,
    });

    console.log(speechSavePath);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechSavePath, buffer);

    return speechPath;
  } catch (error) {
    console.error(error);
  }
};

export { getSpeech, getText };
