import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import styles from '@/styles/Home.module.css';

const DiagramCanvas = ({ formData }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f5f5dc', // Set the background color to cream
      selection: true,
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject) {
          fabricCanvasRef.current.remove(activeObject);
        }
      }
    };

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      fabricCanvasRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (formData) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.setBackgroundColor('#f5f5dc', fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));

      let yOffset = 50;

      const addText = (text, options) => {
        const textbox = new fabric.Textbox(text, options);
        fabricCanvasRef.current.add(textbox);
      };

      // Add song title, subject, and sounds like
      if (formData.title) {
        addText(formData.title, { left: 400, top: yOffset, width: 500, fontSize: 30, fill: 'black', fontWeight: 'bold', textAlign: 'center', originX: 'center' });
        yOffset += 50;
      }
      if (formData.subject) {
        addText(formData.subject, { left: 400, top: yOffset, width: 500, fontSize: 14, fill: 'black', textAlign: 'center', originX: 'center' });
        yOffset += 30;
      }
      if (formData.soundsLike) {
        addText(`Sounds Like: ${formData.soundsLike}`, { left: 500, top: yOffset, width: 700, fontSize: 13, fill: 'black', textAlign: 'center', originX: 'center' });
        yOffset += 50;
      }

      // Add generated song
      if (formData.generatedSong) {
        addText(formData.generatedSong, { left: 50, top: yOffset, width: 500, fontSize: 20, fill: 'black' });
      }
    }
  }, [formData]);

  const startOver = () => {
    window.location.reload();
  };

  return (
    <div className={styles.canvasContainer}>
      <div className="relative overflow-y-auto" style={{ height: '600px', border: '2px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <canvas ref={canvasRef} width={800} height={1200} />
      </div>
      <div>
        <button className={styles.button} onClick={startOver}>Start Over</button>
      </div>
    </div>
  );
};

export default DiagramCanvas;