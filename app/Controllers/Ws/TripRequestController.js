'use strict'

class TripRequestController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  // system uses this to broadcast request to drivers
  onRequest(){

  }
}

module.exports = TripRequestController
