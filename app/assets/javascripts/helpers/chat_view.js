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
}
// document.body.addEventListener('mousemove', function(e){
//   if(e.pageY< 50)
//     header.style.display = "block"
//   else if(e.pageY > 200)
//     header.style.display = "none"
// })
