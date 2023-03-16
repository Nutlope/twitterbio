from http.server import BaseHTTPRequestHandler
### CRFM MODEL FILE ###
import getpass
import json

from helm.common.authentication import Authentication
from helm.common.perspective_api_request import PerspectiveAPIRequest, PerspectiveAPIRequestResult
from helm.common.request import Request, RequestResult
from helm.common.tokenization_request import TokenizationRequest, TokenizationRequestResult
from helm.proxy.accounts import Account
from helm.proxy.services.remote_service import RemoteService

# An example of how to use the request API.
api_key = getpass.getpass(prompt="Enter a valid API key: ")
auth = Authentication(api_key=api_key)
while (not auth):
  api_key = getpass.getpass(prompt="Enter a valid API key: ")
  auth = Authentication(api_key=api_key)
service = RemoteService("https://crfm-models.stanford.edu")

class handler(BaseHTTPRequestHandler): 
  def do_POST(self):
    self.send_response(200)
    self.send_header('Content-type', 'text/plain')
    self.end_headers()
    prompt_beginning = """You are a medical coder. You must identify all correct ICD-10 codes in the clinical note and cite the exact phrase from the note that corresponds with each code.
                          Return your answer in this format: {Code 1: Phrase 1; Code 2: Phrase 2; Code 3: Phrase 3 """
    request = Request(model="openai/text-davinci-003", 
                      prompt=prompt_beginning + "\n" + "\n" + json.loads(self.rfile.read(int(self.headers.get('Content-Length'))))["clinicalNote"])
    request_result: RequestResult = service.make_request(auth, request)
    self.wfile.write(request_result.completions[0].text.encode())
    return ""