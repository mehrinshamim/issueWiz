import requests
from typing import List, Dict
import json
from nlp.keyword_extractor import keyword_extractor
def match_keywords_with_filenames(keywords: List[str], filtered_files: List[Dict]) -> List[Dict]:
    match_results = []
    for file in filtered_files:
        file_name = file["name"].lower()
        match_score = sum(1 for keyword in keywords if keyword.lower() in file_name)
        
        if match_score > 0:
            match_results.append({
                "file_name": file["name"],
                "match_score": match_score,
                "download_url": file["download_url"]
            })

        # Stop once 3 matches are found
        if len(match_results) >= 3:
            break

    return sorted(match_results, key=lambda x: x["match_score"], reverse=True)

def match_keywords_with_file_content(keywords: List[str], filtered_files: List[Dict]) -> List[Dict]:
    match_results = []
    for file in filtered_files:
        try:
            response = requests.get(file["download_url"])
            if response.status_code == 200:
                file_content = response.text.lower()
                match_score = sum(1 for keyword in keywords if keyword.lower() in file_content)
                
                if match_score > 0:
                    match_results.append({
                        "file_name": file["name"],
                        "match_score": match_score,
                        "download_url": file["download_url"]
                    })

                # Stop once 3 matches are found
                if len(match_results) >= 3:
                    break
        except Exception as e:
            print(f"Error fetching file content for {file['name']}: {e}")
            match_results.append({
                "file_name": file["name"],
                "match_score": 0,
                "error": str(e)
            })

    return sorted(match_results, key=lambda x: x["match_score"], reverse=True)

def keyword_matcher(json_input: Dict, keywords: List[str]) -> str:
    filtered_files = json_input.get("filteredFiles", [])

    # Match with filenames
    filename_matches = match_keywords_with_filenames(keywords, filtered_files)

    # Match with file content
    content_matches = match_keywords_with_file_content(keywords, filtered_files)

    result = {
        "filename_matches": filename_matches,
        "content_matches": content_matches
    }

    output = {
        "filename_matches": [match for match in result["filename_matches"] if match["match_score"] > 0],
        "content_matches": [match for match in result["content_matches"] if match["match_score"] > 0]
    }

    return json.dumps(output, indent=4)
