'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserProfile extends Model {
    // static boot () {
    //     super.boot()
    
    //     /**
    //      * create a unique account number.
    //      */
    //     this.addHook('beforeCreate', 'UserProfileHook.createAccountNumber')
    //   }

    user(){
        return this.belongsTo('App/Models/User','user_id','id')
    }
}

module.exports = UserProfile
