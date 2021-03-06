var Socket = function(){
  this.connection = new WebSocket('ws://'+location.hostname+':8081')
  this.init(this)
}

Socket.prototype = new function(){

  this.init = function(socket){
    this.connection.addEventListener('open', function(){
      socket.sendJSON({type: 'server_start'})
    })

    this.connection.addEventListener('message', function(msg){
      Router.processMessage(JSON.parse(msg.data))
    })

    this.connection.addEventListener('close', function(){
      errorInApp("Server closed connection")
      setTimeout(Router.app.init, 5000)
    })
  }

  this.sendJSON = function(data){
    this.send(JSON.stringify(data))
  }

  this.send = function(data){
    this.connection.send(data)
  }

  this.checkConnection = function(){
    return this.connection.readyState != 1
  }
}
