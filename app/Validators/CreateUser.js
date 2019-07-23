'use strict'

const Enum = use('App/Utils/Enum')

class CreateUser {
  get validateAll () {
    return true
  }

  get sanitizationRules () {
    return {
      email: 'normalize_email',
    }
  }

  get rules () {
    return {
      email:'required|email|unique:users',
      password:'required',
      phone:'required|unique:user_profiles',
      name: 'required',
      code:'exists:track_cycles,code'
    }
  }

  get messages(){
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',


      'password.required': 'You must provide a password',

      'phone.required': 'You must provide a password',
      'phone.unique': 'This phone is already registered.',

      'name.required': 'You must provide a password',

      'role.required': 'You must provide a role',
      'role.in': 'Invalid option User Role selected',


      'code.exists': 'Invalid track cycle code supplied',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = CreateUser
