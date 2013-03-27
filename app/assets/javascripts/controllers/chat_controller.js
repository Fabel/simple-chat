var ChatController = new function(){
  this.Index = function(msg){
    EJS.renderTemplate("chat#index", function(html){
      content.innerHTML = html
    })
  }

  this.LoadChannel = function(msg){
    CL.addChannel(msg.data.channel)
  }

  this.Channel = function(msg){
    console.log(CL.channels[msg.data])
  }

  this.Message = function(msg){
    var channel
    if(channel = Cl.channels[msg.data.user.name]){

    }else{
      CL.addChannel(msg.data.user)
    }
  }
}
