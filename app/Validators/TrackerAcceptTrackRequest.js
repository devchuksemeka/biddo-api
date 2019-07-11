'use strict'

class TrackerAcceptTrackRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      request_pin:'required',
    }
  }

  get message(){
    return {
      'request_pin.required' : 'You must provide a the App to be tracked.',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = TrackerAcceptTrackRequest
