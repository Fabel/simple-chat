var fadeOut = function(element, time, callback){
  var opacity = 1
  if(element){
    setTimeout(function(){
      ;(function fade(){
        opacity -= 0.1
        element.style.opacity = opacity;
        if(opacity < 0)
          element.parentNode.removeChild(element)
        else
          setTimeout(fade, 40)
      })();
    }, time || 0)
  }
}

var Camelize = function(str){
  if(!str) return str
  return str.split('_').map(function(e){
    if(e){
      return e.charAt(0).toUpperCase()+e.slice(1)
    } else return ""
  }).join('')
}

Array.prototype.remove = function(){
  var x
  for(var i=arguments.length;i--;)
    while((x = this.indexOf(arguments[i])) != -1)
      this.splice(x, 1)
  return this
}
