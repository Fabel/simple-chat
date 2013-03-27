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

  this.MakeChannel = function(client, params){
    if(!ChannelList[params.channel])
      ChannelList.newChannel(params.channel)
  }
}
