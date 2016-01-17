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
	_input.addEventListener('change',function(){
//		Read the uploaded image and send to callback
		var _file	=	_input.files[0];
		if(file.type.match('image.*')){ /*Make sure it's an image*/
			
			var _reader	=	new FileReader();
			
		}else{
//			Tell the user it's not a real image
			callbacks.error&&callbacks.error({code:0,error:'Not Image'});
		}
	});
	
}
