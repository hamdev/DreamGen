"use client";

import Image from "next/image";
import { getSpeech, getText} from "./services/audioService";
import { useState } from "react";

const baseUrl = "https://special-space-potato-rrprq9wrpqcppxj-3000.preview.app.github.dev/";

export default function Home() {
  const [meditationFile, setMeditationFile] = useState("");
  const [dreamFile, setDreamFile] = useState("");
  const [dream, setDream] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {

    let t0 = performance.now();

    setIsLoading(true);
    const meditationPrompt = await getText();
    const meditationPath = await getSpeech(meditationPrompt);
    setMeditationFile(baseUrl + meditationPath);

    const dreamPrompt = await getText("You are a renowned fiction writer.  You are particularly famed for your ephereal works on dreams.  You write stories that guide people to sleep with calm and descriptive narrative.  Your stories are always in the second person.  Write for as long as you can.  Do not end the dream waking up but fade into sleep.", "Write a dream about " + dream);
    const dreamPath = await getSpeech(dreamPrompt);
    setDreamFile(baseUrl + dreamPath);

    setIsLoading(false);

    let t1 = performance.now();
    console.log("Call to generate dream took " + (t1 - t0) + " milliseconds.");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div >
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center z-50">
Loading          </div>
        )}
        <div className="z-10">
          <h1 className="text-2xl">Welcome to Dreamgen</h1>
          <p className="">What would you like to dream about?</p>
          <textarea
            placeholder="Enter your dream here"
            className="shadow-sm border-slate-300 bg-white/60 p-2 my-2 w-full rounded-md"
            onChange={(e) => setDream(e.target.value)}
          />
          <button
            className="bg-sky-500 text-white p-2 rounded-md"
            onClick={handleClick}
          >
            Generate Dream
          </button>
          {meditationFile && <audio controls autoplay src={meditationFile}></audio>}
          {dreamFile && <audio controls src={dreamFile}></audio>}
        </div>
      </div>
    </main>
  );
}
