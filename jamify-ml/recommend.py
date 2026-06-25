import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

def get_recommendations(current_features, current_genre, df, top_n=5):
    feature_cols = ["energy", "danceability", "valence", "tempo", "acousticness", "speechiness"]
    
    df = df.copy()
    df[feature_cols] = df[feature_cols].fillna(0.5)
    
    # Normalize features to same scale
    scaler = MinMaxScaler()
    song_vectors = scaler.fit_transform(df[feature_cols])
    current_vector = scaler.transform([[current_features.get(c, 0.5) for c in feature_cols]])
    
    scores = cosine_similarity(current_vector, song_vectors)[0]
    df["similarity"] = scores
    
    # Boost same-genre songs
    df["genre_boost"] = df["track_genre"].apply(
        lambda g: 0.15 if g == current_genre else 0.0
    )
    df["final_score"] = df["similarity"] + df["genre_boost"]
    
    top = (
        df.sort_values("final_score", ascending=False)
        .drop_duplicates(subset="track_name")
        .iloc[1:top_n+1]  # skip index 0 = the song itself
    )
    
    return top[["track_name", "artists", "final_score", "track_genre"]].to_dict(orient="records")