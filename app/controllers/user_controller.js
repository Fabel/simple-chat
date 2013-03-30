exports.UserController = new function(){
  var validateUser = function(data){
    var errors = []
    if(!data.login)
      errors.push("Login cant be blank")
    var s
    if(s=data.login.match(/\W/))
      errors.push("Incorrect symbol in name "+s[0])
    if(Users[data.login])
      errors.push("User "+ data.login + " exist.")
    if(data.password.length < 5)
      errors.push('Password length should be greater 4')
    if(data.password != data.password_confirmation)
      errors.push('Password mismath')
    if(errors.length)
      return errors
  }

  this.Registration = function(client, params){
    var errors = validateUser(params.user)
    if(errors){
      params.errors = errors
    }else{
      var data = {
        name: params.user.login,
        password: params.user.password
      }
      var user = new User(data)
      Users[user.name] = user
      client.user = user.login()
      client.onclose(unsubscribeAll)
      params.success = true
      params.user = user
      params.token = user.token
    }
    this.send(client, params)
  }

  this.Login = function(client, params){
    var user
    if(user = User.login(params.user.login, params.user.password)){
      client.user = user
      user.client = client
      params = {
        success: true,
        user: user.forChannels(),
        token: user.token
      }
      client.onclose(unsubscribeAll)
    }else{
      params.fail = "error"
    }
    this.send(client, params)
  }

  this.LoadPhoto = function(client, params){
    client.lastFileName = params.file
    client.onBinaryData = User.receivePhoto
    this.send(client, params)
  }

  this.LoginByToken = function(client, params){
    var user
    if(user = User.loginByToken(params.token)){
      params = {}
      client.user = user
      user.client = client
      params.success = true
      params.user = user.forChannels()
      client.onclose(unsubscribeAll)
    }
    this.send(client, params)
  }

  this.Logout = function(client, params){
    client.user.logout()
    this.send(client, params)
  }

  var unsubscribeAll = function(){
    var client = this
    this.user.channels.forEach(function(channel){
      ChannelList[channel].unsubscribe(client.user)
    })
  }
}
