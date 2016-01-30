/*
	Filar v0.0.1
	author: Joseph Thomas
	Date:	Jan 17, 2016
*/



//Every 3 bytes is encoded as 4 bytes of base64
//Thus, the chunk size must be a multiple of 4
	
var CHUNK_SIZE	=	3600;


/*
*	Filar Constructor
*	
*	@param	{JSON Object}	options
*		@key	{Integer}	maxSize	-	The max file size, uploadeable, need to check on server side too 
*
*	@return {Filar Object}
*/

function Filar(options){
	this.maxSize	=	options.maxSize||10E6	//set the default max size as 10MB
	
	return this;
};


/*
*	Filar	attachImage	-	allows an element to recieve image uploads
*	
*	@param	{String}	id	- the HTML id of the element
*	@param	{Function}	callback	-	the callback
*		@param	{JSON Object}	data
*			@key	{String}	full	-	the full amount of base64 for resiszing
*			@key	{JSON Object}	header	-	a header to upload it to the server (see the objectfor more info)
*			@key	{Array}	chunks	-	a bunch of chunks
*/

Filar.prototype.attachImage	=	function(id,callbacks){
	var _this	=	this;
	var _element	=	document.getElementById(id);

	//The input is set to visible and set in front of the element. 
	//So, people beleieve they're clicking on an image
	var _input	=	document.createElement('input');
	this.setInput(_input,_element,true);

	//When something changes, it means someone's tryna upload something
	_input.addEventListener('change',function(){
		
		//This is not a multifile uploader
		[].forEach.call(_input.files,function(_file){
			//And, this input is for images only!
			if(_file.type.match('image.*')){

				//Create a reader
				var _reader	=	new FileReader();
				//The reader has finished reading the files
				_reader.onload	=	function(e){

					callbacks.done&&callbacks.done(_this.chunk(_file,e.target.result	));

				}
				//Reader reads the file
				_reader.readAsDataURL(_file);	
			}else{
	//			Tell the user it's not a real image
				callbacks.error&&callbacks.error({code:1,error:'Not Image'});
			}
		});
		
	});

}
/*
*	Filar	attachFile	-	allows an element to recieve file uploads
*	
*	@param	{String}	id	- the HTML id of the element
*	@param	{Function}	callback	-	the callback
*		@param	{JSON Object}	data
*			@key	{String}	full	-	the full amount of base64 for resiszing
*			@key	{JSON Object}	header	-	a header to upload it to the server (see the objectfor more info)
*			@key	{Array}	chunks	-	a bunch of chunks
*/

Filar.prototype.attachFile	=	function(id,callbacks){
	var _this	=	this;
	var _element	=	document.getElementById(id);

	//The input is set to visible and set in front of the element. 
	//So, people beleieve they're clicking on an image
	var _input	=	document.createElement('input');
	this.setInput(_input,_element,false);

	//When something changes, it means someone's tryna upload something
	_input.addEventListener('change',function(){
		
		//This is not a multifile uploader
		[].forEach.call(_input.files,function(_file){
			//Create a reader
			var _reader	=	new FileReader();
			//The reader has finished reading the files
			_reader.onload	=	function(e){

				callbacks.done&&callbacks.done(_this.chunk(_file,e.target.result	));

			}
			//Reader reads the file
			_reader.readAsDataURL(_file);	
		});
		
	});

}

Filar.prototype.setInput	=	function(input,element,image){
	//	make sure the input has the basic properties
	input.type	=	'file';
	input.multiple	=	'true';
	
	//Only if this is an image input
	image&&(input.accept	=	"image/*");
	
	element.style.display	=	'none';	//this way any display based properties are in their % form
	//	make the input exactly the same as the element
	var _eStyle	=		window.getComputedStyle(element).cssText;
	input.style.cssText	=	_eStyle;
	element.style.display	=	'block';	//Look, nothing happened
	input.style.display	=	'block';	//Hah, we also copied the display properties by accident
	
	//Now make sure it stands out, but is invisible
	input.style.opacity	=	'0';
	input.style.zIndex	=	10000;
			
	element.parentNode.insertBefore(input,element);
}




Filar.prototype.chunk	=	function(file,base64){
	
	//We don't want that weird part from the beginning
	base64	=	base64.split(',')[1];
	
	var	_headerData	=	{
		fileName:file.name,
		fileSize:file.size,
		chunkSize:CHUNK_SIZE,
		chunkAmount:0,
		fileType:file.type,
		fileExtension:''
	};
	
	var _chunkData	=	{
		header	:	_headerData,	//Because objects are passed by reference
		full	:	base64,
		data	:	[]
	};
	
	if(_headerData.fileName.split('.').length>1){
		_headerData.fileExtension	=	_headerData.fileName.split('.').pop();
	}

	if(base64<=CHUNK_SIZE){
		_chunkData.data	=	[base64];
		return _chunkData;
	}
	
	_chunkData.data	=	chunkString(base64,CHUNK_SIZE);
	_headerData.chunkAmount	=	_chunkData.data.length;
	
	return _chunkData;
}



function chunkString(str, len) {
  var _size = Math.ceil(str.length/len),
      _ret  = new Array(_size),
      _offset
  ;

  for (var _i=0; _i<_size; _i++) {
    _offset = _i * len;
    _ret[_i] = str.substring(_offset, _offset + len);
  }

  return _ret;
}