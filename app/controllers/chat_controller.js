exports.ChatController = new function(){

  this.users = []

  this.messages = []

  this.Index = function(client, params){
    this.send(client, this.users)
  }

  this.Message = function(client, params){
    var msg = {user: client.user, message: params.message}
    this.messages.push(msg)
    this.broadcast(client, msg)
  }
  this.Login = function(client, params){
    var controller = this
    client.onclose(function(){
      controller.Logout(client, params)
    })

    client.user = params.user
    this.send(client, {messages: this.messages, users: this.users})
    this.users.push(params.user)
    this.broadcast(client, {user: params.user}, {action: 'new_user'})
  }
  this.Logout = function(client, params){
    Utils.remove(this.users, client.user)
    this.broadcast(client, client.user, {action: 'logout'})
  }
}
