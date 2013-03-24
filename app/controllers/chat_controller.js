exports.ChatController = new function(){

  this.users = []

  this.messages = []

  this.Message = function(client, params){
    var msg = {user: client.user, message: params.message}
    this.messages.push(msg)
    this.broadcast(client, msg)
  }
  this.Login = function(client, params){
    client.user = params.user
    this.users.push(params.user)
    this.send(client, this.messages)
  }
  this.Logout = function(client, params){
    Utils.remove(this.users, client.user)
  }
}
