'use strict'

const TrackRequest = use('App/Models/TrackRequest')

class TrackController {
  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.request = request
    this.auth = auth
    this.topic = this.socket.topic

    this.socket.emit("open","Connection Opened")
  }

  async getUser(){
    const user = await this.auth.getUser()
    return user
  }

  // async validateTopic(){

    // const app_pin = this.topic.split(":")[1]
    // console.log(app_pin)

    // // query the database table
    // // if app_pin found in track request and not ongoing cancel
    // const track_request = await TrackRequest.query()
    // .andWhere("creator_app_pin","=",app_pin)
    // .andWhere("progress_status","=","ongoing")
    // .first()

    // if track request if empty close all connection

  // }

  // create a function that checks if this user have right to update coordinate
  async updateCoordinate(coordinates){

    // get user
    const user = await this.getUser()

    // update track request table where user have an ongoing track request
    await TrackRequest.query()
    .where("creator_user_id","=",user.id)
    .andWhere("creator_app_pin","=",user.app_pin)
    .andWhere("progress_status","=","ongoing")
    .update({creator_coordinates:coordinates})
  }

   // create a function that checks if this user have right to update coordinate
   async canUpdateCoordinate(){

    // get user
    const user = await this.getUser()
    

    // update track request table where user have an ongoing track request
    const track_request = await TrackRequest.query()
    .where("creator_user_id","=",user.id)
    .andWhere("creator_app_pin","=",user.app_pin)
    .andWhere("progress_status","=","ongoing")
    .first()

    if(track_request) return true
    return false
  }


  async onCoordinate(coordinates){
    const canupdate = await this.canUpdateCoordinate()
    // check if user can update the coordiante
    if(canupdate) {
      // console.log("can Update")
      await this.updateCoordinate(coordinates)
      this.socket.broadcast('coordinate', coordinates)
    }
  }
  
  // async onMessage(message){
  //   this.socket.broadcastToAll("message", message)
  // }

  // onClose(){

  // }

}

module.exports = TrackController
