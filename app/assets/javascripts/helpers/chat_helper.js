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

  this.channelSelect = function(channel){
    header.classList.add('chat_header')
    if(window.footer && window.social_box){
      outer.removeChild(footer)
      header.removeChild(social_box)
    }
    content.innerHTML = ''
    channel.switchMenu()
    content.appendChild(channel.chat)
    channel.message_list.scrollTop = channel.message_list.scrollHeight
    channel.chat.querySelector('textarea').focus()
  }

  this.bindEventsForChat = function(channel){
    var submitBtn = channel.chat.querySelector('#send_message')
    var textArea = channel.chat.querySelector('textarea')

    submitBtn.addEventListener('click', function(){
      var data = {
        channel: channel.name,
        message: textArea.value
      }
      if(textArea.value.length && textArea.value.length < 1024){
        Router.app.emit('chat#message', data)
        textArea.value = ''
      }
    })

    textArea.addEventListener('keydown', function(e){
      if(!e.shiftKey && e.keyCode == 13){
        e.preventDefault()
        submitBtn.click()
      }
    })
  }
}
