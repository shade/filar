var io 	=	require('socket.io')(80);
var fs	=	require('fs');
var crypto	=	require('crypto');

var MAX_CONCURRENT_FILES	=	10;
var MAX_FILESIZE	=	5E7;	//50 Mb
var MAX_CHUNKSIZE	=	4E3;	//4	Kb
var FILES_DIR	=	'/public/files/';


io.on('connection',function(socket){
	
	
	socket.on('fileHeader',function(data){
		 
		//Because we don't someone trying to upload 1000 files at once
		if(global.sockets[socket.id].files>MAX_CONCURRENT_FILES)
			return res.send('[TOO_MANY_FILE]');
		
		//We need to make sure that everything is okay later, during the uplaod
		if(data.chunkSize>MAX_CHUNKSIZE)
			return res.send('[CHUNKS_TOO_BIG]');
		if(data.chunkSize<=0)
			return res.send('[CHUNKS_TOO_SMALL]');
		if(data.fileSize>MAX_FILESIZE)
			return res.send('[FILE_TOO_BIG]');
		if(data.fileSize<=0)
			return res.send('[FILE_TOO_SMALL]');
		
		
		var token	=	crypto.randomBytes(10).toString('hex');
		//In case there are any collisions
		while(global.files[token])
			token	=	crypto.randomBytes(10).toString('hex');
		
		var _fileLocation	=	FILES_DIR+token;
		//This lets other recievers append and upload the file properly
		global.files[token]	=	{
			name	:	data.fileName,
			ext		:	data.fileExtension,
			chunkSize	:	data.chunkSize,
			fileSize	:	data.fileSize,
			location	:	_fileLocation
		}
		
		fs.writeFile(_fileLocation,'');
		//Let the client verify he's sending the right file when he sends a token
		socket.emit('fileHeaderResponse',{
			response	:	'good',
			token	:	token
		})
	});
	
	
	
	
});
