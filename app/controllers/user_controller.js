exports.UserController = new function(){
  this.Registation = function(client, params){
    if(params.user){
      var user = User.new(params.user)
      var errors
      if(errors = user.validate()){
        params.errors = errors
      }else{
        Users.add(user)
        client.user = user
      }
    }
    this.send(client, params)
  }

  this.Login = function(client, params){
    if(params.user){
      var user
      if(user = User.login(params.user.login, params.user.password)){
        client.user = user
        params = {
          success: true,
          user: user,
          token: user.token
        }
        client.onBinaryData = user.receivePhoto
      }else{
        params.fail = "error"
      }
    }
    this.send(client, params)
  }

  this.LoadPhoto = function(client, params){
    client.lastFileName = params.file
  }

  this.LoginByToken = function(client, params){
    var user
    if(user = User.loginByToken(params.token)){
      params = {}
      client.user = user
      params.success = true
      params.user = user
      client.onBinaryData = user.receivePhoto
    }
    this.send(client, params)
  }

  this.Logout = function(client, params){
    client.user.logout()
    this.send(client, params)
  }
}
