import handleError from './handleError.js'

class Exception {
    constructor(status, message) {
        this._status = status || '500'
        this._message = message || 'SERVER_ERROR'
        this._error = {
            status: this._status,
            message: this._message
        }
    }

    handle(...payload) {
        handleError(this._error, ...payload);
        return null; // treated by get-a-quote/index.js -- (await validateFormData(request, response) === null)
    }
}

export default Exception;