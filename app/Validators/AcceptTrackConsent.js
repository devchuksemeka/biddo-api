'use strict'

class AcceptTrackConsent {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      track_request_id:'required|exists:track_requests,id',
      tracker_user_id:'required|exists:users,id',
    }
  }

  get messages(){
    return {
      'track_request_id.required' : 'You must provide a the Request to be tracked.',
      'track_request_id.exists' : 'Invalid Track Request supplied.',
      'tracker_user_id.required' : 'You must provide a the tracker user.',
      'tracker_user_id.exists' : 'Invalid tracker user entered.'
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = AcceptTrackConsent
