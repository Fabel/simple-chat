var UserController = new function(){
  //actions
  this.Registation = function(msg){
    //Registation body
  }

  this.Login = function(msg){
    if(msg.data.success){
      localStorage.setItem('user_token', msg.data.token)
      success(msg.data)
      return
    }
    EJS.renderTemplate('user#login', function(html){
      content.innerHTML = html
      password.addEventListener('keydown', function(e){
        if(e.keyCode == 13){
          submit_login.click()
        }
      })
      submit_login.addEventListener('click', function(e){
        if(login.value && password.value){
          Router.app.emit('user#login', {user: {login: login.value, password: password.value}})
        }
      })
    })
  }

  this.LoginByToken = function(msg){
    if(msg.data.success){
      success(msg.data)
    }
  }

  var success = function(data){
    var user = data.user
    EJS.renderPartial("layout#header", {user: data.user}, function(html){
      header.innerHTML = html
    })
  }

  this.LoadPhoto = function(msg){
    //LoadPhoto body
  }

  this.Logout = function(msg){
    success({user: null})
  }

}
