'use strict'

class AcceptTripRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      trip_request:'required|exists:trip_requests,id',
    }
  }

  get messages(){
    return {
      'trip_request.required' : 'You must provide a Trip Request.',
      'trip_request.exists' : 'Invalid Trip Request supplied.',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = AcceptTripRequest
