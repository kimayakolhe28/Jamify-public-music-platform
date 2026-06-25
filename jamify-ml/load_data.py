import pandas as pd

def load_songs():
    df = pd.read_csv("data/spotify_tracks.csv")
    
    # Drop junk index columns
    df = df.drop(columns=["Unnamed: 0.1", "Unnamed: 0"], errors="ignore")
    
    # Drop rows missing the essentials
    df = df.dropna(subset=["track_name", "artists"])
    
    # Normalized key for fuzzy matching
    df["normalized_key"] = (
        df["track_name"].str.lower().str.strip() + "|" +
        df["artists"].str.lower().str.strip()
    )
    
    df = df.drop_duplicates(subset="normalized_key")
    
    return df