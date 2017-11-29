runCam = function(character){

//declare canvas settings
var final_canvas;
var final_sharecanvas;
var final_context;
var final_sharecontext;
var imageData;
var data;
var mobileImg;

final_canvas = document.createElement('canvas');

final_canvas.width  = 600;//$('.my_camera_html').width();
final_canvas.height = 600;

final_context = final_canvas.getContext('2d');

$('#file-input').change(function(e) {
	console.log(true);
    $('.preload-result').show();
	
    //clear previous element
    $('#my_result *').remove();
    $('#my_result').html('<canvas id="canvas"></canvas>');
	
	$('.pre').show();
	$('.wrap.result').fadeIn();
	$('.wrap.start').fadeOut();

    var file = e.target.files[0],
    imageType = /image.*/;

    if (!file.type.match(imageType))
        return;

    var reader = new FileReader();

    //step 1, orient photo
    reader.onload = function (e) {

        var image = $('<img/>');
        image.on('load', function () {

          EXIF.getData(file,function() {
            var orientation = EXIF.getTag(this,"Orientation");
            var can = document.createElement("canvas");
            var ctx = can.getContext('2d');
            var thisImage = new Image;
            thisImage.onload = function() {
              can.width  = thisImage.width;
              can.height = thisImage.height;
              ctx.save();
              var width  = can.width;  var styleWidth  = can.style.width;
              var height = can.height; var styleHeight = can.style.height;
              if (orientation) {
                if (orientation > 4) {
                  can.width  = height; can.style.width  = styleHeight;
                  can.height = width;  can.style.height = styleWidth;
                }
                switch (orientation) {
                case 2: ctx.translate(width, 0);     ctx.scale(1); break;
                case 3: ctx.translate(width,height); ctx.rotate(Math.PI); break;
                case 4: ctx.translate(0,height);     ctx.scale(1); break;
                case 5: ctx.rotate(0.5 * Math.PI);   ctx.scale(1); break;
                case 6: ctx.rotate(0.5 * Math.PI);   ctx.translate(0,-height); break;
                case 7: ctx.rotate(0.5 * Math.PI);   ctx.translate(width,-height); ctx.scale(0); break;
                case 8: ctx.rotate(-0.5 * Math.PI);  ctx.translate(-width,0); break;
                }
              }

              ctx.drawImage(thisImage, 0, 0);
              ctx.restore();
              var dataURL = can.toDataURL('image/png');

              // at this point you can save the image away to your back-end using 'dataURL'
              finalImg(dataURL);  
            };

            // now trigger the onload function by setting the src to your HTML5 file object (called 'file' here)
            thisImage.src = URL.createObjectURL(file);
          });
            
        });
        image.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
  });
  
  //step 2, draw photo into image
  finalImg = function(e){
    //console.log(e);

    var image2 = $('<img/>');
    image2.on('load', function () {
      var square = 290;
      var canvas = document.createElement('canvas');
	  //console.log(canvas);
      //canvas.attr('id','canvase');
      canvas.width = square;
      canvas.height = square;
      
      var final_context = canvas.getContext('2d');
      final_context.clearRect(0, 0, square, square);
      var imageWidth;
      var imageHeight;
      var offsetX = 0;
      var offsetY = 0;

      if (this.width > this.height) {
          imageWidth = Math.round(square * this.width / this.height);
          imageHeight = square;
          offsetX = - Math.round((imageWidth - square) / 2);
      } else {
          imageHeight = Math.round(square * this.height / this.width);
          imageWidth = square;   
          offsetY = - Math.round((imageHeight - square) / 2);       
      }
      
      final_context.drawImage(this, offsetX, offsetY, imageWidth, imageHeight);

	switch (character) {
                case 1: imageData = final_context.getImageData(-5, -5, final_canvas.width, final_canvas.height); break;
				case 2: imageData = final_context.getImageData(-305, -5, final_canvas.width, final_canvas.height); break;
				case 3: imageData = final_context.getImageData(-5, -305, final_canvas.width, final_canvas.height); break;
				case 4: imageData = final_context.getImageData(-305, -305, final_canvas.width, final_canvas.height); break;
		}
      data = imageData.data;
    
      setCustom(data);
	  setCustomShare(data, character);
    });
    image2.attr('src', e);
  };
  
  
$('.camera .btn').click(function(){
	$(this).parent().css('padding','0');
	$(this).hide();
	$(this).parent().parent().find('.upload, .or').hide();
	$(this).parent().find('.capture').fadeIn();
	
	Webcam.set({
    width: 500,
    height: 375,
    // dest_width: 640,
    // dest_height: 480,
    crop_width: 290,
    crop_height: 290,
    image_format: 'png',
    jpeg_quality: 100,
    force_flash: false,
    flip_horiz: true,
    fps: 45,
  });
  
  
  Webcam.attach( '#my_camera' );

  take_snapshot = function() {
	console.log('snapshot');
	$('.pre').show();
	$('.wrap.result').fadeIn();
	$('.wrap.start').fadeOut();
    Webcam.snap( function(data_uri, canvas, context) {
     
	  switch (character) {
		  case 1:final_context.drawImage(canvas, 5, 5, 290, 290); break;
		  case 2:final_context.drawImage(canvas, 305, 5, 290, 290); break;
		  case 3:final_context.drawImage(canvas, 5, 305, 290, 290); break;
		  case 4:final_context.drawImage(canvas, 305, 305, 290, 290); break;
	  }
     
      imageData = final_context.getImageData(0,0, final_canvas.width, final_canvas.height);
      data = imageData.data;

      setCustom(data);
	  setCustomShare(data, character);
    
    });
	
  };
})


/////////  SHARE START  \\\\\\\\\\\\

function setCustomShare(e, character){
	final_sharecanvas = document.createElement('canvas');
	final_sharecanvas.width  = 1200;//$('.my_camera_html').width();
	final_sharecanvas.height = 630;
	final_sharecontext = final_sharecanvas.getContext('2d');
	
	var shareImg;
	var imgNumbers;
	//console.log(character);
	final_sharecontext.putImageData(imageData, 15, 15);
  	final_sharecontext.globalCompositeOperation='destination-over';
	
	
		var s1 = new Image();
		s1.crossOrigin = "anonymous";
		s1.onload = function () {
	
		//final_context.globalCompositeOperation = 'darken';
		final_sharecontext.drawImage(s1, 15, 15, 300, 300);
	
		var s2 = new Image();
		s2.crossOrigin = "anonymous";
		s2.onload = function () {
	
		  //final_context.globalCompositeOperation = 'source-over';
		  final_sharecontext.drawImage(s2, 315, 15, 300, 300);
	
		  var s3 = new Image();
		  s3.crossOrigin = "anonymous";
		  s3.onload = function () {
	
		  //final_context.globalCompositeOperation = 'screen';
		  final_sharecontext.drawImage(s3, 15, 315, 300, 300);
	
			  var s4 = new Image();
			  s4.crossOrigin = "anonymous";
			  s4.onload = function () {
			
				final_sharecontext.drawImage(s4, 315, 315, 300, 300);
				
				var s5 = new Image();
				  s5.crossOrigin = "anonymous";
				  s5.onload = function () {
			
				  //final_context.globalCompositeOperation = 'screen';
				  final_sharecontext.drawImage(s5, 640, 200, 542, 240);
				  
				  var bg = new Image();
					bg.crossOrigin = "anonymous";
					bg.onload = function (character) {
						
					//final_context.globalCompositeOperation = 'darken';
					final_sharecontext.drawImage(bg, 0, 0, 1200, 630);
			
					/* combine into image */
					document.getElementById('my_share').innerHTML = '<img src="' + final_sharecanvas.toDataURL('image/png') + '"/>';
			
					$('.result').fadeIn();
					//$('.capture').html('retake');
					$('.preload-result').hide();
			
					createShare();
					}
						switch (character) {
							  case 1:bg.src = "images/bg1.jpg?v2"; break;
							  case 2:bg.src = "images/bg2.jpg?v2"; break;
							  case 3:bg.src = "images/bg3.jpg?v2"; break;
							  case 4:bg.src = "images/bg4.jpg?v2"; break;
						  }
				  };
				s5.src = "images/text-join.png?v2";
				
			  };
	
			s4.src = "images/s4.png";
		  };
	
		  s3.src = "images/s3.png";
	
		};
	
		s2.src = "images/s2.png";
	
	  };
	  
	  s1.src = "images/s1.png";
	
}

/*set custom canvas assets*/
function setCustom(e){
console.log('set share');
var shareImg;
var imgNumbers;
  $('.preload-result').show();
  //$('.capture').html('Loading...');
  
  /* color setting

   for(var i = 0; i < data.length; i += 4) {
     var brightness = 1 * data[i] + 1 * data[i + 1] + 1 * data[i + 2];
      //red
     data[i] = brightness;
      //green
     data[i + 1] = brightness;
      //blue
     data[i + 2] = brightness;
   }
   
   var r = 255, // Red tint (0-255)
    g = 0, // Green tint (0-255)
    b = 0, // Blue tint (0-255)
    t = .2, // Tint strength (0-1)
    i,
    len = data.length; // Length of data array.
	
	for (i = 0; i < len;) {
    data[i] = data[i++] * (1-t) + (r*t);
    data[i] = data[i++] * (1-t) + (g*t);
    data[i] = data[i++] * (1-t) + (b*t);
    i++; //data[i] = data[i++] * 1 + 0; << skip alpha component. Adjust as needed.
	}
  */
   
  final_context.putImageData(imageData, 0, 0);
  final_context.globalCompositeOperation='destination-over';

  /* filter settings */

  //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  //final_context.globalCompositeOperation = 'destination-over';

  /* asset settings */

  var s1 = new Image();
  s1.crossOrigin = "anonymous";
  s1.onload = function () {

    //final_context.globalCompositeOperation = 'darken';
    final_context.drawImage(s1, 0, 0, 300, 300);

    var s2 = new Image();
    s2.crossOrigin = "anonymous";
    s2.onload = function () {

      //final_context.globalCompositeOperation = 'source-over';
      final_context.drawImage(s2, 300, 0, 300, 300);

      var s3 = new Image();
      s3.crossOrigin = "anonymous";
      s3.onload = function () {

      //final_context.globalCompositeOperation = 'screen';
      final_context.drawImage(s3, 0, 300, 300, 300);

		  var s4 = new Image();
		  s4.crossOrigin = "anonymous";
		  s4.onload = function () {
	
		  //final_context.globalCompositeOperation = 'screen';
		  final_context.drawImage(s4, 300, 300, 300, 300);
	
			/* combine into image */
			document.getElementById('my_result').innerHTML = '<img src="' + final_canvas.toDataURL('image/png') + '"/>';
	
			$('.result').fadeIn();
			//$('.capture').html('retake');
			$('.preload-result').hide();
	
			//createShare();
		  };

      	s4.src = "images/s4.png";
      };

      s3.src = "images/s3.png";

    };

    s2.src = "images/s2.png";

  };
  
  s1.src = "images/s1.png";
}

/* set onclick functions */
$(".save").click(function() {
    html2canvas($("#my_result"), {
        onrendered: function(canvas) {
            theCanvas = canvas;
            canvas.toBlob(function(blob) {
              var newImg = document.createElement("img"),
                  url = URL.createObjectURL(blob);

              newImg.onload = function() {
                // no longer need to read the blob so it's revoked
                URL.revokeObjectURL(url);
              };

              newImg.src = url;
                //$('#my_result').prepend(newImg);
                saveAs(blob, "gorillaz.png");
				
            });
        }
    });
});

$('.capture').click(function(){
});

	function createShare() {
		
		$('.pre').fadeOut();
		$('#shareWrap').fadeIn();
	
		html2canvas($("#my_result"), {
			onrendered: function(canvas) {
			//console.log('ajax sent');
			var img = final_sharecanvas.toDataURL("image/png");
			var imgdata = img.replace(/^data:image\/(png|jpg);base64,/, "");
			//var output = encodeURIComponent(img);
				
				$('a.share').removeClass('loading');
				// $.ajax({
				// 	url: "https://sk-photo-app.herokuapp.com/phpconnect.php",
				// 	data: {
				// 		imgdata:imgdata
				// 	},
				// 	type: "POST",
				// 	success:function(data){
				// 		var str = data;
				// 		shareImg = str.replace(/[\\"]/g, "");
				// 		$('a.share').removeClass('loading');

    // 				imgNumbers = shareImg.replace(/[^0-9]/g, "").substring(1);
				// 	},
				// 	error:function(shr, status, data){
				// 		console.log("error " + data + " Status " + shr.status);
				// 		$('.sharebuttons').hide();
				// 	},
				// });
				//end ajax
			
			}
			//end on render
		});
		//end canvas to htm
		

		//share twitter
		function shareTwitter(){
			//console.log(shareImg);
			// var w = 626;
			// var h = 436;
			//  // eg share url: http://share.jointhehumanz.com/?1493347860339
			// var url = 'http://twitter.com/intent/tweet?text=I%27m%20joining%20Gorillaz%20on%20tour%20http%3A%2F%2Fshare.jointhehumanz.com%2F%3F'+imgNumbers;
			// var title = 'live.gorillaz.com';
			
			// var left = (screen.width / 2) - (w / 2);
			// var top = (screen.height / 2) - (h / 2);
			// window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		}
		
		$('#twitter').click(function(e){
			e.preventDefault();
			//shareTwitter();
		});
		
		$('#facebook').click(function(e){
			e.preventDefault();
			//console.log(shareImg);
			 //  FB.ui({
				//   method: 'feed',
				//  // name: 'Artist Name',
				//  // caption: 'Artist Caption',
				//  // description: ('Artist Description'),
				// //  picture: shareImg
				// link: 'http://share.jointhehumanz.com/?'+imgNumbers
			 //  },
			 //  function(response) {
				// //$('#facebook').text('Share on FB');
			 //  });
		});
		
	}	
	//end create share
	
	//facebook share
		// window.fbAsyncInit = function() {
		// 	FB.init({
		// 		appId : '1641539005860463',
		// 		xfbml : true,
		// 		version : 'v2.0',
		// 		status  : true
		// 	});
		// };
		
		// function shareFacebook() {
		  
		// }
		
		// (function(d, s, id){
		// 	 var js, fjs = d.getElementsByTagName(s)[0];
		// 	 if (d.getElementById(id)) {return;}
		// 	 js = d.createElement(s); js.id = id;
		// 	 js.src = "//connect.facebook.net/en_US/sdk.js";
		// 	 fjs.parentNode.insertBefore(js, fjs);
		// }(document, 'script', 'facebook-jssdk'));

}