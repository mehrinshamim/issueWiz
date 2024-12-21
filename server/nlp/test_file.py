import unittest
import json
# Assuming keyword_extractor and keyword_matcher are defined in a module named 'omr_checker'
from keyword_extractor import keyword_extractor
from file_match import keyword_matcher

class TestKeywordExtractionAndMatching(unittest.TestCase):

    def setUp(self):
        # Sample input JSON for testing
              self.input_json = {
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
    }
  ],
  "issueDetails": {
    "description": "*Is your feature request related to a problem? Please describe.Currently we need to change the code in the constants.py file and modify BUILTIN_FIELD_TYPES to support any kind of custom field types in a custom OMR sheet. This needs to be handled via template.json instead.\r\n\r\n\r\nDescribe the solution you'd like\r\nIntroduce a key customFieldTypes that automatically gets merged with BUILTIN_FIELD_TYPES and is available to use in the fieldBlocks. This eliminates the need for changing the BUILTIN_FIELD_TYPES.\r\n\r\nDescribe alternatives you've considered\r\nNA\r\n\r\nAdditional context*\r\nNA\r\n",
    "labels": ["enhancement"],
    "title": "[Feature] Support for providing custom field types/Q_TYPES in template.json"
  }

}

    def test_keyword_extractor(self):
        # Extract keywords from the issue details
        issue_details = self.input_json["issueDetails"]
        text = f"{issue_details['title']} {issue_details['description']}"
        extracted_keywords = keyword_extractor(text)

        # Assert that extracted keywords are not empty
        self.assertTrue(len(extracted_keywords) > 0, "No keywords extracted.")

    def test_keyword_matcher(self):
        # Extract keywords
        issue_details = self.input_json["issueDetails"]
        text = f"{issue_details['title']} {issue_details['description']}"
        extracted_keywords = keyword_extractor(text)

        # Test the keyword matcher function
        match_result = keyword_matcher(self.input_json, extracted_keywords)

        if isinstance(match_result,str):
             match_result=json.loads(match_result)
        # Assert that the match result is as expected (modify based on expected output)
        self.assertIsInstance(match_result, dict, "Expected match result to be a dictionary.")
        # Add more assertions based on expected behavior of keyword_matcher

if __name__ == '__main__':
    unittest.main()