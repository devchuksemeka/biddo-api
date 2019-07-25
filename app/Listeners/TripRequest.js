'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Role = use('Role')
const Enum = use('App/Utils/Enum')

const TripRequest = exports = module.exports = {}

TripRequest.findDriver = async (params) => {

    const driver = await Role.findBy("slug",Enum.roles.DRIVER.value)

    // get all the driver users that are available
    const users = await Database.table('users').innerJoin('role_user', 'users.id', 'role_user.user_id')
                    .select("users.*").where("role_user.role_id","=",driver.id)
    
    // fire a broadcast to all drivers

     
    
    users.forEach(element => {
        console.log(element.id)
    });
}
