/*
	Filar v0.0.1
	author: Joseph Thomas
	Date:	Jan 17, 2016
*/

var Filar	=	function(){
	
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
	var _elStyle	=	window.getComputedStyle(element);
//	make sure the input has the basic properties
	input.type	=	'file';
//	make the input exactly the same as the element
	input.style.opacity	=	'0';
	input.style.position	=	'absolute';
	input.style.cursor	=	_elStyle.cursor;
	input.style.height	=	_elStyle.height;
	input.style.width		=	_elStyle.width;
	input.style.top		=	_elStyle.top;
	input.style.left		=	_elStyle.left;
	input.style.margin		=	_elStyle.margin;
	input.style.borderRadius	=	_elStyle.borderRadius;
	input.style.zIndex	=	10000;
			
	console.log(element,input);
	element.parentNode.insertBefore(input,element);
}
