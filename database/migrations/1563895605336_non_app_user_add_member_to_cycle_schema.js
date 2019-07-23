'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NonAppUserAddMemberToCycleSchema extends Schema {
  up () {
    this.create('non_app_user_add_member_to_cycles', (table) => {
      table.increments()
      table.string("email").notNullable()
      table.string("track_cycle_code").notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('non_app_user_add_member_to_cycles')
  }
}

module.exports = NonAppUserAddMemberToCycleSchema
