'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrackRequestSchema extends Schema {
  up () {
    this.create('track_requests', (table) => {
      table.increments()
      table.string("creator_app_pin",254).notNullable()
      table.bigInteger("creator_user_id").notNullable()
      table.json("tracker_user_ids").nullable()
      table.json("creator_coordinates").notNullable()
      table.enum("progress_status",['ongoing','ended']).defaultTo('ongoing')
      table.timestamps()
    })
  }

  down () {
    this.drop('track_requests')
  }
}

module.exports = TrackRequestSchema
