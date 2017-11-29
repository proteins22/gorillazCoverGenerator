$(document).ready(function() {
	var me;
	
	var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS');

	//if mobile
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 800) {
	$('body').addClass('mobileView');
	  //if safari
	  if(isSafari){
		$('body').addClass('safari');
	  } 
	}
	else{
		if (Webcam.userMedia === false){
			console.log('no webcam available')
			$('body').addClass('no-webcam');
		}
		if (navigator.getUserMedia) { 
		success = function(){
			console.log('camera ready');
		}
		error = function(){
			console.log('no webcam available')
			$('body').addClass('no-webcam');
		}
   		 navigator.getUserMedia({video:true, audio:false}, success, error);
		} else {
		}
	}
	
	resetInit = function(){
		console.log('reset all');
		$('form').html('');
		$('.camera').find('#my_camera').remove();
		$('.select').removeClass('active unclickable');
		
		$('.camera').removeAttr('style');
		$('.camera .btn').show();
		$('.camera').parent().find('.upload, .or').show();
		$('.camera').find('.capture').fadeOut();
		shareImg = null;
		$('a.share').addClass('loading');
		$('.sharebuttons').show();
		$('.pre').hide();
	}

	
	$(document).on("click", ".select:not(.unclickable)", function() {
		resetInit();
		$(this).each(function() {
			$(this).addClass('active unclickable');
			$(this).find('.camera').prepend('<div id="my_camera"></div>');
			$(this).find('form').append('<input type="file" name="file" class="button" id="file-input" accept="image/*" ><label for="file-input"><i class="fa-cloud-upload fa"></i> Choose a file</label>');
			if($(this).hasClass('twod')){
				me = 1;
				$('.bgwrap div.twod-bg').fadeIn();
				$('.bgwrap div:not(.twod-bg)').fadeOut()
			}
			if($(this).hasClass('noodle')){
				me = 2;
				$('.bgwrap div.noodle-bg').fadeIn();
				$('.bgwrap div:not(.noodle-bg)').fadeOut()
			}
			if($(this).hasClass('rus')){
				me = 3;
				$('.bgwrap div.rus-bg').fadeIn();
				$('.bgwrap div:not(.rus-bg)').fadeOut()
			}
			if($(this).hasClass('murdoc')){
				me = 4;
				$('.bgwrap div.murdoc-bg').fadeIn();
				$('.bgwrap div:not(.murdoc-bg)').fadeOut()
			}

		});
	
    /*$('.test').click(function(){
		$(this).siblings().find('#my_camera').remove();
		$(this).find('form').append('<input type="file" placeholder="Select an image" class="button" id="file-input" accept="image/*" >');
		$(this).prepend('<div id="my_camera"></div></div>');
		
		me=3;*/
		console.log(me);
		runCam(me);
	});
	
	$('.reset').click(function(){
		resetInit();
		$('.wrap.result').fadeOut();
		$('.wrap.start').fadeIn();
		$('.pre').fadeIn();
		$('#shareWrap').fadeOut();
	});
});