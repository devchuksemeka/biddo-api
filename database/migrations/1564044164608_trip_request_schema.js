'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TripRequestSchema extends Schema {
  up () {
    this.create('trip_requests', (table) => {
      table.increments()
      table.bigInteger("requester_user_id").notNullable()
      table.bigInteger("accepter_user_id")
      table.json("creator_coordinates").notNullable()
      table.json("enroute_coordinates")
      table.enum("status",["pending","enroute","completed"]).notNullable().defaultTo("pending")
      table.timestamp('enroute_starts_at').nullable().defaultTo(null)
      table.timestamp('enroute_ends_at').nullable().defaultTo(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('trip_requests')
  }
}

module.exports = TripRequestSchema
