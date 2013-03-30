var fs = require('fs')

var channelsDir = APP_PATH + '/db/channels/'

var Channel = function(name){
  this.name = name
  this.users = []
  this.history = []
  this.messageCount = 0
  this.load()
}

Channel.load = function(name){
  if(fs.existsSync(channelsDir+name))
    return new this(name)
  return false
}

Channel.prototype = new function(){

  this.subscribe = function(user){
    this.users[user.name] = user
  }

  this.unsubscribe = function(user){
    delete this.users[user.name]
  }

  this.create = function(){
    var msg = {user: this.name, message: 'Channel success created'}
    fs.writeFileSync(channelsDir+this.name, JSON.stringify(msg))
    this.history.push(msg)
  }

  this.trimAndSave = function(){
    var messages = this.history.splice(this.history.length-100, 100)
    var data = JSON.stringify(messages)
    data = data.slice(1, data.length-1)
    fs.writeFileSync(channelsDir+this.name, data)
    this.messageCount = 100
  }

  this.load = function(){
    if(!fs.existsSync(channelsDir+this.name)){
      this.create()
    }else{
      var history = fs.readFileSync(channelsDir+this.name)
      this.history = JSON.parse("["+history+"]")
      this.messageCount = this.history.length
    }
  }
  this.addMessage = function(msg){
    var message = { user: msg.user.name, message: msg.message }
    this.history.push(message)
    this.messageCount++
    fs.appendFileSync(channelsDir+this.name, ",\n"+JSON.stringify(message))
    if(this.messageCount>1000){
      this.save()
    }
    return {user: msg.user, message: msg.message, channel: this.name}
  }

  this.historyToJSON = function(){
    return this.history.map(function(msg){
      return {
        message: msg.message,
        user: Users[msg.user] || msg.user
      }
    })
  }

  this.toJSON = function(){
    return{
      name: this.name,
      messages: this.historyToJSON()
    }
  }
}

var ChannelList = {}

ChannelList.loadAllChannels =  function(){
  var channels = fs.readdirSync(channelsDir)
  channels.forEach(function(channel, id){
    ChannelList[channel] = Channel.load(channel)
  })
  console.log(channels.length + " channels loaded.")
}

ChannelList.newChannel = function(name){
  ChannelList[name] = new Channel(name)
}

ChannelList.withoutUser = function(user){
  var channels = []
  for(var name in ChannelList){
    if(typeof ChannelList[name] == 'object')
      if(Utils.exclude(user.channels, name))
        channels.push(name)
  }
  return channels
}

global.Channel = Channel
global.ChannelList = ChannelList
