
import spacy
from spacy.matcher import PhraseMatcher

nlp = spacy.load("en_core_web_sm")


domain_specific_keywords = [
    "Segmentation Fault", "Stack Trace", "Null Reference", "Unhandled Exception", "Assertion Failure",
    "Memory Leak", "Timeout", "OutOfMemoryError", "IndexOutOfBounds", "NullPointerException", 
    "Infinite Loop", "Crash", "Syntax Error", "Compilation Error", "Segfault", "Recursion Limit Exceeded",
    "Error Handling", "Permission Denied", "Missing Dependency", "File Not Found", "Corrupted Data",
    "API Endpoint", "API Response", "Database Query", "Query Failure", "Database Timeout", "Connection Refused", 
    "Missing Parameter", "Invalid Input", "Incorrect Return Type", "Response Code 500", "Response Code 400", 
    "Response Code 404", "Authentication Failure", "Authorization Issue", "CORS Error", "API Rate Limit Exceeded", 
    "Rate Limiting", "Request Timeout", "Missing Environment Variable", "Version Mismatch", "Dependency Conflict", 
    "Deprecated API", "Incompatible Version", "Module Not Found", "Package Not Installed", "Outdated Package", 
    "Peer Dependency Warning", "Build Failure", "Performance Bottleneck", "High CPU Usage", "High Memory Usage", 
    "Slow Response", "Latency", "Throughput", "Optimization", "Thread Deadlock", "Database Lock", 
    "Environment Variable Missing", "Incorrect Configuration", "Docker Build Failure", "CI/CD Failure", 
    "Server Misconfiguration", "File Permission Issue", "Cross-Platform Compatibility", "Bug Reproducible", 
    "Steps to Reproduce", "Expected Behavior", "Unexpected Behavior", "null pointer","Edge Case", "Unit Test Failing", 
    "Integration Test Failing", "Test Coverage Issue", "Boundary Condition", "Race Condition", "Merge Conflict", 
    "Git Pull Failed", "Git Push Error", "Branch Mismatch", "Commit Issue", "Rebase Conflict", "Staging Error", 
    "Cherry-pick Error", ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c", ".h", ".rb", ".html", 
    ".css", ".scss", ".less", ".php", ".go", ".swift", ".tsv", ".csv", ".json", ".xml", ".yml", ".yaml", 
    ".sql", ".md", ".dockerfile", ".sh", ".bat", ".ini", ".conf", ".env"
]

def extract_keywords_with_spacy(text, top_n=50):
   
    doc = nlp(text)
    
    # Extract named entities
    entities = [ent.text.lower() for ent in doc.ents if len(ent.text) > 2]
    
    # If no entities, fallback to noun chunks
    if not entities:
        noun_chunks = [chunk.text.lower() for chunk in doc.noun_chunks if len(chunk.text) > 2]
        entities = list(set(noun_chunks))[:top_n]  # Remove duplicates and return top_n
    
    # Merge only domain-specific keywords that appear in the text
    relevant_keywords = [keyword.lower() for keyword in domain_specific_keywords if keyword.lower() in text.lower()]
    
    # Priority: Add domain-specific keywords first (higher importance)
    combined_keywords = relevant_keywords + [keyword for keyword in entities if keyword not in relevant_keywords]
    
    # Remove duplicates by converting to a set, then back to a list
    combined_keywords = list(set(combined_keywords))
    
    # Sort and return top_n keywords
    return combined_keywords[:top_n]


