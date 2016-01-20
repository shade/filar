var io 	=	require('socket.io')(80);
var fs	=	require('fs');
var crypto	=	require('crypto');

var MAX_CONCURRENT_FILES	=	10;
var MAX_FILESIZE	=	5E7;	//50 Mb
var MAX_CHUNKSIZE	=	4E3;	//4	Kb
var CLEARING_ID;

var FILES_DIR	=	'/public/files/';


io.on('connection',function(socket){
	
	
	socket.on('chunk',function(data){
		var file	=	global.files[data.token];
		//Don't wanna get a file that doesn't eist
		if(file	==	undefined)
			return res.send('[TOKEN_INVALID]');
		
		//Whoa, this chunk is wayy too big.
		if(data.chunk.length>file.chunkSize)
			return res.send('[CHUNK_TOO_BIG]');
		
		//Add the chunk to the file
		fs.appendFileSync(file.location,atob(data.chunk));
		
		//Make sure it's not too big.
		var stats	=	fs.fstatSync(fs.openSync(file.location,'a'));
		
		if(stats.size>file.fileSize){
			//too big, so might as well get rid of it.
			fs.unlink(file.location,function(){
				delete file;
			});
			return res.send('[FILE_TOO_BIG]');
		}
		if(stats.size===file.fileSize){
			//Build a handler for the file.
		}
		//Update so we won't delete it.
		file.updateTime	=	Date.now();
	});
	
	
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
		
		//because '/' is one of the 64 characters, replace with '_'
		var token	=	crypto.randomBytes(12).toString('base64').replace(/\//g,'_');
		//In case there are any collisions
		while(global.files[token])
			token	=	crypto.randomBytes(12).toString('base64').replace(/\//g,'_');
		
		var _fileLocation	=	FILES_DIR+token;
		//This lets other recievers append and upload the file properly
		global.files[token]	=	{
			name	:	data.fileName,
			ext		:	data.fileExtension,
			chunkSize	:	data.chunkSize,
			fileSize	:	data.fileSize,
			location	:	_fileLocation,
			updateTime	:	Date.now()	//So we can get rid of them.
		}
		
		fs.writeFile(_fileLocation,'');
		//Let the client verify he's sending the right file when he sends a token
		socket.emit('fileHeaderResponse',{
			response	:	'good',
			token	:	token
		});
		
		//Don't let this guy get away with sending a file
		global.sockets[socket.id].files++;
	});
	
	
	
	
});

CLEARING_ID	=	setInterval(function(){
	var time	=	Date.now()-300000;	//Subtract 5min from the current time
	
	for(var token	in global.files){
		//If the thing hasn't been updated in 5min, kill it. We don't wanna waste RAM
		if(global.files[token].updateTime>time){
			delete global.files[token];	
		}
	}
},60000);