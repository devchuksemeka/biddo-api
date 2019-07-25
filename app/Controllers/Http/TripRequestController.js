'use strict'

const TripRequest = use('App/Models/TripRequest')
const TripSchedule = use('App/Models/TripSchedule')
const Enum = use('App/Utils/Enum')
const ScheduleTripValidator = use('App/Validators/ScheduleTrip')
const {validateAll} = use('Validator')

class TripRequestController {

    async create({request, response,auth}){

        const request_data = request.all()

        // get the auth user
        const user = await auth.getUser();

        // check if user is verified
        const profile = await user.profile().first()
        if(!profile.verified_at) return response.status(401).json({
            status:false,
            message:"Account Not Verified"
        })

        // incomporate the payment flow in it.


        // get the trip request type
        const trip_request_type = request_data.type

        // if trip request type is immediate

        if(trip_request_type == Enum.trip_types.IMMEDIATE.value){
            // add request to trip request table
            const createdTripRequest = await TripRequest.create({
                requester_user_id : user.id,
                creator_coordinates :JSON.stringify(request_data.coordinates)
            })
        }else  if(trip_request_type == Enum.trip_types.SCHEDULE.value){

            const scheduleValidator = new ScheduleTripValidator()
            
            // run core validator for schedule request
            const validation = await validateAll(request_data,{
                type:`required|in:${Enum.trip_types.SCHEDULE.value}`,
                category:`required|in:${Enum.schedule_categories.ONE_OFF.value},${Enum.schedule_categories.DAILY.value},${Enum.schedule_categories.WEEKLY.value},${Enum.schedule_categories.MONTHLY.value}`,
                start_date_time:`required|date_time_format`,
              },{
                'type.required' : 'You must provide trip request type.',
                'type.in' : 'Invalid Trip request option selected.', 
                

                'category.required' : 'You must provide category of your schedule trip.',
                'category.in' : 'You must provide a valid trip schedule category option.',

                'start_date_time.required' : 'You must provide a start date time for your scheduled trip.',
                'start_date_time.date_time_format' : 'Invalid trip schedule date format supplied.',
              });

            if(validation.fails()) return response.status(400).json({
                status:false,
                errors: validation.messages()
            })

            // add request to schedule table
            const scheduleTrip = await TripSchedule.create({
                requester_user_id : user.id,
                creator_coordinates :JSON.stringify(request_data.coordinates),
                category : request_data.category,
                start_at:request_data.start_date_time
            })
        }        


        // open a websocket event to the user waiting for drivers to accept request

        


        return response.status(200).json({
            status:true,
            message:"Trip request created successfully"
        })
    }
}

module.exports = TripRequestController
