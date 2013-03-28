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
    description: 'start server',
    commands: [
      "cd "+this.current,
      "north server -e production >> "+this.shared+"/log/server.log 2>&1 &"
    ]
  })

  this.task({
    name: 'copy_assets',
    description: 'copy assets',
    commands: [
      'cp -rf '+this.current+'/app/assets/images/. '+this.current+'/public/assets/',
      'cp -rf '+this.current+'/app/views/. '+this.current+'/public/assets/'
    ]
  })

  this.task({
    name: "stop",
    description: 'stop server',
    commands: ['kill -TERM `cat '+this.current+'/tmp/server.pid`']
  })

}
