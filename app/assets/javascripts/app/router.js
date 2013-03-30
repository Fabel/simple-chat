var Router = new function(){

  var parseEmitter = function(emitter){
    if(typeof emitter == 'string'){
      var names = emitter.split('#')
      return {controller: Camelize(names[0]), action: Camelize(names[1])}
    }
    return emitter
  }

  this.local = function(emitter, data){
    emitter = parseEmitter(emitter)
    this.processController({emitter: emitter, data: data})
  }

  this.processMessage = function(msg){
    // console.log(msg)
    if(msg.emitter){
      this.processController(msg)
    }
    if(msg.serverStartedAt)
      EJS.Storage.checkServerRestartDate(new Date(msg.serverStartedAt))
    if(msg.error)
      errorInApp(msg.error)
  }

  this.findController = function(name){
    return controllers[name+'Controller']
  }

  this.processController = function(msg){
    var emitter = msg.emitter
    var controller = this.findController(emitter.controller)
    var action = controller[emitter.action]
    if(action)
      action(msg, this.app)
    else
      console.log('In '+emitter.controller+' missing action '+ emitter.action)
  }
}

