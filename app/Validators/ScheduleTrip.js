'use strict'

class ScheduleTrip {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      type:`required|in:${Enum.trip_types.SCHEDULE.value}`,
      category:`required|in:${Enum.schedule_categories.ONE_OFF.value},${Enum.schedule_categories.DAILY.value},${Enum.schedule_categories.WEEKLY.value},${Enum.schedule_categories.MONTHLY.value}`,
      start_date_time:`required|date_time_format`,
    }
  }

  get messages(){
    return {
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

module.exports = ScheduleTrip
