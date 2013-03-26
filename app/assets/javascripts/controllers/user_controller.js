var UserController = new function(){
  //actions
  var pushError = function(error){
    var errorsCont = content.querySelector('#errors')
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(error))
    errorsCont.appendChild(li)
    fadeOut(li, 3000)
  }
  this.Registration = function(msg){
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
      content.innerHTML = "<h2>Login successful</h2>"
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

  var loadFile = function(file){
    var fr = new FileReader
    fr.addEventListener('load', function(e){
      Router.app.send(this.result)
    })
    fr.readAsArrayBuffer(file)
  }

  var previewPhoto = function(file){
    var fr = new FileReader
    fr.addEventListener('load', function(e){
      var img = document.createElement('img')
      img.src = this.result
      if(preview.firstChild)
        preview.removeChild(preview.firstChild)
      preview.appendChild(img)
    })
    fr.readAsDataURL(file)
  }

  this.LoadPhoto = function(msg){
    if(msg.data.success){
      success(msg.data)
      content.innerHTML = "<h2>Avatar changed</h2>"
      return
    }
    EJS.renderTemplate("user#load_photo", function(html){
      content.innerHTML = html
      var file
      file_field.addEventListener('change', function(){
        file = this.files[0]
        if(!file.type.match('jpeg|jpg|png')){
          pushError("It's not image")
          return
        }
        if(file.size > 2*1024*1024){
          pushError("Image size > 2Mb")
          return
        }
        previewPhoto(file)
      })

      submit_photo.addEventListener('click', function(){
        Router.app.emit("user#load_photo", {file: file.name})
        loadFile(file)
      })
    })
  }

  this.Logout = function(msg){
    success({user: null})
  }

}
