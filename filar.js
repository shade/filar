(function(window){
	/*
	Filar v0.0.1
	author: Joseph Thomas
	Date:	Jan 17, 2016
*/

window.Filar	=	function(){
	
};

Filar.prototype.attachImage	=	function(element,callbacks){
	
//	Create the file input 
	var _input	=	document.createElement('input');
//	Add the image to the element
	this.setInput(_input,element);
	
//		Read the uploaded image and send to callback
	_input.addEventListener('change',function(){
		var _file	=	_input.files[0];
		if(_file.type.match('image.*')){ /*Make sure it's an image*/
			
			var _reader	=	new FileReader();
			
			_reader.onload	=	function(e){
				callbacks.done&&callbacks.done(e.target.result);
			}
			
			_reader.readAsDataURL(_file);
		}else{
//			Tell the user it's not a real image
			callbacks.error&&callbacks.error({code:1,error:'Not Image'});
		}
	});
	
}

Filar.prototype.setInput	=	function(input,element){
//	make sure the input has the basic properties
	input.type	=	'file';
//	make the input exactly the same as the element
	input.style.opacity	=	'0';
	input.style.position	=	'absolute';
	input.style.cursor	=	this.getStyle(element,'cursor');
	input.style.height	=	this.getStyle(element,'height');
	input.style.width		=	this.getStyle(element,'width');
	input.style.top		=	this.getStyle(element,'top');
	input.style.left		=	this.getStyle(element,'left');
	input.style.margin		=	this.getStyle(element,'margin');
	input.style.borderRadius	=	this.getStyle(element,'borderRadius');
	input.style.zIndex	=	10000;

	element.parentNode.insertBefore(input,element);
}


Filar.prototype.getStyle	=	function(el,styleProp){
//	You can only get percentage CSS values when the element is not displayed
	el.style.display	=	'none';
    if (el.currentStyle)
        var y = el.currentStyle[styleProp];
    else if (window.getComputedStyle)
        var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
	el.style.display	=	'block';
    return y;
}
})(window);
