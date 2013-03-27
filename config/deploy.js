module.exports = function(){
  this.set('user', 'fabel')
  this.set('host', 'li564-198.members.linode.com')
  this.set('application', 'simple-chat')
  this.set('app_path', "/home/"+this.user+"/www/"+this.application)
  this.set('shared', this.app_path+"/shared")
  this.set('releases', this.app_path+"/releases")
  this.set('current', this.app_path+"/current")

  this.set('git', 'https://github.com/Fabel/simple-chat')

  this.task({
    name: 'start',
    descripttion: 'start server',
    commands: [
      "cd "+this.current,
      "north server 2>&1 >>"+this.shared+"/log/server.log &"
    ]
  })

  this.task({
    name: "stop",
    descripttion: 'stop server',
    commands: ['kill -TERM `cat '+this.current+'/tmp/server.pid`']
  })

}
