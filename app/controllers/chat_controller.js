exports.ChatController = new function(){

  this.LoadChannel = function(client, params){
    var user = client.user
    if(ChannelList[params.channel])
      ChannelList[params.channel].subscribe(user)
    this.send(client, {channel: ChannelList[params.channel]})
  }

  this.Subscribe = function(client, params){
    var user = client.user
    if(ChannelList[params.channel]){
      ChannelList[params.channel].subscribe(user)
      user.addChannel(params.channel)
    }
    this.send(client, params)
  }

  this.Unsubscribe = function(client, params){
    var user = client.user
    if(ChannelList[params.channel]){
      ChannelList[params.channel].unsubscribe(user)
      user.removeChannel(params.channel)
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
