'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')



/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')



class User extends Model {

  static get hidden () {
    // return ['password']
  }
  static get visible () {
    // return ['password']
  }

  // static get 
  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  profile(){
    return this.hasOne('App/Models/UserProfile','id','user_id')
  }

  account(){
    return this.belongsTo('App/Models/UserAccount')
  }

  // role (role_name) {
  //   return this.hasOne('App/Models/Profile')
  // }
  
}

module.exports = User
