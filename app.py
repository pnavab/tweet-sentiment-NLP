# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pandas as pd
import uvicorn

app = FastAPI()

# This middleware is required in order to accept requests from other domains such as a React app running on 'localhost:3000'
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv('./sentiment140/training.1600000.processed.noemoticon.csv', 
                 names=['score', 'id', 'date', 'col4', 'author', 'tweet'])

# Load your trained model
model = MultinomialNB()
vectorizer = CountVectorizer()

# Assuming df is your DataFrame from which you trained the model
X_train_vectorized = vectorizer.fit_transform(df['tweet'])
y_train = df['score']
model.fit(X_train_vectorized, y_train)

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    prediction: int

@app.post("/predict_sentiment", response_model=SentimentResponse)
def predict_sentiment(request: SentimentRequest):
    text = request.text

    # Vectorize the input text
    text_vectorized = vectorizer.transform([text])

    # Make prediction
    prediction = model.predict(text_vectorized)[0]

    return {"prediction": prediction}

if __name__ == "__main__":
    uvicorn.run("app:app", port=8000, reload=True)