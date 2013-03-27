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
      this.last_message = msg.user+ ':' + msg.message
    this.container = null
    this.current = false
    this.makeDOM()
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
        self.list.update()
      })
    }

    this.pushMessage = function(user, message){
      this.messages.push({user: user, message: message})
      this.last_message = user + ':' +message
      this.new_messages++
      this.update()
    }

    this.update = function(){
      this.fields.last_message.innerHTML = this.last_message
      if(this.new_messages)
        this.fields.new_messages.innerHTML = '+'+this.new_messages
      if(!this.fields.ava.src.match(this.ava)){
        this.fields.ava.src = this.ava
      }
    }
  }

  var ChannelList = function(user){
    this.user = user
    this.channels = {}
    this.channelNames = []
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
        this.channelNames.push(data.name)
        this.channels[data.name] = new Channel(data, this)
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