'use strict'

const TrackCycle = use('App/Models/TrackCycle')
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
}

module.exports = TrackCycleController
