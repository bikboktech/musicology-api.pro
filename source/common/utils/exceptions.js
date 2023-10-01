class Exception {
    constructor(status, message) {
        this._status = status || '500'
        this._message = message || 'SERVER_ERROR'
        this._error = {
            status: this._status,
            message: this._message
        }
    }

    handle(request, response) {
        console.error(this._error);
        response.status(this._status).send(this._message);
        return null;
    }
}

export default Exception;