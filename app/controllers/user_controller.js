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
    var user
    if(user = User.login(params.user.name, params.user.password)){
      params.success = true
      params.user = user
      client.onBinaryData = user.receivePhoto
    }else{
      params.fail = "error"
    }
    this.send(client, params)
  }

  this.LoadPhoto = function(client, params){
    client.lastFileName = params.file
  }

  this.loginByToken = function(client, params){
    var user
    if(user = User.loginByToken(params.user.name, params.user.token)){
      params.success = true
      params.user = user
      client.onBinaryData = user.receivePhoto
    }else{
      params.fail = "error"
    }
    this.send(client, params)
  }
}
