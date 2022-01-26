var cssText = 'div { transform: skewY(.008deg);}'; 
var css = document.createElement('style'); 
css.type = 'text/css';
if('textContent' in css) 
    css.textContent = cssText;
else
    css.innerText = cssText;
document.body.appendChild(css);