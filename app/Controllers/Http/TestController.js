'use strict'
const Enum = use('App/Utils/Enum')

class TestController {
    async testEnum(){
        const roles = Enum.roles.enums

        // const role = {name:'Admin',description:'Admin Role',slug:'admin'}
        // await Role.create(role)
        for(let i=0;i<roles.length;i++){
          console.log({name:roles[i].key,slug:roles[i].value,description:roles[i].key})
        }
        return Enum.roles.enums
    }
}

module.exports = TestController
