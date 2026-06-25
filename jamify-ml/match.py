from rapidfuzz import fuzz, process

def find_best_match(title, artist, df, threshold=70):
    query = f"{title.lower().strip()}|{artist.lower().strip()}"
    choices = df["normalized_key"].tolist()
    
    result = process.extractOne(query, choices, scorer=fuzz.token_sort_ratio)
    
    if result and result[1] >= threshold:
        matched_key = result[0]
        row = df[df["normalized_key"] == matched_key].iloc[0]
        return row
    
    return None  # fallback triggers in features.py