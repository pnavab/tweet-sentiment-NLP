// App.js
import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [inputText, setInputText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [color, setColor] = useState("grey")

  const analyzeSentiment = async () => {
    try {
      const response = await axios.post('http://localhost:8000/predict_sentiment', { text: inputText });
      console.log(response);
      const prediction = response.data.prediction;
      setSentiment(prediction);
      if( prediction == 0){
        setColor("#B03537");
      }
      else if( prediction == 2){
        setColor("#B03537");
      }
      else{
        setColor("#22B352");
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };



  return (
    <div style={{ textAlign: 'center', marginTop: '20vh', color: color}}>
      <h1>Sentiment Analysis App</h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text for sentiment analysis"
        style={{ width: '80%', padding: '8px', marginBottom: '10px' }}
      />
      <hr style={{border: "none"}}></hr>
      <button onClick={analyzeSentiment} style={{color: color, width: "200px", height: "50px", border: "none", borderRadius: "100px", padding: '8px', cursor: 'pointer' }}>
        <b>Analyze Sentiment</b>
      </button>
      {sentiment !== null && (
        <div style={{ marginTop: '10px' }}>
          <p>Sentiment: {sentiment}</p>
        </div>
      )}
    </div>
  );
};

export default App;
