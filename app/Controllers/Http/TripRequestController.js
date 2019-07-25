'use strict'

const TripRequest = use('App/Models/TripRequest')
const TripSchedule = use('App/Models/TripSchedule')
const Enum = use('App/Utils/Enum')
const {validateAll} = use('Validator')
const Event = use('Event')

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

        // create a payload data
        let payload = {}

        // if trip request type is immediate
        if(trip_request_type == Enum.trip_types.IMMEDIATE.value){
            // add request to trip request table
            const createdTripRequest = await TripRequest.create({
                requester_user_id : user.id,
                creator_coordinates :JSON.stringify(request_data.coordinates)
            })

            payload = createdTripRequest

            // emit an event that begins the driver searching
            Event.fire('trip_request::find_driver', payload)
        }
        // if trip request type is schedule
        else  if(trip_request_type == Enum.trip_types.SCHEDULE.value){
            
            // run core validator for schedule request
            const validation = await validateAll(request_data,
                {
                    type:`required|in:${Enum.trip_types.SCHEDULE.value}`,
                    category:`required|in:${Enum.schedule_categories.ONE_OFF.value},${Enum.schedule_categories.DAILY.value},${Enum.schedule_categories.WEEKLY.value},${Enum.schedule_categories.MONTHLY.value}`,
                    start_date_time:`required|date_time_format`,
                },
                {
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

            payload = scheduleTrip
        }

        // in the response value 
        // if the trip type is immediate
        // use the payload id to subscribe to a channel

        return response.status(200).json({
            status:true,
            message:"Trip request created successfully",
            trip_type:request_data.type,
            payload: payload
        })
    }

    // note when a create request is cancelled by client
    // close events
    // close channel opened

    async accept({request, response,auth}){

        const request_data = request.all()
        const user = await auth.getUser()

        // check user role
        const user_role = await user.getRoles()

        if(user_role[0] != Enum.roles.DRIVER.value) return response.status(404).json({
            status:false,
            message:"No access permission to perform action"
        })

        
        const trip_request = await TripRequest.find(request_data.trip_request)

        // check if trip request is still pending
        if(trip_request.status != Enum.trip_status.PENDING.value) return response.status(400).json({
            status:false,
            message:"Trip cannot be accepted. Trip status does not allow acceptance"
        })

        // check that is not same user accepting the request
        if(trip_request.requester_user_id == user.id) return response.status(400).json({
            status:false,
            message:"Cannot Accept Trip Request Initiated By You"
        })

        // update the trip request table 
        trip_request.merge({
            accepter_user_id:user.id,
            status:Enum.trip_status.ACCEPTED.value
        })

        await trip_request.save()

        return response.status(200).json({
            status:true,
            message:"Request Accepted Successfully"
        })
    }
}

module.exports = TripRequestController
