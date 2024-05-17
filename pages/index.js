import Head from "next/head";
import { useState } from "react";
import axios from 'axios';
import DiagramCanvas from "../components/DiagramCanvas";
import SongForm from "../components/SongForm";
import SongColors from "../components/SongColors";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = async (data) => {
    try {
      const prompt = generatePrompt(data);
      const response = await axios.post('/api/generateSong', { prompt });
      setFormData({ ...data, generatedSong: response.data.text });
      setSubmitted(true);
    } catch (error) {
      console.error('Error generating song:', error);
    }
  };

  const generatePrompt = (formData) => {
    let prompt = `Write a song using the following information. Use the provided lyrics for each part and build around them. Only print the lyrics. If using a repeated verse, just print the type of verse instead of printing it out again:\n\nTitle: ${formData.title}\nSubject: ${formData.subject}\nSounds Like: ${formData.soundsLike}\n\n`;
    Object.keys(formData.selectedParts).forEach((part) => {
      if (formData.selectedParts[part] && formData[part]) {
        prompt += `${part.charAt(0).toUpperCase() + part.slice(1)}: ${formData[part]}\n`;
      }
    });
    return prompt;
  };

  return (
    <>
      <Head>
        <title>Diagram Your Song</title>
        <meta name="description" content="Create diagrams for your songs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <h1 className="text-5xl font-extrabold mb-10 text-center text-indigo-600">AI Song Writer</h1>
        <div className={styles.container}>
          {!submitted ? (
            <SongForm onSubmit={handleSubmit} />
          ) : (
            <>
              <SongColors formData={formData} />
              <DiagramCanvas formData={formData} />
            </>
          )}
        </div>
      </main>
    </>
  );
}