'use strict'

const Enum = use('App/Utils/Enum')

class CreateTripRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      coordinates:'required|object_format|object_contains:latitude,longitude',
      type:`required|in:${Enum.trip_types.IMMEDIATE.value},${Enum.trip_types.SCHEDULE.value}`,
      category:`in:${Enum.schedule_categories.ONE_OFF.value},${Enum.schedule_categories.DAILY.value},${Enum.schedule_categories.WEEKLY.value},${Enum.schedule_categories.MONTHLY.value}`,
      start_date_time:`date_time_format`,
    }
  }

  get messages(){
    return {
      'coordinates.required' : 'You must provide a coordinates.',
      'coordinates.object_format' : 'Coordinates must be in object format.',
      'coordinates.object_contains' : 'Coordinates must contain latitude and longitude.',

      'type.required' : 'You must provide trip request type.',
      'type.in' : 'Invalid Trip request option selected.', 
      
      'category.in' : 'You must provide a valid trip schedule category option.',
      
      'start_date_time.date_time_format' : 'Invalid trip schedule date format supplied.',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = CreateTripRequest
