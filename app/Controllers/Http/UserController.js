'use strict'

const User = use('App/Models/User');
const {validateAll} = use('Validator');

const Database = use('Database')
const Role = use('Role')
const UserProfile = use('App/Models/UserProfile')
const Hash = use('Hash')
const TrackCycleMember = use('App/Models/TrackCycleMember')
const NonAppUserAddMemberToCycle = use('App/Models/NonAppUserAddMemberToCycle')

const Enum = use('App/Utils/Enum')

const Mail = use('Mail')

class UserController {
    async register({ request, response, auth }){

    const user_model = new User();

    // start a db transaction
    const trx = await Database.beginTransaction() // begin transaction

    // create user 
    const user = await User.create(request.only(['email','password']),trx);

    // update user and set the app_pin for user
    // await User.find(user.id)
    user.app_pin = `BIDDO${user.id}`
    await user.save(trx);

    const request_data =request.post();

    const role_selected = request_data.role
    // const role_selected = request_data.role
    // check if selected role is valid
    const role = await Role.findBy("slug",role_selected);
    if(!role) return response.status(400).json({
        status:false,
        message:"Invalid role selected"
    })

    /// create a user profile for user
    const profile = await UserProfile.create({
      name:`${request_data.first_name} ${request_data.last_name}`,
      phone:request_data.phone,
      user_id:user.id,
    },trx)

    // attach user to role
    user.roles().attach([role.id]);

    // check if track cycle code is supplied
    if(request_data.code){
        // check if member already in track cycle
        const user_in_track_cycle = await TrackCycleMember.query()
            .where("user_id","=",user.id)
            .andWhere("track_cycle_code","=",request_data.code)
            .first()

        // if user has not been added to cycle
        if(!user_in_track_cycle) {
            // add member to group
            const memberAdded = await TrackCycleMember.create({
                track_cycle_code : request_data.code,
                user_id : user.id
            },trx)

            // check if member has been invited prior before
            const non_app_user_add_member = await NonAppUserAddMemberToCycle.query()
                .where("email","=",request_data.email)
                .andWhere("track_cycle_code","=",request_data.code)
                .first()

            // if yes : remove invite request
            if(non_app_user_add_member) {
                await non_app_user_add_member.delete(trx)
            }

        }
    }else{
        // check if member has been invited prior before
        const non_app_user_add_member = await NonAppUserAddMemberToCycle.query()
            .where("email","=",request_data.email)
            .fetch()
        
        const sizeLenght = non_app_user_add_member.rows.length;

            
        // for each of the invitation add member to track cycle and delete invitation
        for(let i=0; i < sizeLenght;i++){
            // add member to group
            const memberAdded = await TrackCycleMember.create({
                track_cycle_code : non_app_user_add_member[i].track_cycle_code,
                user_id : user.id
            },trx)

            //finally delete non_app_user_add_member request

            const non_app = await NonAppUserAddMemberToCycle.find(non_app_user_add_member[i].id)

            await non_app.delete(trx)
        }
            
    }


        // const token = // generate a base64 of the email
        const token = Buffer.from(user.email).toString('base64')

        // send account verification email
        Mail.send('emails.account.verification', {
        user: user.toJSON(),
        activate_url:`http://localhost:3333/api/v1/auth/verify/${token}`,
        socials:{
            facebook:'#',
            instagram:'#',
            pinterest:'#',
            youtube:'#',
            twitter:'#',
        }
        }, (message) => {
        message
            .subject('Biddo Account Email Verification')
            .replyTo('noreply@biddo.ng')
            .to(user.email)
        })

        trx.commit()// commit transaction

        // return user

        return response.status(201).json({
            status:true,
            message:'Account created successful',
            payload:user
        });
    }

    async changePassword({request, response, auth}){
        
        const request_data = request.all()

        let user = await auth.getUser()

        const validation = await validateAll(request_data,{
            current_password:'required',
            password:'required|confirmed',
        },{
            'current_password.required':'You must provide your current password',
            'password.required':'You must provide your new password',
            'password.confirmed':'Your password confirmation does not match',
        })

        if(validation.fails()) return response.status(400).json({
            status:false,
            message:"Invalid request parameter supplied",
            errors:validation.messages()
        })

        // current password == pass fail
        if(request_data.password.trim() === request_data.current_password.trim()) return response.status(400).json({
            status:false,
            message:"New Password must be different from current password"
        })

        // check if current_password == the user password
        const isSame = await Hash.verify(request_data.current_password.trim(), user.password)

        if(!isSame) return response.status(400).json({
            status:false,
            message:"Invalid Password supplied"
        })

        

        user.password = request_data.password.trim()

        user.save()

        return response.status(400).json({
            status:true,
            message:"Password updated successfully"
        })


    }

    async login({ request, response, auth }){

        const request_data = request.all();
        const user = await User.findBy("email",request_data.email)

        if(!user) return response.status(400).json({
            status:false,
            message:"Invalid email or password"
        })

        const verifyPassword = await Hash.verify(request_data.password, user.password)

        // verify if password is valid
        if(!verifyPassword) return response.status(400).json({
            status:false,
            message:"Invalid email or password"
        })

        const profile = await user.profile().first()

        // check if account has been verified
        if(!profile.verified_at) return response.status(400).json({
            status:false,
            message:"Account has not been verified"
        })  


        try{
            const jwt = await auth.generate(user);
        
            return response.status(200).json({ 
                status:true,
                token:jwt.token,
                user:user
             });
        }catch(error){
            return response.status(400).json({ status:false,error:'Something went wrong '+error });
        }
    }

    async getUser({ request, response, auth }){
        try {
            return response.json(await auth.getUser())
            // await auth.getUser()
        } catch (error) {
            response.send('Missing or invalid jwt token')
        }
    }
}

module.exports = UserController
