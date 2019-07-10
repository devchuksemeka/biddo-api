'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrackerAcceptRequestSchema extends Schema {
  up () {
    this.create('tracker_accept_requests', (table) => {
      table.increments()
      table.bigInteger("track_request_id").notNullable()
      table.bigInteger("tracker_user_id").notNullable()
      table.enum("creator_approval_status",["reject","accept","pending"]).defaultTo("pending")
      table.timestamps()
    })
  }

  down () {
    this.drop('tracker_accept_requests')
  }
}

module.exports = TrackerAcceptRequestSchema
