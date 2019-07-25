'use strict'

const Enum  = use('enum')

let roles = new Enum({
    ADMIN: "admin",
    USER: "user",
    DRIVER: "driver",
});

let permissions = new Enum({
    CREATE_TRACK_REQUEST: "create_track_request", 
    ACCEPT_TRACK_REQUEST: "accept_track_request"
});

let trip_status = new Enum({
    PENDING: "pending",
    ENROUTE: "enroute",
    COMPLETED: "completed",
});

let trip_types = new Enum({
    IMMEDIATE: "immediate",
    SCHEDULE: "schedule",
});

let schedule_categories = new Enum({
    ONE_OFF: "one_off",
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
});

module.exports = {
    roles,
    permissions,
    trip_status,
    trip_types,
    schedule_categories,
};