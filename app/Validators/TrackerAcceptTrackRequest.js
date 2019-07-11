'use strict'

class TrackerAcceptTrackRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      request_pin:'required|exists:users,app_pin',
    }
  }

  get messages(){
    return {
      'request_pin.required' : 'You must provide a the App to be tracked.',
      'request_pin.exists' : 'Invalid App Pin Supplied.',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = TrackerAcceptTrackRequest
