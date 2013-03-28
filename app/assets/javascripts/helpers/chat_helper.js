var ChatHelper = new function(){

  this.createChannel = function(msg){
    if(msg.data.errors){
      msg.data.errors.forEach(function(error){
        UserHelper.pushError(error)
      })
      return
    }
    if(msg.data.success){
      content.innerHTML = "<h2>Channel success created</h2>"
      CL.addChannel(msg.data.channel)
    }
    EJS.renderTemplate('chat#create_channel', function(html){
      content.innerHTML = html
      submit_channel.addEventListener('click', function(){
        if(channel_name.value)
          Router.app.emit('chat#create_channel', {name: channel_name.value})
        else
          pushError('Empty channel name')
      })
    })
  }

  this.join = function(msg){
    EJS.renderTemplate("chat#join", { channels: msg.data.channels }, function(html){
      content.innerHTML = html
      var btns = content.querySelectorAll('.button')
      for(var i=0;i<btns.length;i++){
        btns[i].addEventListener('click', linkHandler)
        btns[i].link_handler = true
        btns[i].addEventListener('click', function(e){
          join_channel_list.removeChild(this.parentNode)
        })
      }
    })
  }

}
// document.body.addEventListener('mousemove', function(e){
//   if(e.pageY< 50)
//     header.style.display = "block"
//   else if(e.pageY > 200)
//     header.style.display = "none"
// })
