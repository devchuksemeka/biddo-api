'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/User');

const Database = use('Database')
const Role = use('Role')
const UserProfile = use('App/Models/UserProfile')
const Enum = use('App/Utils/Enum')

class UserSeeder {
  async run () {
    let date = new Date();

    // start a db transaction
    const trx = await Database.beginTransaction() // begin transaction

    // create user 
    const user = await User.create({
      email:'admin@biddo.ng',
      password:'secret'
    },trx);

    // update user and set the app_pin for user
    // await User.find(user.id)
    user.app_pin = `BIDDO${user.id}`
    await user.save(trx);

    

    /// create a user profile for user
    await UserProfile.create({
      name:"Chuks Emeka",
      phone:"07016694767",
      user_id:user.id,
      verified_at:date.toJSON().substring(0,19).replace('T',' '),
    },trx)

    const role = await Role.findBy("slug",Enum.roles.ADMIN.value);
    // attach user to role
    user.roles().attach([role.id]);

    trx.commit()// commit transaction
  }
}

module.exports = UserSeeder
