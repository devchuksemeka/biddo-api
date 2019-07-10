'use strict'

const User = use('App/Models/User')
const TrackRequest = use('App/Models/TrackRequest')
const TrackerAcceptRequest = use('App/Models/TrackerAcceptRequest')

class TrackRequestController {

    async create({request,response,auth}){

        // get the user making request
        const user = await auth.getUser()
        const profile = await user.profile().first()

        if(!user.app_pin) return response.status(400).json({
            status:false,
            message:"Invalid App PIN"
        })

        if(!profile.verified_at) return response.status(400).json({
            status:false,
            message:"Account has not been verified"
        })

        // create a track me request record
        const request_create = await TrackRequest.create({
            creator_app_pin:user.app_pin,
            creator_user_id:user.id,
            creator_coordinates:JSON.stringify({
                latitude:3.223334343,
                longitude:6.223334343,
            }),

        })

        // send email notification to all trackers

        return response.status(201).json({
            status:true,
            message:"Track request sent successfully"
        })
    }

    async accept({request,response,auth}){
         // get the user making request
         const request_data = request.all();
         const tracker_user = await auth.getUser()
         const profile = await tracker_user.profile().first()

        //  return request_data.request_pin

        // check if request creator is not same with tracker_id
        const track_request = await TrackRequest.query()
        .where('creator_app_pin', '=', request_data.request_pin)
        .andWhere("progress_status","=","ongoing")
        .first()

        // check if a request is ongoin
        if(!track_request) return response.status(400).json({
            status:false,
            message:"Track request not found"
        })

        // check if request creator is not same as tracker usr
        if(tracker_user.id === track_request.creator_user_id ) return response.status(400).json({
            status:false,
            message:"You cannot accept your track request"
        })

        // add to tracker accept request table
        const addTrackerAcceptRequest = await TrackerAcceptRequest.create({
            track_request_id:track_request.id,
            tracker_user_id:tracker_user.id
        })

        // send notification to the track request creator to accept or reject
        
        return response.status(200).json({
            status:true,
            message:"Track requested accepted"
        })
 

    }
    async acceptConsent({request,response,auth}){

    }


}

module.exports = TrackRequestController
