# Filar

An easy to use, clean, pure javascript FileReader API wrapper.

## How to use
Add an icon to upload images to your HTML
```HTML
	<html>
		<!--- This looks like a camera --->
		<div id="camerIcon"></div>	
		<script src="filar.min.js">
	</html>
```

Attach the filar object to it
```javascript
	var	filar	=	new Filar();
	filar.attachImage('cameraIcon',{
		done:function(data){
			console.log(data);
		}
	});
	//Success Outputs {full:"823uywerhfjdkg...",header:'data:image',data:[Array 7]}
```
##API