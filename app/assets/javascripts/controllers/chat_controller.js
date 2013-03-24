var ChatController = new function(){
  //actions
  this.Index = function(){
    EJS.renderTemplate('chat#index', function(data){
      document.body.innerHTML = data
      login.addEventListener('click', function(){
        if(user_name.value)
          Router.app.emit('chat#login', {user: user_name.value})
      })
    })
  }

  this.Message = function(msg){
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(msg.data.user+': '+msg.data.message))
    message_list.appendChild(li)
    //Message body
  }

  this.Login = function(msg){
    console.log(msg)
    EJS.renderTemplate('chat#messages', {messages: msg.data}, function(data){
      document.body.innerHTML = data
      send_message.addEventListener('click', function(){
        if(message.value)
          Router.app.emit("chat#message", {message: message.value})
        message.value = ''
      })
      message.addEventListener('keydown', function(e){
        if(e.keyCode == 13 && message.value){
          Router.app.emit("chat#message", {message: message.value})
          message.value = ''
        }
      })
    })
  }

  this.Logout = function(msg){
    //Logout body
  }

}
