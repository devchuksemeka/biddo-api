'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const randomstring = use("randomstring");

class TrackCycle extends Model {
    

    async getGeneratedCode(){
        const code =  `${this.getGeneratedString()}${this.getGeneratedNumber()}`
        const track_cycle = await TrackCycle.findBy("code",code)
        console.log(code);
        if(track_cycle){
            console.log("in Track Cycle Exists")
            this.getGeneratedCode()
        }else{
            return code
        }
        
    }

    getGeneratedNumber(){
        return randomstring.generate({
            length: 3,
            charset: '123456789'
          });
    }

    getGeneratedString(){
        return randomstring.generate({
            length: 4,
            charset: 'alphabetic',
            capitalization:'uppercase'
          });
    }
}

module.exports = TrackCycle
