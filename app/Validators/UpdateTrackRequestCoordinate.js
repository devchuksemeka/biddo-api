'use strict'

class UpdateTrackRequestCoordinate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      app_pin:'required|exists:users,app_pin',
      coordinates:'required|object_format|object_contains:latitude,longitude',
    }
  }

  get messages(){
    return {
      'app_pin.required' : 'You must provide your APP PIN.',
      'app_pin.exists' : 'Invalid APP PIN supplied.',
      'coordinates.required' : 'You must provide a coordinates.',
      'coordinates.object_format' : 'Coordinates must be in object format.',
      'coordinates.object_contains' : 'Coordinates must contain latitude and longitude.',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = UpdateTrackRequestCoordinate
