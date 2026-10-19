import re
from rapidfuzz import fuzz, process

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\(.*?\)|\[.*?\]', '', text)
    text = re.sub(r'(?i)\b(official music video|official video|music video|lyric video|video song|full song|lyrics|audio|hd|4k|vevo)\b', '', text)
    return text.strip()

def find_best_match(title, artist, df, threshold=70):
    # 1. Direct raw match
    raw_query = f"{title.lower().strip()}|{artist.lower().strip()}"
    choices = df["normalized_key"].tolist()
    result = process.extractOne(raw_query, choices, scorer=fuzz.token_sort_ratio)
    if result and result[1] >= threshold:
        matched_key = result[0]
        row = df[df["normalized_key"] == matched_key].iloc[0]
        return row, result[1]

    # 2. Cleaned title and artist parsing
    c_title = clean_text(title)
    c_artist = clean_text(artist)

    candidates = []
    if " - " in c_title:
        parts = c_title.split(" - ", 1)
        # Format: Artist - Track or Track - Artist
        candidates.append(f"{parts[1].strip().lower()}|{parts[0].strip().lower()}")
        candidates.append(f"{parts[0].strip().lower()}|{parts[1].strip().lower()}")
    if c_title or c_artist:
        candidates.append(f"{c_title.lower()}|{c_artist.lower()}")

    for cand in candidates:
        res = process.extractOne(cand, choices, scorer=fuzz.token_sort_ratio)
        if res and res[1] >= threshold:
            row = df[df["normalized_key"] == res[0]].iloc[0]
            return row, res[1]

    # 3. Fallback: Title-only matching against track_name
    track_choices = df["track_name"].str.lower().str.strip().tolist()
    search_titles = [c_title.lower()]
    if " - " in c_title:
        parts = c_title.split(" - ", 1)
        search_titles.append(parts[1].strip().lower())

    for st in search_titles:
        if not st:
            continue
        title_res = process.extractOne(st, track_choices, scorer=fuzz.token_sort_ratio)
        if title_res and title_res[1] >= 75:
            row = df[df["track_name"].str.lower().str.strip() == title_res[0]].iloc[0]
            return row, title_res[1]

    return None, 0