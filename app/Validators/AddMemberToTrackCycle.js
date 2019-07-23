'use strict'

class AddMemberToTrackCycle {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email:'required|email',
      code:'required|exists:track_cycles,code',
    }
  }

  get messages(){
    return {
      'code.required' : 'You must provide a track cycle code',
      'code.exists' : 'Invalid Track cycle code supplied',
      'email.required' : 'You must provide a member email',
      'email.email' : 'You must provide a valid email',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = AddMemberToTrackCycle
