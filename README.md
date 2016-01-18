# Filar

A clean, pure javascript FileReader API wrapper.


Example HTML:
```HTML
	<div id="My_upload_image_icon"></div>
```
Example script:
```javascript
	var filar	=	new Filar();
	filar.attachImage('My_upload_image_icon',{
  	done:function(data){
			console.log(data);
		},
		error:function(err){
			//Incase it's not an image
			if(err.code===1) alert("Dude, that's not an Image"); 
		}
	}); 
	
	//Success Outputs {header:'data:image',data:[Array 7]}
	
```