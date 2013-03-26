var fadeOut = function(element, time){
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
