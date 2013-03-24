var ChatController = new function(){
  //actions
  var users = {}
  var Chat = this

  this.Index = function(msg){
    EJS.renderTemplate('chat#index', {users: msg.data} , function(data){
      document.body.innerHTML = data
      login.addEventListener('click', function(){
        if(user_name.value)
          Router.app.emit('chat#login', {user: user_name.value})
      })
    })
  }

  this.Message = function(msg){
    if(!window.message_list)
      return
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(msg.data.user+': '+msg.data.message))
    message_list.appendChild(li)
    //Message body
  }

  this.NewUser = function(msg){
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(msg.data.user))
    var user = msg.data.user
    users[user] = li
    user_list.appendChild(li)
    Chat.Message({data:{ user: 'System', message: 'User '+user+' join to chat'}})
  }

  this.Login = function(msg){
    EJS.renderTemplate('chat#messages', msg.data, function(data){
      content.innerHTML = data
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
    if(users[msg.data]){
      Chat.Message({data:{ user: 'System', message: 'User '+msg.data+' leave'}})
      user_list.removeChild(users[msg.data])
      delete users[msg.data]
    }
  }

}
