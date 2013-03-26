var crypto = require('crypto'),
    fs = require('fs')

var cryptPassword = function(pass){
  if(!pass)
    return
  var shasum = crypto.createHash('sha1')
  shasum.update(pass)
  return shasum.digest('hex')
}

var usersPath = APP_PATH + '/db/users/'

global.Users = {}

var userTokens = {}

Users.online = function(){
  var users = []
  for(var name in this){
    if(this[name].status)
      users.push(this[name])
  }
  return users
}

Users.add = function(user){
  this[user.name] = user
  user.login()
  return user
}

var User = function(attrs){
  attrs = attrs || {}
  this.name = attrs.name
  this.file = attrs.file
  this.encrypted_password = cryptPassword(attrs.password)
  this.token = null
  this.status = false
}


User.load = function(name){
  if(fs.existsSync(usersPath+name))
    return (new this({name: name})).load()
  return false
}

User.login = function(name, password){
  if(Users[name]){
    if(Users[name].checkPassword(password)){
      return Users[name].login()
    }
  }
  return null
}

User.loginByToken = function(token){
  var name
  if(name = userTokens[token]){
    if(Users[name].checkToken(token)){
      return Users[name].login()
    }
  }
  return null
}

User.loadAllUsers = function(){
  var users = fs.readdirSync(usersPath)
  users.forEach(function(user, id){
    Users[user] = User.load(user)
    if(Users[user].token)
      userTokens[Users[user].token] = user
  })
  console.log(users.length + " users loaded.")
}

User.prototype = new function(){

  this.validate = function(){
    var errors = []
    if(!this.name)
      errors.push("Name cant be blank")
    if(Users[this.name])
      errors.push("User "+ this.name + " exist.")
    return errors
  }

  this.load = function(){
    var json = fs.readFileSync(usersPath+this.name, "utf-8")
    var data = JSON.parse(json)
    this.file = data.file
    this.encrypted_password = data.encrypted_password
    this.token = data.token
    return this
  }

  this.save = function(){
    var data = JSON.stringify({
      file: this.file,
      encrypted_password: this.encrypted_password,
      token: this.token
    })
    if(!fs.existsSync(usersPath))
      fs.mkdirSync(usersPath)
    fs.writeFileSync(usersPath+this.name, data, "utf-8")
  }

  this.login = function(){
    if(!this.token){
      this.token = Utils.generateToken()
      userTokens[this.token] = this.name
      this.save()
    }
    this.status = true
    return this
  }

  this.logout = function(){
    this.status = false
    delete userTokens[this.token]
    this.token = null
    this.save()
  }

  this.avatar = function(){
    if(this.file)
      return this.file
    else
      return "/assets/default.jpg"
  }

  this.checkPassword = function(pass){
    return this.encrypted_password == cryptPassword(pass)
  }

  this.checkToken = function(token){
    return this.token == token
  }

  this.forClient = function(){
    return {
      name: this.name,
      file: this.avatar()
    }
  }

  this.forFile = function(){
    return {
      name: this.name,
      encrypted_password: this.encrypted_password,
      file: this.file,
      token: this.token
    }
  }

  this.toJSON = function(callback){
    if(callback && typeof callback == 'function')
      return callback.call(this)
    else
      return this.forClient()
  }

  this.receivePhoto = function(name, data){
    this.file = FileReceiver(name, data, 'images/'+this.name)
    this.save()
  }
}
global.User = User
