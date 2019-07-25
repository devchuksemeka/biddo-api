'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Enum = use('App/Utils/Enum')
class TripRequestSchema extends Schema {
  up () {
    this.create('trip_requests', (table) => {
      table.increments()
      table.bigInteger("requester_user_id").notNullable()
      table.bigInteger("accepter_user_id")
      table.json("creator_coordinates").notNullable()
      table.json("enroute_coordinates")
      table.enum("status",[Enum.trip_status.PENDING.value,Enum.trip_status.ENROUTE.value,Enum.trip_status.COMPLETED.value])
        .notNullable().defaultTo(Enum.trip_status.PENDING.value)
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
