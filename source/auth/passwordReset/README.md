# Reset Password Flow

POST: passwordReset/index.js
    - body: {email: string}
    - **response**: RAW token

POST: passwordReset/request.js
    - body: {email: string}
    - query: {}
    - **response**: RAW token