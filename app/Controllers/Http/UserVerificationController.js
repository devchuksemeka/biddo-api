'use strict'

const User = use('App/Models/User')
const UserProfile = use('App/Models/UserProfile')
class UserVerificationController {

    async verifyAccountEmail({params,response}){

        const email = Buffer.from(params.token, 'base64').toString('ascii')
        let user = await User.findBy('email', email)
        let date = new Date();
        
        if(user){
            let profile = await UserProfile.findBy('user_id',user.id);
            if(!profile.verified_at){
                profile.verified_at = date.toJSON().substring(0,19).replace('T',' ')
                await profile.save();
                // proceed account activation
                return response.status(200).json({
                    status:true,
                    message:'Account verified successful'
                })
            }
           
        }

        return response.status(400).json({
            status:false,
            error:'Invalid token'
        })
    }
}

module.exports = UserVerificationController
