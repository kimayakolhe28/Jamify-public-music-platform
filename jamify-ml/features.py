DEFAULT_FEATURES = {
    "energy": 0.5, "danceability": 0.5, "valence": 0.5,
    "tempo": 120.0, "acousticness": 0.5, "speechiness": 0.1
}
DEFAULT_GENRE = "pop"

def get_features(matched_row):
    if matched_row is None:
        return DEFAULT_FEATURES, DEFAULT_GENRE
    return {
        "energy": float(matched_row["energy"]),
        "danceability": float(matched_row["danceability"]),
        "valence": float(matched_row["valence"]),
        "tempo": float(matched_row["tempo"]),
        "acousticness": float(matched_row["acousticness"]),
        "speechiness": float(matched_row["speechiness"]),
    }, str(matched_row["track_genre"])