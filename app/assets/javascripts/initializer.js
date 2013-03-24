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
