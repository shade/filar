// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

(function(window){
/*
	Filar v0.0.1
	author: Joseph Thomas
	Date:	Jan 17, 2016
*/

//Every 3 bytes is encoded as 4 bytes of base64
//Thus, the chunk size must be a multiple of 4
var CHUNK_SIZE	=	3600;
var Filar	=	function(options){
	this.maxSize	=	options.maxSize||10E6	//set the default max size as 10MB
};

Filar.prototype.attachImage	=	function(id,callbacks){
	
	var _element	=	document.getElementById(id);
//	Create the file input 
	var _input	=	document.createElement('input');
//	Add the image to the element
	this.setInput(_input,_element);
	
//		Read the uploaded image and send to callback
	_input.addEventListener('change',function(){
		var _file	=	_input.files[0];
		if(_file.type.match('image.*')){ /*Make sure it's an image*/
			
			var _reader	=	new FileReader();
			
			_reader.onload	=	function(e){
				console.log(e.target);
				callbacks.done&&callbacks.done(e.target.result);
			}
			
			_reader.readAsDataURL(_file);
		}else{
//			Tell the user it's not a real image
			callbacks.error&&callbacks.error({code:1,error:'Not Image'});
		}
	});
	
}

Filar.prototype.attachFile	=	function(id,callbacks){
	var _this	=	this;
	
	var _element	=	document.getElementById(id);
//	Create the file input 
	var _input	=	document.createElement('input');
//	Add the image to the element
	this.setInput(_input,_element);
	
//		Read the uploaded image and send to callback
	_input.addEventListener('change',function(){
		
		var _file	=	_input.files[0];
		var _reader	=	new FileReader();

		_reader.onload	=	function(e){
			//Return a proper chunked version to the user
			callbacks.done&&callbacks.done(
				_this.chunk(_file,e.target.result)
			);
		}

		_reader.readAsDataURL(_file);
		
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
	input.style.bottom		=	this.getStyle(element,'bottom');
	input.style.right		=	this.getStyle(element,'right');
	input.style.margin		=	this.getStyle(element,'margin');
	input.style.borderRadius	=	this.getStyle(element,'borderRadius');
	input.style.zIndex	=	10000;
			
	console.log(element,input);
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

Filar.prototype.chunk	=	function(file,base64){
	var	_headerData	=	{
		name:file.name,
		size:file.size,
		chunkSize:CHUNK_SIZE,
		type:file.type,
		ext:''
	};
	
	var _chunkData	=	{
		header:_headerData,	//Because objects are passed by reference
		data:[]
	};
	
	
	//The only place the extension is in the name
	var _nameArray	=	file.name.split('.');
	if(_nameArray.length>1){
		_headerData.ext	=	_nameArray[_nameArray.length-1];
	}
	_headerData.name	=	_nameArray[0];
	
	//Since this data is like data:;base64,jehr7g839 blah blah. 
	//The header is data:;base64
	_chunkData.header	=	_headerData;
	//this is the actual data 8utifdhgfdouaw8e
	var _base64Raw	=	base64.split(',')[1];
	
	
	
	
	var	_numChunks	=	parseInt(base64.length/CHUNK_SIZE);
	//get rid of this if the chunk size is bigger than the string itself
	if(_numChunks===0){
		_chunkData.data	=	[base64];
		return _chunkData;		
	}
	
	for(var i = 0;i<_numChunks;i++){
		_chunkData.data.push(
			_base64Raw.substr(
				(i*CHUNK_SIZE),	//start at the chunk
				CHUNK_SIZE	// It's only as big as the chunk, substr will reconcile overflow.
			)
		);
	}
	return _chunkData;
}
window.Filar=Filar
})(window);