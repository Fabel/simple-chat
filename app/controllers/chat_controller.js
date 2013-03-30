exports.ChatController = new function(){

  this.Join = function(client, params){
    params.channels = ChannelList.withoutUser(client.user)
    this.send(client, params)
  }

  this.broadCastForChannel = function(channel, message){
    for(var name in channel.users)
      this.send(channel.users[name].client, message)
  }

  this.Message = function(client, params){
    if(client.user){
      if(params.channel){
        var msg = {
          user: client.user,
          message: params.message
        }
        params.message = ChannelList[params.channel].addMessage(msg)
      }
    }
    this.broadCastForChannel(ChannelList[params.channel], params.message)
  }

  this.LoadChannel = function(client, params){
    var user = client.user
    if(ChannelList[params.channel])
      ChannelList[params.channel].subscribe(user)
    this.send(client, {channel: ChannelList[params.channel]})
  }

  this.Subscribe = function(client, params){
    var user = client.user
    if(ChannelList[params.data]){
      ChannelList[params.data].subscribe(user)
      user.subscribe(params.data)
      params.channel = ChannelList[params.data]
    }
    this.send(client, params)
  }

  this.Unsubscribe = function(client, params){
    var user = client.user
    if(ChannelList[params.data]){
      ChannelList[params.data].unsubscribe(user)
      user.unsubscribe(params.data)
      params.channel = params.data
    }
    this.send(client, params)
  }

  this.CreateChannel = function(client, params){
    if(ChannelList['#'+params.name])
      params.errors = ['Channel exist']
    else{
      ChannelList.newChannel('#'+params.name)
      client.user.subscribe('#'+params.name)
      params.success = true
      params.channel = ChannelList['#'+params.name]
    }
    this.send(client, params)
  }

}
