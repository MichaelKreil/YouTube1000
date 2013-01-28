
var $embed_overlay = '<div id="embed-overlay"><div id="embed-content"><h1>Weitergeben</h1><form name="embed-form" id="embed-form" action="javascript:;" method="post"><fieldset id="embed-size" class="form-inline"><legend>Größe</legend><label class="radio"><input type="radio" name="size" value="large" checked="checked"> Groß (860&times;610)</label><label class="radio"><input type="radio" name="size" value="medium"> Mittel (640&times;490)</label><label class="radio"><input type="radio" name="size" value="small"> Klein (520&times;370)</label></fieldset><fieldset class="form-inline"><legend>Sprache</legend><label class="radio"><input type="radio" name="lang" value="de" checked="checked"> Deutsch</label><label class="radio"><input type="radio" name="lang" value="en"> Englisch</label></fieldset><h2>Code</h2><p>Kopiere diesen Code in Deine Webseite:</p><code id="embed-code"></code></form><p><a href="javascript:;" class="btn btn-medium btn-primary">Schließen</a></p></div></div>';

$(document).ready(function(){
	
	/* embed overlay code */
	
	$('body').append($($embed_overlay));

	$('.embed-button').click(function(evt){
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
		var $url = 'http://apps.opendatacity.de/gema-vs-youtube/';
		var embedCode = function(){
			var $size = $('input:radio[name=size]:checked',$f).val();
			var $lang = $('input:radio[name=lang]:checked',$f).val();
			$lang = ($lang === "") ? "de" : $lang;
			$size = ($size === "") ? "large" : $size;

			if ($lang == "de") {
				var text   = 'Die geblockten Top-1000-YouTube-Videos';
				var suffix = 'Powered by <a href="http://www.myvideo.de">MyVideo</a>. Realisiert von <a href="http://www.opendatacity.de/">OpenDataCity</a>. Anwendung steht unter <a rel="license" href="http://creativecommons.org/licenses/by/3.0/de/">CC-BY 3.0</a>.';
				var file   = 'frame.de.html';
			} else {
				var text   = 'Top 1000 YouTube Videos';
				var suffix = 'Powered by <a href="http://www.myvideo.de">MyVideo</a>. Made by <a href="http://www.opendatacity.de/">OpenDataCity</a>. This App is under <a rel="license" href="http://creativecommons.org/licenses/by/3.0/us/">CC-BY 3.0</a>.';
				var file   = 'frame.en.html';
			}

					$('#embed-size',$f).show();
					switch ($size) {
						case 'large':  var $wh = 'width="860" height="610"'; break;
						case 'medium': var $wh = 'width="640" height="490"'; break;
						case 'small':  var $wh = 'width="520" height="370"'; break;
					}
					var $code = '<iframe src="'+$url+file+'" '+$wh+' scrolling="no" frameborder="0"><a href="'+$url+'">'+text+'</a></iframe><p>'+suffix+'</p>';
			$('#embed-code', $f).text($code);
		};
		embedCode();
		$(":input", $f).change(function(){
			embedCode();
		});
	}

});
