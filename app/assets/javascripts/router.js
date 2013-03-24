var Router = new function(){

  /*controller objects
    example  { ChatController: Chat,
               ArticleController: Article }
  */
  this.controllers = {ChatController: ChatController}

  this.processMessage = function(msg){
    if(msg.emitter){
      this.processController(msg)
    }
    if(msg.error)
      errorInApp(msg.error)
  }

  this.findController = function(name){
    return this.controllers[name+'Controller']
  }

  this.processController = function(msg){
    var emitter = msg.emitter
    var controller = this.findController(emitter.controller)
    var action = controller[emitter.action]
    if(action)
      action(msg, this.app)
  }
}

