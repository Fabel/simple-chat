var UserController = new function(){
  //actions
  this.Registration = function(msg){
    var pushError = function(error){
      var errorsCont = content.querySelector('#errors')
      var li = document.createElement('li')
      li.appendChild(document.createTextNode(error))
      errorsCont.appendChild(li)
      fadeOut(li, 3000)
    }
    if(msg.data.errors){

    }
    EJS.renderTemplate('user#registration', {user: msg.data.user}, function(html){
      content.innerHTML = html
      submit_registration.addEventListener('click', function(){
        if(!login.value){
          pushError('Login missed')
          return
        }
        if(!password.value){
          pushError('Password missed')
          return
        }
        if(password.value == password_confirmation.value){
          Router.app.emit("user#registration", {user: {
            login: login.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
          }})
        }else{
          pushError("Password mismath")
        }
      })
    })
  }

  this.Login = function(msg){
    if(msg.data.success){
      localStorage.setItem('user_token', msg.data.token)
      success(msg.data)
      content.innerHTML = "success"
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
