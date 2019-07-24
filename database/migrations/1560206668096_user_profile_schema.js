'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserProfileSchema extends Schema {
  up () {
    this.create('user_profiles', (table) => {
      table.increments()
      table.bigInteger('user_id').notNullable().unique()
      table.string('image_path', 250).nullable()
      table.string('phone', 200).unique()
      table.string('referral_code', 200)
      table.string('name', 250)
      table.timestamp('verified_at').nullable().defaultTo(null)
      table.text('address')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_profiles')
  }
}

module.exports = UserProfileSchema
