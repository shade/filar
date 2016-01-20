var socket	=	new WebSocket();

var filar	=	new Filar().attachFile('.fileIcon',{
	done:function(file){
		socket.emit('fileHeader',file.header);
	}
});

socket.on('headerAnswer',function(token){
		file.token	=	token;
		socket.emit('chunk',{
			token:token,
			number:0,
			data:file.data[0]
		});
});

socket.on('fileAnswer',function(res){
	//needs error handling
	if(res.error!=='none'||res.token==file.token)
		return;
	//If that was the last chunk
	if(file.number.length===++file.number){	
	}
});


