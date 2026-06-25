from fastapi import FastAPI
from pydantic import BaseModel
from load_data import load_songs
from match import find_best_match
from features import get_features
from recommend import get_recommendations

app = FastAPI()
df = load_songs()  # loads once at startup

class SongRequest(BaseModel):
    title: str
    artist: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommend")
def recommend(song: SongRequest):
    matched = find_best_match(song.title, song.artist, df)
    features, genre = get_features(matched)
    recs = get_recommendations(features, genre, df)
    return {
        "matched": matched is not None,
        "matched_song": matched["track_name"] if matched is not None else None,
        "recommendations": recs
    }