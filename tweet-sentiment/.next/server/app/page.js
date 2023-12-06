// SentimentAnalysis.js
import React, { useState } from 'react';
import axios from 'axios';

const SentimentAnalysis = () => {
  const [inputText, setInputText] = useState('');
  const [sentiment, setSentiment] = useState(null);

  const analyzeSentiment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict_sentiment', { text: inputText });
      const prediction = response.data.prediction;
      setSentiment(prediction);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  return (
    <div>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text for sentiment analysis"
      />
      <button onClick={analyzeSentiment}>Analyze Sentiment</button>
      {sentiment !== null && (
        <div>
          <p>Sentiment: {sentiment}</p>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
pi 