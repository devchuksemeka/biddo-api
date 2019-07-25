'use strict'

const TripRequest = use('App/Models/TripRequest')

class TripRequestController {
    
    async create({request, response,auth}){
        const request_data = request.all()
        // get the auth user
        const user = await auth.getUser();

        // check if user is verified
        if(user.verified_at) return response.status(401).json({
            status:false,
            message:"Account Not Verified"
        })

        // incomporate the payment flow in it.


        // add request to trip request table
        const createdTripRequest = await TripRequest.create({
            requester_user_id : user.id,
            creator_coordinates :JSON.stringify(request_data.coordinates)
        })


        // open a websocket event to the user waiting for drivers to accept request

        


        return response.status(200).json({
            status:true,
            message:"Trip request created successfully"
        })
    }
}

module.exports = TripRequestController
