from nlp.models.spacy_ner import extract_keywords_with_spacy
from nlp.models.keybert_model import extract_keywords_with_keybert
from nlp.models.tfidf import extract_keywords_with_tfidf


def keyword_extractor(text, top_n=20):
    #Extract keywords using SpaCy
    spacy_keywords = extract_keywords_with_spacy(text, top_n=top_n)
    #Extract keywords using KeyBERT
    try:
        keybert_keywords = extract_keywords_with_keybert(text, top_n=top_n)
    except Exception as e:
        print(f"KeyBERT extraction failed: {e}")
        keybert_keywords = []  # Fallback to an empty list or handle as needed
    
    #Extract keywords using TF-IDF
    tfidf_keywords = extract_keywords_with_tfidf(text, top_n=top_n)
    
    # Combine results from all three models
    combined_keywords = set(spacy_keywords + keybert_keywords + tfidf_keywords)
    
    # Return the final list of keywords
    return list(combined_keywords)[:top_n]

# Example usage:

