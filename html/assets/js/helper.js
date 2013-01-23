
var $embed_overlay = '<div id="embed-overlay"><div id="embed-content"><h1>Weitergeben</h1><form name="embed-form" id="embed-form" action="javascript:;" method="post"><fieldset class="form-inline"><legend>Methode</legend><label class="radio"><input type="radio" name="method" value="iframe" checked="checked"> Iframe</label><label class="radio"><input type="radio" name="method" value="widget"> Widget (Javascript erforderlich)</label></fieldset><fieldset id="embed-size" class="form-inline"><legend>Größe</legend><label class="radio"><input type="radio" name="size" value="large" checked="checked"> Groß (860&times;670)</label><label class="radio"><input type="radio" name="size" value="medium"> Mittel (640&times;550)</label><label class="radio"><input type="radio" name="size" value="small"> Klein (520&times;420)</label></fieldset><fieldset class="form-inline"><legend>Sprache</legend><label class="radio"><input type="radio" name="lang" value="de" checked="checked"> Deutsch</label><label class="radio"><input type="radio" name="lang" value="en"> Englisch</label><label class="radio"><input type="radio" name="lang" value="auto"> <em>Automatisch</em></label></fieldset><h2>Code</h2><p>Kopiere diesen Code in Deine Webseite:</p><code id="embed-code"></code></form><p><a href="javascript:;" class="btn btn-medium btn-primary">Schließen</a></p></div></div>';

$(document).ready(function(){
	$('#share-twitter').click(function(evt){
		evt.preventDefault();
		window.open($(this).attr('href'), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=no,toolbar=no");	
		return false;
	});
	$('#share-facebook').click(function(evt){
		evt.preventDefault();
		window.open($(this).attr('href'), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=no,toolbar=no");	
		return false;
	});
	$('#share-google').click(function(evt){
		evt.preventDefault();
		window.open($(this).attr('href'), "share", "width=500,height=300,status=no,scrollbars=no,resizable=no,menubar=no,toolbar=no");	
		return false;
	});
	
	/* embed overlay code */
	
	$('body').append($($embed_overlay));

	$('#embed-button').click(function(evt){
		if ($('#embed-overlay:visible').length === 0) {
			$('#embed-overlay').fadeIn('fast');
		}
	});

	var $clickIn = false;
	$('#embed-overlay').click(function(evt){
		if (!$clickIn) {
			$('#embed-overlay').fadeOut('fast');
		}
		$clickIn = false;
	});
	$('#embed-form').click(function(evt){
		$clickIn = true;
	});

	/* embed code*/
	if ($('#embed-form').length) {
		var $f = $('#embed-form');
		var $url = location.protocol+'//'+location.hostname+location.pathname;
		if (!$url.match(/\/$/)) { $url += "/"; }
		var embedCode = function(){
			var $path = [];
			var $method = $('input:radio[name=method]:checked',$f).val();
			var $size = $('input:radio[name=size]:checked',$f).val();
			var $lang = $('input:radio[name=lang]:checked',$f).val();
			$lang = ($lang === "") ? "de" : $lang;
			$method = ($method === "") ? "iframe" : $method;
			$size = ($size === "") ? "large" : $size;
			if ($lang !== "auto") { $path.push($lang); }
			if ($method === "iframe") { $path.unshift($size); }
			$path.unshift($method);
			switch ($method) {
				case "iframe":
					$('#embed-size',$f).show();
					switch ($size) {
						case 'large': var $wh = 'width="860" height="670"'; break;
						case 'medium': var $wh = 'width="640" height="550"'; break;
						case 'small': var $wh = 'width="520" height="420"'; break;
					}
					var $code = '<iframe src="'+$url+$path.join('/')+'" '+$wh+' scrolling="no" allowtransparency="true" marginwidth="0" marginheight="0" border="0"><a href="'+$url+'">Die Top 1000 geblockten Youtube-Videos</a></iframe>';
				break;
				case "widget":
					$('#embed-size',$f).hide();
					var $code = '<div id="odc-youtube-widget"><script type="text/javascript" src="'+$url+$path.join('/')+'"></script><noscript><a href="'+$url+'">Die Top 1000 geblockten Youtube-Videos</a></noscript></div>';
				break;
			}
			$('#embed-code', $f).text($code);
		};
		embedCode();
		$(":input", $f).change(function(){
			embedCode();
		});
	}

});
