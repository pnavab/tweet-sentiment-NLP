// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [inputText, setInputText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [color, setColor] = useState("grey");
  const [last5Entries, setLast5Entries] = useState();

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

  async function submit(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      analyzeSentiment(inputText);
    }
  }

  useEffect(() => {
    async function getLast5Entries() {
      try {
        const response = await fetch('http://localhost:8000/get_last_5');
        const data = await response.json();
        setLast5Entries(data);
      } catch (error) {
        console.error('Error fetching last 5 entries:', error);
      }
    }

    getLast5Entries();
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh', color: color}}>
      <h1>Sentiment Analysis App</h1>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown= {(e) => submit(e)}
        placeholder="Enter text for sentiment analysis"
        style={{resize: 'none', width: '60%', padding: '8px', marginBottom: '10px'}}
      />
      <hr style={{border: "none"}}></hr>
      <button onKeyDown={e => e.key === 'Enter' ? analyzeSentiment: ''} 
        onClick={analyzeSentiment} 
        style={{color: color, width: "200px", height: "50px", border: "none", borderRadius: "100px", padding: '8px', cursor: 'pointer' }}>
        <b>Analyze Sentiment</b>
      </button>
      {sentiment !== null && (
        <div style={{ marginTop: '10px' }}>
          <p>Sentiment: {sentiment}</p>
        </div>
      )}
      {last5Entries && (
        <div style={{ marginTop: '20px' }}>
          <h2>Last 5 Entries</h2>
          <ul>
            {last5Entries.map((entry, index) => (
              <li key={index}>
                <p>Score: {entry.score}, Tweet: {entry.tweet}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
