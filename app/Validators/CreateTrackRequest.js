'use strict'

class CreateTrackRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      coordinates:'required|object_format|object_contains:latitude,longitude',
      // coordinates:'required|object|contain:latitude,longitude',
    }
  }

  get messages(){
    return {
      'coordinates.required' : 'You must provide a coordinates.',
      'coordinates.object_format' : 'Coordinates must be in object format.',
      'coordinates.object_contains' : 'Coordinates must contain latitude and longitude.',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = CreateTrackRequest
