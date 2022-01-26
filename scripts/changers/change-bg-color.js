// Needs work
var cssText = 'div { background-color: black; color: white;}'; 
var css = document.createElement('style'); 
css.type = 'text/css'; 
if('textContent' in css) 
    css.textContent = cssText; 
else
    css.innerText = cssText;
document.body.appendChild(css);