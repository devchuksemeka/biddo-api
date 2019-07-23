'use strict'

class CreateTrackCycle {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name:'required'
    }
  }

  get messages(){
    return {
      'name.required' : 'You must provide a track cycle name'
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = CreateTrackCycle
