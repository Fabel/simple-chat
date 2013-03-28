var UserController = new function(){
  //actions

  this.Registration = function(msg){
    if(msg.data.errors){
      msg.data.errors.forEach(function(error){
        UserHelper.pushError(error)
      })
    }else if(msg.data.success){
      localStorage.setItem('user_token', msg.data.token)
      UserHelper.success(msg.data)
      content.innerHTML = "<h2>Registration successful</h2>"
    }else
      UserHelper.registration(msg.data)
  }

  this.Login = function(msg){
    if(msg.data.success){
      localStorage.setItem('user_token', msg.data.token)
      UserHelper.success(msg.data)
      content.innerHTML = "<h2>Login successful</h2>"
    }else
      UserHelper.login(msg.data)
  }

  this.LoginByToken = function(msg){
    if(msg.data.success){
      UserHelper.success(msg.data)
    }
  }

  this.LoadPhoto = function(msg){
    if(msg.data.success){
      UserHelper.success(msg.data)
      content.innerHTML = "<h2>Avatar changed</h2>"
    }else
      UserHelper.loadPhoto(msg)
  }

  this.Logout = function(msg){
    UserHelper.success({user: null})
  }

}
