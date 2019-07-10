'use strict'

/*
|--------------------------------------------------------------------------
| RolesAndPermissionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Enum = use('App/Utils/Enum')
const Role = use('Role')
const Permission = use('Permission')


class RolesAndPermissionSeeder {
  async run () {
   
    const roles = Enum.roles.enums
    for(let i=0;i<roles.length;i++){
      await Role.create({
        name:roles[i].key,
        slug:roles[i].value,
        description:roles[i].key
      })
    }

    let adminRole = await Role.findBy('slug',Enum.roles.ADMIN.value);
    let userRole = await Role.findBy('slug',Enum.roles.USER.value);

    const permissions = Enum.permissions.enums

    for(let i=0;i<permissions.length;i++){
      await Permission.create({
        name:permissions[i].key,
        slug:permissions[i].value,
        description:permissions[i].key
      })
    }

    // permissions
    const create_request = await Permission.findBy('slug',Enum.permissions.CREATE_TRACK_REQUEST.value)
    const accept_request = await Permission.findBy('slug',Enum.permissions.ACCEPT_TRACK_REQUEST.value)

    // //assign permissions to roles
    await userRole.permissions().attach([
      create_request.id,
      accept_request.id,
    ])

  
    

  }
}

module.exports = RolesAndPermissionSeeder
