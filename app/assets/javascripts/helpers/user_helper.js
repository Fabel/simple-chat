var UserHelper = new function(){

  this.pushError = function(error){
    var errorsCont = content.querySelector('#errors')
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(error))
    errorsCont.appendChild(li)
    fadeOut(li, 3000)
  }

  this.registration = function(data){
    EJS.renderTemplate('user#registration', {user: data.user}, function(html){
      content.innerHTML = html
      submit_registration.addEventListener('click', function(){
        if(!login.value){
          UserHelper.pushError('Login missed')
          return
        }
        if(!password.value){
          UserHelper.pushError('Password missed')
          return
        }
        if(password.value == password_confirmation.value){
          Router.app.emit("user#registration", {user: {
            login: login.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
          }})
        }else{
          UserHelper.pushError("Password mismath")
        }
      })
    })
  }

  this.login = function(data){
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

  this.loadPhoto = function(msg){
    EJS.renderTemplate("user#load_photo", function(html){
      content.innerHTML = html
      var file
      file_field.addEventListener('change', function(){
        file = this.files[0]
        if(!file.type.match('jpeg|jpg|png')){
          UserHelper.pushError("It's not image")
          return
        }
        if(file.size > 2*1024*1024){
          UserHelper.pushError("Image size > 2Mb")
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

  this.success = function(data){
    var user = data.user
    EJS.renderPartial("layout#header", {user: data.user}, function(html){
      header.innerHTML = html
    })
    if(data.user){
      EJS.renderTemplate("chat#channel_list", function(html){
        channel_list.innerHTML = html
        if(!window.CL)
          CL = new ChannelList(user)
        else
          CL.update()
      })
    }else{
      channel_list.innerHTML = ''
    }
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
}
