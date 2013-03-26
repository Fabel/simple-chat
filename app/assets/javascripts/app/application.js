var Application = function(){
  var socket

  this.init = function(){
    socket = new Socket
    return this
  }

  this.emit = function(emitter, data){
    socket.sendJSON({emitter: emitter, params: data})
  }

  this.checkConnection = function(){
    return socket.checkConnection()
  }

  this.run = function(){
    initLayout()
    return this
  }
}

document.addEventListener('DOMContentLoaded', function(){
  var app = (new Application).init()
  var checkSocket = function(){
    Router.app = app
    if(app.checkConnection()){
      errorInApp("Server is not available")
      app.init()
    }else{
      app.run()
    }
  }
  setTimeout(checkSocket, 100)
})
