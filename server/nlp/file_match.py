import requests
from typing import List, Dict
import json
from keyword_extractor import keyword_extractor
def match_keywords_with_filenames(keywords: List[str], filtered_files: List[Dict]) -> List[Dict]:
    
    match_results = []

    for file in filtered_files:
        file_name = file["name"].lower()
        match_score = sum(1 for keyword in keywords if keyword.lower() in file_name)
        
        match_results.append({
            "file_name": file["name"],
            "match_score": match_score,
            "download_url": file["download_url"]
        })

    return sorted(match_results, key=lambda x: x["match_score"], reverse=True)

def match_keywords_with_file_content(keywords: List[str], filtered_files: List[Dict]) -> List[Dict]:
   
    match_results = []

    for file in filtered_files:
        try:
            response = requests.get(file["download_url"])
            if response.status_code == 200:
                file_content = response.text.lower()
                match_score = sum(1 for keyword in keywords if keyword.lower() in file_content)
                
                match_results.append({
                    "file_name": file["name"],
                    "match_score": match_score,
                    "download_url": file["download_url"]
                })
        except Exception as e:
            print(f"Error fetching file content for {file['name']}: {e}")
            match_results.append({
                "file_name": file["name"],
                "match_score": 0,
                "error": str(e)
            })

    return sorted(match_results, key=lambda x: x["match_score"], reverse=True)

def keyword_matcher(json_input: Dict, keywords: List[str]) -> Dict[str, List[Dict]]:
    
    filtered_files = json_input.get("filteredFiles", [])

    # Match with filenames
    filename_matches = match_keywords_with_filenames(keywords, filtered_files)

    # Match with file content
    content_matches = match_keywords_with_file_content(keywords, filtered_files)

    result= {
        "filename_matches": filename_matches,
        "content_matches": content_matches
    }

    output = {
    "filename_matches": [match for match in result["filename_matches"] if match["match_score"] > 0],
    "content_matches": [match for match in result["content_matches"] if match["match_score"] > 0]
        }

    return json.dumps(output,indent=4)

# Example usage

input_json = {
"owner": "Udayraj123",
"repo": "OMRChecker",
"filteredFiles": [
{
    "name": "FUNDING.yml",
    "path": ".github/FUNDING.yml",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/.github/FUNDING.yml"
},
{
    "name": "pre-commit.yml",
    "path": ".github/pre-commit.yml",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/.github/pre-commit.yml"
},
{
    "name": ".pre-commit-config.yaml",
    "path": ".pre-commit-config.yaml",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/.pre-commit-config.yaml"
},
{
    "name": "main.py",
    "path": "main.py",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/main.py"
},
{
    "name": "evaluation.json",
    "path": "samples/answer-key/using-csv/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/answer-key/using-csv/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/answer-key/using-csv/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/answer-key/using-csv/template.json"
},
{
    "name": "evaluation.json",
    "path": "samples/answer-key/weighted-answers/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/answer-key/weighted-answers/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/answer-key/weighted-answers/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/answer-key/weighted-answers/template.json"
},
{
    "name": "template.json",
    "path": "samples/community/Antibodyy/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/Antibodyy/template.json"
},
{
    "name": "template.json",
    "path": "samples/community/Sandeep-1507/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/Sandeep-1507/template.json"
},
{
    "name": "template.json",
    "path": "samples/community/Shamanth/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/Shamanth/template.json"
},
{
    "name": "config.json",
    "path": "samples/community/UPSC-mock/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/UPSC-mock/config.json"
},
{
    "name": "evaluation.json",
    "path": "samples/community/UPSC-mock/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/UPSC-mock/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/community/UPSC-mock/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/UPSC-mock/template.json"
},
{
    "name": "config.json",
    "path": "samples/community/UmarFarootAPS/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/UmarFarootAPS/config.json"
},
{
    "name": "evaluation.json",
    "path": "samples/community/UmarFarootAPS/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/UmarFarootAPS/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/community/UmarFarootAPS/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/UmarFarootAPS/template.json"
},
{
    "name": "template.json",
    "path": "samples/community/dxuian/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/dxuian/template.json"
},
{
    "name": "template.json",
    "path": "samples/community/ibrahimkilic/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/ibrahimkilic/template.json"
},
{
    "name": "template.json",
    "path": "samples/community/samuelIkoli/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/community/samuelIkoli/template.json"
},
{
    "name": "config.json",
    "path": "samples/sample1/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample1/config.json"
},
{
    "name": "template.json",
    "path": "samples/sample1/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample1/template.json"
},
{
    "name": "config.json",
    "path": "samples/sample2/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample2/config.json"
},
{
    "name": "template.json",
    "path": "samples/sample2/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample2/template.json"
},
{
    "name": "template.json",
    "path": "samples/sample3/colored-thick-sheet/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample3/colored-thick-sheet/template.json"
},
{
    "name": "config.json",
    "path": "samples/sample3/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample3/config.json"
},
{
    "name": "template.json",
    "path": "samples/sample3/xeroxed-thin-sheet/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample3/xeroxed-thin-sheet/template.json"
},
{
    "name": "config.json",
    "path": "samples/sample4/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample4/config.json"
},
{
    "name": "evaluation.json",
    "path": "samples/sample4/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample4/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/sample4/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample4/template.json"
},
{
    "name": "config.json",
    "path": "samples/sample5/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample5/config.json"
},
{
    "name": "evaluation.json",
    "path": "samples/sample5/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample5/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/sample5/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample5/template.json"
},
{
    "name": "config.json",
    "path": "samples/sample6/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample6/config.json"
},
{
    "name": "template.json",
    "path": "samples/sample6/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample6/template.json"
},
{
    "name": "template_fb_align.json",
    "path": "samples/sample6/template_fb_align.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample6/template_fb_align.json"
},
{
    "name": "template_no_fb_align.json",
    "path": "samples/sample6/template_no_fb_align.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample6/template_no_fb_align.json"
},
{
    "name": "config.json",
    "path": "samples/sample7/config.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample7/config.json"
},
{
    "name": "evaluation.json",
    "path": "samples/sample7/evaluation.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample7/evaluation.json"
},
{
    "name": "template.json",
    "path": "samples/sample7/template.json",
    "download_url": "https://raw.githubusercontent.com/Udayraj123/OMRChecker/master/samples/sample7/template.json"
}
],
"issueDetails":{
    "title": "[Feature] Support for providing custom field types/Q_TYPES in template.json",
  "description": "Is your feature request related to a problem? Please describe.\nCurrently we need to change the code in the constants.py file and modify BUILTIN_FIELD_TYPES to support any kind of custom field types in a custom OMR sheet. This needs to be handled via template.json instead.\n\nDescribe the solution you'd like\nIntroduce a key customFieldTypes that automatically gets merged with BUILTIN_FIELD_TYPES and is available to use in the fieldBlocks. This eliminates the need for changing the BUILTIN_FIELD_TYPES.\n\nDescribe alternatives you've considered\nNA\n\nAdditional context\nNA",
  "labels": ["enhancement"]
}
}


issue_details=input_json["issueDetails"]
text=f"{issue_details['title']}{issue_details['description']}"
extracted_keywords=keyword_extractor(text)

print(keyword_matcher(input_json, extracted_keywords))



