var Underscore = function(str){
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
  var action = emitter.type ? '_'+Underscore(emitter.action) : Underscore(emitter.action)
  var dirNames = ['/assets', subDir, action]
  return dirNames.join('/')+'.ejs'
}

EJS.Storage.saveLocal = false

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

var linkHandler = function(event){
  event.preventDefault()

  var data = this.getAttribute('data-data') || {}
  var action
  if(action = this.getAttribute('data-emit')){
    Router.app.emit(action, {data: data})
  }else if(action = this.getAttribute('data-local'))
    Router.local(action, data)
}

$(function(){
  document.body.addEventListener('click', function(e){
    var links = document.querySelectorAll('[data-emit], [data-local]')
    for(var i=0;i<links.length;i++){
      if(!links[i].link_handler){
        links[i].addEventListener('click', linkHandler)
        links[i].link_handler = true
        var elem = e.target
        while(elem != document.body){
          if(elem == links[i]){
            links[i].click()
            break
          }
          elem = elem.parentNode
          if(!elem)
            break
        }
      }
    }
  })
})

$(function(){
  var token
  if(token = localStorage.getItem('user_token'))
    Router.app.emit('user#login_by_token', {token: token})

})
