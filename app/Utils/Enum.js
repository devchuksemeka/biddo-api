'use strict'

const Enum  = use('enum')

let roles = new Enum({
    ADMIN: "admin", 
    DRIVER: "driver", 
    CUSTOMER: "customer"
});

let permissions = new Enum({
    CREATE_REQUEST: "create_request", 
    ACCEPT_REQUEST: "accept_request"
});
let admin_driver_approval = new Enum({
    PENDING: "pending", 
    APPROVED: "approved",
    DISAPPROVED: "disapproved",
});

module.exports = {
    roles,
    permissions,
    admin_driver_approval
};