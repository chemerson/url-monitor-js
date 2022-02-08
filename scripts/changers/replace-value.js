
    var elements = window.document.querySelectorAll("body, body *")
    var child;
    for(var i = 0; i < elements.length; i++) {
        child = elements[i].childNodes[0];
        if(elements[i].hasChildNodes() && child.nodeType == 3){
            child.nodeValue = child.nodeValue.replace('e','');
        }
    }