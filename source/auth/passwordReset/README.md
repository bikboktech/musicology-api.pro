# Reset Password Flow

POST: passwordReset/index.js
    - body: {email: string}
    - **response**: RAW token (string)

POST: passwordReset/request.js
    - body: {email: string}
    - query: {token: string}
    - **response**: 204 (No Content: Email sent)