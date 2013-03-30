var ChannelList = (function(){
  var Channel = function(data, list){
    this.list = list
    this.ava = data.ava || "/assets/global_channel.jpg"
    this.users = {}
    this.name = data.name
    this.new_messages = 0
    this.messages = data.messages || []
    var msg
    if(msg = this.messages[this.messages.length-1])
      this.last_message = (msg.user.name || msg.user )+ ':' + msg.message
    this.container = null
    this.chat = null
    this.current = null
    this.makeDOM()
    this.makeChat()
  }

  Channel.prototype = new function(){
    this.makeDOM = function(){
      var self = this
      EJS.renderPartial("chat#channel", {channel: self}, function(html){
        var div = document.createElement('div')
        div.innerHTML = html
        var c = div.firstChild
        self.container = c
        self.fields = {
          new_messages: c.querySelector('.new_messages'),
          ava: c.querySelector('.ava'),
          last_message: c.querySelector('.last_message')
        }
        if(self.messages.length){
          var ava
          if(ava = self.messages[self.messages.length-1].user.file)
            self.ava = ava
        }
        self.update()
        self.list.update()
      })
    }

    this.makeChat = function(){
      var self = this
      EJS.renderTemplate('chat#chat', {channel: this, messages: this.messages}, function(html){
        var div = document.createElement('div')
        div.innerHTML = html
        var c = div.firstChild
        self.chat = c
        self.message_list = c.querySelector('#message_list')
        ChatHelper.bindEventsForChat(self)
      })
    }

    this.select = function(){
      if(this.current)
        return
      if(CL.currentChannel)
        CL.currentChannel.unselect()
      this.current = true
      CL.currentChannel = this
      this.new_messages = 0
      this.update()

      ChatHelper.channelSelect(this)
    }

    this.appendMessage = function(msg){
      var self = this
      EJS.renderPartial("chat#message", {message: msg.message, user: msg.user}, function(html){
        var div = document.createElement('div')
        div.innerHTML = html
        var c = div.firstChild
        self.message_list.appendChild(c)
        self.message_list.scrollTop = self.message_list.scrollHeight
        self.ava = msg.user.file
      })
    }

    this.unselect = function(){
      this.current = false
      CL.currentChannel = null
      content.removeChild(this.chat)
    }

    this.pushMessage = function(user, message){
      var msg = {user: user, message: message}
      this.messages.push(msg)
      this.last_message = user.name + ':' +message
      if(!this.current){
        this.new_messages++
        msg_audio.play()
      }
      this.appendMessage(msg)
      this.update()
    }

    this.switchMenu = function(){
      EJS.renderPartial("layout#navigate", {user: Router.app.currentUser, channel: this}, function(html){
        nav.outerHTML = html
      })
    }

    this.update = function(){
      this.fields.last_message.innerHTML = this.last_message
      if(this.new_messages)
        this.fields.new_messages.innerHTML = '+'+this.new_messages
      else
        this.fields.new_messages.innerHTML = ''
      if(!this.fields.ava.src.match(this.ava)){
        this.fields.ava.src = this.ava
      }
    }
  }

  var ChannelList = function(user){
    this.user = user
    this.channels = {}
    this.initChannels()
  }

  ChannelList.prototype = new function(){
    this.initChannels = function(){
      var channels = this.user.channels
      for(var i=0;i<channels.length;i++)
        Router.app.emit("chat#load_channel", {channel: channels[i]})
    }

    this.channelList = function(){
      return this.channels;
    }

    this.addChannel = function(data){
      if(!this.channels[data.name]){
        this.channels[data.name] = new Channel(data, this)
        this.update()
      }
    }

    this.removeChannel = function(name){
      if(this.channels[name]){
        this.channels[name].unselect()
        delete this.channels[name]
        this.update()
      }
    }

    this.update = function(){
      channels_wrapper.innerHTML = ''
      for(var name in this.channels){
        if(this.channels[name].container)
          channels_wrapper.appendChild(this.channels[name].container)
      }
    }
  }
  return ChannelList
})()
