'use strict'

const TrackCycle = use('App/Models/TrackCycle')
const TrackCycleMember = use('App/Models/TrackCycleMember')
const NonAppUserAddMemberToCycle = use('App/Models/NonAppUserAddMemberToCycle')
const User = use('App/Models/User')


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

    async addMember({request, response, auth}){
        const request_data = request.all()

        // get user
        const user = await auth.getUser()

        // get track cycle
        const track_cycle = await TrackCycle.findBy("code",request_data.code)

        // check if person adding member is the creator of track_cycle
        if(user.id != track_cycle.creator) return response.status(404).json({
            status:false,
            message:"Cannot add member to group not created by you"
        })


        // check if member to be added is an already existing member
        const member_to_add = await User.findBy("email",request_data.email)

        // if member already exist: add member to group
        if(member_to_add){
            
            // check if member has not been added to group before
            const user_in_track_cycle = await TrackCycleMember.query()
                .where("user_id","=",member_to_add.id)
                .andWhere("track_cycle_code","=",request_data.code)
                .first()

            // if member already exists flag error
            if(user_in_track_cycle) return response.status(400).json({
                status:false,
                message:"Already Track Cycle Member"
            })

            // add member to group
            const memberJoined = await TrackCycleMember.create({
                track_cycle_code : request_data.code,
                user_id : member_to_add.id
            })

            /** send email of been added to a new group
            *   
            * Action TODO
            */

    
            return response.status(200).json({
                status:true,
                message:"Member Added To Group",
                payload:memberJoined
            })

        }

        // check if user person has not been requested to be added to group before
        const non_app_user_add_member = await NonAppUserAddMemberToCycle.query()
            .where("email","=",request_data.email)
            .andWhere("track_cycle_code","=",request_data.code)
            .first()

        // if member already in records halt flow with success status
        if(non_app_user_add_member) return response.status(200).json({
            status:true,
            message:"Member already requested to be added to group"
        })

        // add non application member to a non_app_user_add_member_to_cycles
        const non_app_user = await NonAppUserAddMemberToCycle.create({
            email:request_data.email,
            track_cycle_code:request_data.code
        })

        // send email to member after been added

        return response.status(200).json({
            status:true,
            message:"Member requested to be added to group"
        })


        
    }

}

module.exports = TrackCycleController
