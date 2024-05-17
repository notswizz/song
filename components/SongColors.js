import React from 'react';

const SongColors = ({ formData }) => {
  const usedParts = Object.keys(formData).filter(part => formData[part].text && formData[part].color);

  return (
    <div className="p-4 mb-4 bg-gray-100 rounded shadow-md flex space-x-4">
      {usedParts.map((part) => (
        <div key={part} className="flex items-center space-x-2">
          <span className="w-4 h-4" style={{ backgroundColor: formData[part].color }}></span>
          <span className="text-lg">{part.charAt(0).toUpperCase() + part.slice(1)}</span>
        </div>
      ))}
    </div>
  );
};

export default SongColors;