var ToFileName = function(str){
  if(!str) return str
  var replace = function(str, offset){
    if(offset)
      return '_'+str.toLowerCase()
    else
      return str.toLowerCase()
  }
  return str.replace(/[A-Z]/g, replace)
}

var path = function(emitter){
  var subDir = emitter.controller.split(':')
  for(var i=0;i<subDir.length;i++)
    subDir[i] = subDir[i].toLowerCase()
  subDir = subDir.join('/')
  var action = emitter.type ? '_'+ToFileName(emitter.action) : ToFileName(emitter.action)
  var dirNames = ['/assets', subDir, action]
  return dirNames.join('/')+'.ejs'
}

EJS.Storage.load = function(emitter){
  var url = path(emitter)
  var xhr = new XMLHttpRequest
  xhr.open('get', url)
  xhr.addEventListener('load', function(){
    switch(xhr.status){
      case 200:
        EJS.Storage.superLoad(emitter, xhr.responseText)
        break
      default:
        console.log('Template '+url+' not found')
    }
  })
  xhr.send(null)
}


var layoutCallbacks = []

var $ = function(callack){
  layoutCallbacks.push(callack)
}

var initLayout = function(){
  EJS.renderTemplate("layout#index", function(data){
    document.body.innerHTML = data
    for(var i = 0; i<layoutCallbacks.length; i++)
      layoutCallbacks[i].call(window)
  })
}

var linkProcessor = function(event){
  event.preventDefault()

  var data = this.getAttribute('data-data') || {}
  var action
  if(action = this.getAttribute('data-emit')){
    Router.app.emit(action, data)
  }else if(action = this.getAttribute('data-local'))
    Router.local(action, data)
}

$(function(){
  document.body.addEventListener('click', function(e){
    if(e.target.getAttribute('data-emit') || e.target.getAttribute('data-local')){
      if(!e.target.onclick){
        e.target.onclick = linkProcessor
        e.target.click()
      }
    }
  })
})

$(function(){
  var token
  if(token = localStorage.getItem('user_token'))
    Router.app.emit('user#login_by_token', {token: token})
})
