import requests, json, cgi, ProcessInquiry
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer


# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

    #Handle task 2 requests
    def do_POST(self):
        print("in post")
        self.data_string = self.rfile.read(int(self.headers['Content-Length'])).decode("utf-8")
        jsonQuery = json.loads(self.data_string)
        print("sending query")
        #Call the processing app
        res = ProcessInquiry.process_inquiery(jsonQuery)
        self.send_response(200)
        self.end_headers()
        # print("here data string:" + self.data_string + "**ended")
        # print("here res string:" + res + "**ended")
        self.wfile.write(bytes(res, 'UTF-8'))
        print("done")
        return

def run():
  print('starting server...')

  # Server settings
  # server_address = ('127.0.0.1', 8081)
  server_address = ('', 8081)
  httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
  print('running server...')
  httpd.serve_forever()

if __name__ == '__main__':
    run()
