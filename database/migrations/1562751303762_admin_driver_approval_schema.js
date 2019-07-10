'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Enum = use('App/Utils/Enum')

class AdminDriverApprovalSchema extends Schema {
  up () {
    this.create('admin_driver_approvals', (table) => {
      table.increments()
      table.bigInteger("admin_id").nullable()
      table.bigInteger("driver_id").notNullable()
      table.enum("approval_status",Enum.admin_driver_approval.enums).defaultTo(Enum.admin_driver_approval.PENDING.value)
      table.timestamps()
    })
  }

  down () {
    this.drop('admin_driver_approvals')
  }
}

module.exports = AdminDriverApprovalSchema
