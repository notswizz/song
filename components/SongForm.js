import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import DiagramCanvas from './DiagramCanvas';

const SongForm = () => {
  const [selectedParts, setSelectedParts] = useState({
    intro: false,
    verse: false,
    chorus: false,
    hook: false,
    bridge: false,
    outro: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    soundsLike: '',
    intro: '',
    verse: '',
    chorus: '',
    hook: '',
    bridge: '',
    outro: '',
  });

  const [generatedSong, setGeneratedSong] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleCheckboxChange = (part) => {
    setSelectedParts((prev) => ({
      ...prev,
      [part]: !prev[part],
    }));
  };

  const handleInputChange = (part, value) => {
    setFormData((prev) => ({
      ...prev,
      [part]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const prompt = generatePrompt(formData);

    try {
      const response = await fetch('/api/generateSong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setGeneratedSong(data.text);
    } catch (error) {
      console.error('Error generating song:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = (formData) => {
    let prompt = `Write a song using the following information. Use the provided lyrics for each part and build around them. Only print the lyrics. If using a repeated verse, just print the type of verse instead of printing it out again:\n\nTitle: ${formData.title}\nSubject: ${formData.subject}\nSounds Like: ${formData.soundsLike}\n\n`;
    Object.keys(selectedParts).forEach((part) => {
      if (selectedParts[part] && formData[part]) {
        prompt += `${part.charAt(0).toUpperCase() + part.slice(1)}: ${formData[part]}\n`;
      }
    });
    return prompt;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {!generatedSong && !loading ? (
        <motion.form
          onSubmit={page === 1 ? (e) => { e.preventDefault(); setPage(2); } : handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {page === 1 ? (
            <>
              <div>
                <label className="block text-lg font-semibold text-gray-800">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-800">Subject</label>
                <textarea
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-800">Sounds Like</label>
                <textarea
                  value={formData.soundsLike}
                  onChange={(e) => handleInputChange('soundsLike', e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <motion.button
                type="button"
                onClick={() => setPage(2)}
                className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Lyrics
                </motion.button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(selectedParts).map((part) => (
                    <div key={part} className="border-t border-gray-200 pt-4">
                      <label className="block text-lg font-semibold text-gray-800">
                        <input
                          type="checkbox"
                          checked={selectedParts[part]}
                          onChange={() => handleCheckboxChange(part)}
                          className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        {part.charAt(0).toUpperCase() + part.slice(1)}
                      </label>
                      {selectedParts[part] && (
                        <div className="mt-4">
                          <label className="block text-lg font-semibold text-gray-800">Text</label>
                          <textarea
                            value={formData[part]}
                            onChange={(e) => handleInputChange(part, e.target.value)}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Generate Song
                </motion.button>
              </>
            )}
          </motion.form>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        ) : (
          <motion.div
            className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DiagramCanvas formData={{ ...formData, generatedSong }} />
          </motion.div>
        )}
      </div>
    );
  };
  
  export default SongForm;