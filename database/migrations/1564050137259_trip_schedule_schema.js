'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

const Enum = use('App/Utils/Enum')

class TripScheduleSchema extends Schema {
  up () {
    this.create('trip_schedules', (table) => {
      table.increments()
      table.bigInteger("requester_user_id").notNullable()
      table.enum("category",[
        Enum.schedule_categories.ONE_OFF.value,
        Enum.schedule_categories.DAILY.value,
        Enum.schedule_categories.WEEKLY.value,
        Enum.schedule_categories.MONTHLY.value
      ])
      .notNullable()
      table.json("creator_coordinates").notNullable()
      table.timestamp('start_at').nullable().default(null)
      table.timestamps()
    })
  }

  down () {
    this.drop('trip_schedules')
  }
}

module.exports = TripScheduleSchema
