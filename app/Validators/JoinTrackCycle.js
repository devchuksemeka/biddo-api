'use strict'

class JoinTrackCycle {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      code:'required|exists:track_cycles,code'
    }
  }

  get messages(){
    return {
      'code.required' : 'You must provide a track cycle code',
      'code.exists' : 'Invalid Track cycle code supplied'
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = JoinTrackCycle
