'use strict'

class AcceptTrackConsent {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      track_request_id:'required',
      tracker_user_id:'required',
    }
  }

  get message(){
    return {
      'track_request_id.required' : 'You must provide a the Request to be tracked.',
      'tracker_user_id.required' : 'You must provide a the tracker user.'
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = AcceptTrackConsent
