exports.UserController = new function(){
  var validateUser = function(data){
    var errors = []
    if(!data.login)
      errors.push("Login cant be blank")
    if(Users[data.login])
      errors.push("User "+ data.login + " exist.")
    if(data.password != data.password_confirmation)
      errors.push('Password mismath')
    if(errors.length)
      return errors
  }

  this.Registration = function(client, params){
    if(params.user){
      var errors = validateUser(params.user)
      if(errors){
        params.errors = errors
        this.send(client, params)
      }else{
        var data = {
          name: params.user.login,
          password: params.user.password
        }
        var user = new User(data)
        client.user = Users.add(user)
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
      }else{
        params.fail = "error"
      }
    }
    this.send(client, params)
  }

  this.LoadPhoto = function(client, params){
    if(params.file){
      client.lastFileName = params.file
      client.onBinaryData = User.receivePhoto
    }
    this.send(client, params)
  }

  this.LoginByToken = function(client, params){
    var user
    if(user = User.loginByToken(params.token)){
      params = {}
      client.user = user
      params.success = true
      params.user = user
    }
    this.send(client, params)
  }

  this.Logout = function(client, params){
    client.user.logout()
    this.send(client, params)
  }
}
