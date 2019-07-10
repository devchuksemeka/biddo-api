'use strict'

const User = use('App/Models/User');

const { validateAll } = use('Validator')
const Database = use('Database')
const Role = use('Role')
const UserProfile = use('App/Models/UserProfile')
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
    user.app_pin = `BIDDO-${user.id}`
    await user.save(trx);

    const request_data =request.post();

    const role_selected = request_data.role
    // check if selected role is valid
    const role = await Role.findBy("slug",role_selected);
    if(!role) return response.status(400).json({
        status:false,
        message:"Invalid role selected"
    })

    /// create a user profile for user
    const profile = await UserProfile.create({
      name:request_data.name,
      phone:request_data.phone,
      user_id:user.id,
    },trx)

    // attach user to role
    user.roles().attach([role.id]);


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

    async login({ request, response, auth }){

        const {email, password} = request.all();
        
        try{
            const user = await auth.withRefreshToken().attempt(email,password);
            return response.status(200).json({ token:user.token });
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
