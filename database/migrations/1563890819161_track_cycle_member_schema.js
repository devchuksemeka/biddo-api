'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrackCycleMemberSchema extends Schema {
  up () {
    this.create('track_cycle_members', (table) => {
      table.increments()
      table.string("track_cycle_code").notNullable()
      table.bigInteger("user_id").notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('track_cycle_members')
  }
}

module.exports = TrackCycleMemberSchema
