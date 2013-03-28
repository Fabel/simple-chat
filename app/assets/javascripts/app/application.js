var Application = function(){
  var socket = new Socket
  var app = this

  Router.app = app

  this.init = function(){
    ;(function(){
      function checkSocket(){
        if(app.checkConnection()){
          errorInApp("Server is not available")
          if(socket.connection.readyState)
            socket = new Socket
          setTimeout(checkSocket, 500)
        }else{
          app.run()
        }
      }
      setTimeout(checkSocket, 500)
    })()
    return this
  }

  this.emit = function(emitter, data){
    socket.sendJSON({emitter: emitter, params: data})
  }

  this.local = function(emitter, data){
    Router.local(emitter, data)
  }

  this.send = function(data){
    return socket.send(data)
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
  ;(new Application).init()
})
