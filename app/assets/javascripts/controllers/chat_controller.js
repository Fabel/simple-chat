var ChatController = new function(){

  this.Join = function(msg){
    ChatHelper.join(msg)
  }

  this.LoadChannel = function(msg){
    CL.addChannel(msg.data.channel)
  }

  this.Channel = function(msg){
    CL.channels[msg.data].select()
  }

  this.CreateChannel = function(msg){
    ChatHelper.createChannel(msg)
  }

  this.Subscribe = function(msg){
    CL.addChannel(msg.data.channel)
  }

  this.Unsubscribe = function(msg){
    if(msg.data.channel)
      CL.removeChannel(msg.data.channel)
    EJS.renderTemplate("layout#index", function(data){
      document.body.innerHTML = data
      UserHelper.success({user: Router.app.currentUser })
    })
  }

  this.Message = function(msg){
    var channel
    if(channel = Cl.channels[msg.data.user.name]){

    }else{
      CL.addChannel(msg.data.user)
    }
  }
}
