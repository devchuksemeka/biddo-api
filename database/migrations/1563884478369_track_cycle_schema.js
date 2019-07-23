'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrackCycleSchema extends Schema {
  up () {
    this.create('track_cycles', (table) => {
      table.increments()
      table.string("code").notNullable().unique()
      table.string("name").notNullable()
      table.text("description").nullable().defaultTo("No Description Supplied")
      table.bigInteger("creator").notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('track_cycles')
  }
}

module.exports = TrackCycleSchema
