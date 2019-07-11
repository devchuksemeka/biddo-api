'use strict'

class CreateTrackRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      coordinates:'required',
    }
  }

  get message(){
    return {
      'coordinates.required' : 'You must provide a coordinates.'
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = CreateTrackRequest
