'use strict'

class CreateTrackRequest {
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
      role:`required|in:${Enum.roles.USER.value}`
    }
  }

  get message(){
    return {
      'email.required': 'You must provide a email address.',
      'password.required': 'You must provide a password',
      'phone.required': 'You must provide a password',
      'name.required': 'You must provide a password',
      'role.required': 'You must provide a role',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = CreateTrackRequest
