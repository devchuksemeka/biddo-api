'use strict'

const TrackCycle = use('App/Models/TrackCycle')
const TrackCycleMember = use('App/Models/TrackCycleMember')
class TrackCycleController {

    async create({request, response, auth}){
        const request_data = request.all()
        const authUser = await auth.getUser();

        const trackCycleModel = new TrackCycle;

        const code = await trackCycleModel.getGeneratedCode()

        // add the track cycle 
        const track_cycle = await TrackCycle.create({
            code:code,
            name:request_data.name,
            description:request_data.description,
            creator:authUser.id
        })

        if(track_cycle) return response.status(201).json({
            status:true,
            message:"Track Cycle Created",
            payload:track_cycle
        });
    }

    async join({request,response,auth}){
        const request_data = request.all()

        // get the track cycle
        const track_cycle = await TrackCycle.findBy("code",request_data.code)

        // get user
        const user = await auth.getUser()

        // check if the user joining is not the creator of track cycle
        if(track_cycle.creator == user.id) return response.status(404).json({
            status:false,
            message:"Cannot request to join your own group"
        })

        // check if user is not already in group
        const user_in_track_cycle = await TrackCycleMember.query()
        .where("user_id","=",user.id)
        .andWhere("track_cycle_code","=",request_data.code)
        .first()

        if(user_in_track_cycle) return response.status(400).json({
            status:false,
            message:"Already Added to Cycle"
        })

        const memberJoined =await TrackCycleMember.create({
            track_cycle_code:request_data.code,
            user_id:user.id
        })

        return response.status(200).json({
            status:true,
            message:"Request to join cycle successful",
            payload:memberJoined
        })
    }

}

module.exports = TrackCycleController
