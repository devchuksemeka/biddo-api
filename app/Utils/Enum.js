'use strict'

const Enum  = use('enum')

let roles = new Enum({
    ADMIN: "admin", 
    USER: "user"
});

let permissions = new Enum({
    CREATE_TRACK_REQUEST: "create_track_request", 
    ACCEPT_TRACK_REQUEST: "accept_track_request"
});


module.exports = {
    roles,
    permissions
};