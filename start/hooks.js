const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {

    const Validator = use('Validator')
    const Database = use('Database')
    
    const existsFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        /**
         * skip validation if value is not defined. `required` rule
         * should take care of it.
        */
        return
      }
    
      const [table, column] = args
      const row = await Database.table(table).where(column, value).first()
    
      if (!row) {
        throw message
      }
    }

    const objectFormat = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        /**
         * skip validation if value is not defined. `required` rule
         * should take care of it.
        */
        return
      }

      //check if value is object
      if(!(value instanceof Object)) throw message
    }

    const objectContains = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        /**
         * skip validation if value is not defined. `required` rule
         * should take care of it.
        */
        return
      }
      
      valueKeys = Object.keys(value)
      // foreach of the args if not in value
      for(let i=0;i<args.length;i++){
        let objectItem = args[i]
        if(!valueKeys.includes(objectItem)) throw message
      }

    }
    
    Validator.extend('exists', existsFn)
    Validator.extend('objectFormat', objectFormat)
    Validator.extend('objectContains', objectContains)
    
})