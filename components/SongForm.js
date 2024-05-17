import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import DiagramCanvas from './DiagramCanvas';
import PartModal from './PartModal';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPart, setCurrentPart] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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
      setIsFormSubmitted(true); // Set form submission state to true
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
        prompt += `${part.charAt(0).toUpperCase() + part.slice(1)}: ${formData[part]}\n\n`;
      }
    });
    return prompt;
  };

  return (
    <div className="container mx-auto p-4">
      {isFormSubmitted ? (
        <DiagramCanvas formData={{ ...formData, generatedSong }} />
      ) : (
        <form onSubmit={handleSubmit}>
        {page === 1 && (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
        Title
      </label>
      <input
        id="title"
        type="text"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
        Subject
      </label>
      <textarea
        id="subject"
        value={formData.subject}
        onChange={(e) => handleInputChange('subject', e.target.value)}
        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="soundsLike">
        Sounds Like
      </label>
      <textarea
        id="soundsLike"
        value={formData.soundsLike}
        onChange={(e) => handleInputChange('soundsLike', e.target.value)}
        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setPage(2)}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Lyrics
      </button>
    </div>
  </>
)}
            {page === 2 && (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Select Parts
      </label>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(selectedParts).map((part, index) => {
          const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];
          return (
            <div key={part} className={`mb-2 p-4 rounded-lg shadow-md ${colors[index % colors.length]}`}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedParts[part]}
                  onChange={() => handleCheckboxChange(part)}
                  className="form-checkbox"
                />
                <span className="ml-2">{part.charAt(0).toUpperCase() + part.slice(1)}</span>
              </label>
              {selectedParts[part] && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPart(part);
                    setModalIsOpen(true);
                  }}
                  className="ml-4 py-1 px-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit {part.charAt(0).toUpperCase() + part.slice(1)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
    <div className="mb-4">
  <button
    type="submit"
    className="w-full py-3 px-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold text-lg rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2"
  >
    Generate Song
  </button>
</div>
  </>
)}
            </form>
          )}
          {loading && (
            <div className="flex justify-center items-center">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          )}
          <PartModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            part={currentPart}
            value={formData[currentPart]}
            onChange={handleInputChange}
          />
        </div>
      );
    };
 
    export default SongForm;
