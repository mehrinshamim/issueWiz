from sklearn.feature_extraction.text import TfidfVectorizer

domain_specific_words = [
    "segmentation fault", "stack trace", "null reference", "unhandled exception", 
    "memory leak", "timeout", "outofmemoryerror", "indexoutofbounds", "nullpointerexception", 
    "infinite loop", "crash", "syntax error", "compilation error", "segfault", 
    "recursion limit exceeded", "error handling", "permission denied", "missing dependency", 
    "file not found", "corrupted data", "api endpoint", "api response", "database query", 
    "query failure", "database timeout", "connection refused", "missing parameter", "invalid input", 
    "incorrect return type", "response code 500", "response code 400", "response code 404", 
    "authentication failure", "authorization issue", "cors error", "api rate limit exceeded", 
    "rate limiting", "request timeout", "missing environment variable", "version mismatch", 
    "dependency conflict", "deprecated api", "incompatible version", "module not found", 
    "package not installed", "outdated package", "peer dependency warning", "build failure", 
    "performance bottleneck", "high cpu usage", "high memory usage", "slow response", "latency", 
    "throughput", "optimization", "thread deadlock", "database lock", "environment variable missing", 
    "incorrect configuration", "docker build failure", "ci/cd failure", "server misconfiguration", 
    "file permission issue", "cross-platform compatibility", "bug reproducible", "steps to reproduce", 
    "expected behavior", "unexpected behavior", "edge case", "unit test failing", "integration test failing", 
    "test coverage issue", "boundary condition", "race condition", "merge conflict", "git pull failed", 
    "git push error", "branch mismatch", "commit issue", "rebase conflict", "staging error", "cherry-pick error", 
    ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c", ".h", ".rb", ".html", ".css", ".scss", 
    ".less", ".php", ".go", ".swift", ".tsv", ".csv", ".json", ".xml", ".yml", ".yaml", ".sql", ".md", 
    ".dockerfile", ".sh", ".bat", ".ini", ".conf", ".env"
]

def extract_keywords_with_tfidf(text, top_n=20):
    
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    
    
    X = vectorizer.fit_transform([text])
    
    
    tfidf_scores = dict(zip(vectorizer.get_feature_names_out(), X.toarray()[0]))

    
    sorted_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)

    
    final_keywords = []
    
    
    for kw, score in sorted_keywords:
        if kw in domain_specific_words:
            final_keywords.append(kw)

    
    for kw, score in sorted_keywords:
        if kw not in final_keywords and len(final_keywords) < top_n:
            final_keywords.append(kw)
    
    
    return final_keywords[:top_n]
