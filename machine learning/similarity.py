import pandas as pd
import numpy as np
import faiss
from sklearn.preprocessing import StandardScaler

# Load the dataset
df = pd.read_csv("total_songs.csv")

# Relevant features for similarity
feature_cols = [
    'danceability', 'energy', 'key', 'loudness', 'mode',
    'speechiness', 'acousticness', 'instrumentalness',
    'liveness', 'valence', 'tempo'
]

# Drop missing values
df = df.dropna(subset=feature_cols)

# Store metadata to return later
metadata = df[['track_id', 'track_name', 'artists', 'track_genre']].reset_index(drop=True)

# Normalize feature values with StandardScaler
scaler = StandardScaler()
X = df[feature_cols].values.astype('float32')
X_scaled = scaler.fit_transform(X)

# Normalize vectors to unit length for cosine similarity
X_norm = X_scaled / np.linalg.norm(X_scaled, axis=1, keepdims=True)

# FAISS index for cosine similarity using inner product on normalized vectors
index = faiss.IndexFlatIP(X_norm.shape[1])
index.add(X_norm)

# Mapping track name to index for search
name_to_index = {
    str(name).lower(): i for i, name in enumerate(df['track_name']) if pd.notnull(name)
}
def find_similar_songs(song_name, top_n=5):
    idx = name_to_index.get(song_name.lower())
    if idx is None:
        print("❌ Song not found!")
        return None

    query_vec = X_norm[idx].reshape(1, -1)
    distances, indices = index.search(query_vec, top_n + 50)  # Get extra to filter more

    similar = df.iloc[indices[0]].copy()  # include first (itself)

    # Exclude all songs that have the query name anywhere in the track_name (case-insensitive)
    similar = similar[~similar['track_name'].str.lower().str.contains(song_name.lower())]

    # Drop duplicates by track_name (keep highest popularity)
    similar = similar.drop_duplicates(subset='track_name')

    # Sort by popularity descending
    similar = similar.sort_values(by='popularity', ascending=False)

    return similar[['track_id', 'track_name', 'artists', 'track_genre', 'popularity']].head(top_n).reset_index(drop=True)

# Example usage
result = find_similar_songs("Despacito")
print(result)
