'use strict'

class LoginUser {
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
      email:'required|email',
      password:'required',
    }
  }

  get message(){
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      // 'email.in': 'This email does not match any on our system.',

      'password.required': 'You must provide a password',
    }
  }

  async fails(error) {
    return this.ctx.response.status(400).json({status:false,errors: error})
  }
}

module.exports = LoginUser
