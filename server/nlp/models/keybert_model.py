
from keybert import KeyBERT
kw_model = KeyBERT()

def extract_keywords_with_keybert(text, top_n=20):
    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 2),  # Consider unigrams and bigrams
        stop_words='english',           # Remove common English stopwords
        top_n=top_n,                    # Number of top keywords to extract
        use_maxsum=True,                # Enforces diversity in keywords
        nr_candidates=20,               # Number of candidate phrases for diversity enforcement
    )

    # Return a list of the extracted keywords (without the scores)
    return [kw[0] for kw in keywords]

