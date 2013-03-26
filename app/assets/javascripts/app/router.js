var Router = new function(){

  this.processMessage = function(msg){
    console.log(msg)
    if(msg.emitter){
      this.processController(msg)
    }
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
      console.log('In '+controller+' missing action '+ action)
  }
}

