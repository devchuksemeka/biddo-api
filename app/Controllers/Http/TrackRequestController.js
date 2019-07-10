'use strict'

const User = use('App/Models/User')
const TrackRequest = use('App/Models/TrackRequest')

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

    async acceptTrack({request,response,auth}){
        //

    }
    async acceptTrackConsent({request,response,auth}){

    }


}

module.exports = TrackRequestController
