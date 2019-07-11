'use strict'

const User = use('App/Models/User')
const TrackRequest = use('App/Models/TrackRequest')
const Database = use('Database')
const TrackerAcceptRequest = use('App/Models/TrackerAcceptRequest')

class TrackRequestController {

    async create({request,response,auth}){

        const request_data = request.all()


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
            creator_coordinates:JSON.stringify(request_data.coordinates),
            tracker_user_ids:JSON.stringify([])
        })

        // send email notification to all trackers

        return response.status(201).json({
            status:true,
            message:"Track request sent successfully"
        })
    }

    async accept({request,response,auth}){

        // add validator

         // get the user making request
         const request_data = request.all();
         const tracker_user = await auth.getUser()


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

        // check if such accept track request has not been created before

        // add to tracker accept request table
        await TrackerAcceptRequest.create({
            track_request_id:track_request.id,
            tracker_user_id:tracker_user.id
        })

        // send notification to the track request creator to accept or reject
        
        return response.status(200).json({
            status:true,
            message:"Track requested accepted"
        })
 

    }

    async acceptTrackConsent({request,response,auth}){

        const request_data = request.all()

        // get the track request id
        // get tracker user id
        const creator_user = await auth.getUser()

        

        const track_request = await TrackRequest.find(request_data.track_request_id)

        // check if the app accepting the consent is the app creator
        if(creator_user.app_pin != track_request.creator_app_pin) return response.status(401).json({
            status:false,
            message:"You cannot accept track consent, Unauthorize action"
        })

        
        const tracker_user_ids = JSON.parse(track_request.tracker_user_ids);

        // check if the tracker_user_id exist in tracker user ids
        if(tracker_user_ids.includes(request_data.tracker_user_id)) return response.status(400).json({
            status: false,
            message: "Tracker user already accepted",
        })


        // check if request is still on
        if(track_request.progress_status !== "ongoing") return response.status(400).json({
            status: false,
            message: "Track request already end",
        })
        
        const tracker_accept_request = await TrackerAcceptRequest.query()
        .where("track_request_id","=",request_data.track_request_id)
        .andWhere("tracker_user_id","=",request_data.tracker_user_id)
        .first()

        // check if track accept request exist
        if(!tracker_accept_request) return response.status(400).json({
            status: false,
            message: "Track accept request not found",
        })

        // check if creator approval status is pending
        if(tracker_accept_request.creator_approval_status !== "pending") return response.status(400).json({
            status: false,
            message: "Track accept request have already been processed",
        })

        // push to the tracker user id with the new user id
        tracker_user_ids.push(request_data.tracker_user_id)
        
        // place this process in database transaction process
        const trx = await Database.beginTransaction()


        // accept it and update the track request table with the tracker user id
        track_request.tracker_user_ids =  JSON.stringify(tracker_user_ids)

        await track_request.save(trx)


        // delete the record from the tracker accept request
        await tracker_accept_request.delete(trx)

        trx.commit()

        return response.status(200).json({
            status:true,
            message:"Accept Track Request Consent"
        })
    }


}

module.exports = TrackRequestController
