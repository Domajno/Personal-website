/* $Id: lightbox_video.js,v 1.1.2.3 2008/05/02 18:42:32 snpower Exp $ */

/**
 * Lightbox video
 * @author
 *   Stella Power, <http://drupal.org/user/66894>
 */

/**
 * Table of Contents
 * -----------------
 * Lightvideo Class Declaration
 * - startVideo()
 * - createEmbed()
 * - checkKnownVideos()
 *
 * Video Provider Functions
 * - checkYouTubeVideo()
 * - checkGoogleVideo()
 * - checkMetacafeVideo()
 * - checkIFilmSpikeVideo()
 * - checkMySpaceVideo()
 * - checkLiveVideo()
 *
 */


var Lightvideo = {

  // startVideo()
  startVideo: function (href) {
    if (Lightvideo.checkKnownVideos(href)) {
      return;
    }
    else if (href.match(/\.mov/i)) {
      if (navigator.plugins && navigator.plugins.length) {
        Lightbox.videoHTML ='<object id="qtboxMovie" type="video/quicktime" codebase="http://www.apple.com/qtactivex/qtplugin.cab" data="'+href+'" width="'+Lightbox.videoWidth+'" height="'+Lightbox.videoHeight+'"><param name="src" value="'+href+'" /><param name="scale" value="aspect" /><param name="controller" value="true" /><param name="autoplay" value="true" /><param name="bgcolor" value="#000000" /><param name="enablejavascript" value="true" /></object>';
      } else {
        Lightbox.videoHTML = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="'+Lightbox.videoWidth+'" height="'+Lightbox.videoHeight+'" id="qtboxMovie"><param name="src" value="'+href+'" /><param name="scale" value="aspect" /><param name="controller" value="true" /><param name="autoplay" value="true" /><param name="bgcolor" value="#000000" /><param name="enablejavascript" value="true" /></object>';
      }
    }
    else if (href.match(/\.wmv/i) || href.match(/\.asx/i)) {
      Lightbox.videoHTML = '<object NAME="Player" WIDTH="'+Lightbox.videoWidth+'" HEIGHT="'+Lightbox.videoHeight+'" align="left" hspace="0" type="application/x-oleobject" CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"><param NAME="URL" VALUE="'+href+'"><param><param NAME="AUTOSTART" VALUE="false"></param><param name="showControls" value="true"></param><embed WIDTH="'+Lightbox.videoWidth+'" HEIGHT="'+Lightbox.videoHeight+'" align="left" hspace="0" SRC="'+href+'" TYPE="application/x-oleobject" AUTOSTART="false"></embed></object>';
    }
    else {
      Lightbox.videoId = href;
      Lightvideo.createEmbed(href, "flvvideo", "#ffffff");
    }
  },

  // createEmbed()
  createEmbed: function(href, id, color, variables) {
    var bgcolor = 'bgcolor="' + color + '"';
    var flashvars = "";
    if (variables) {
      flashvars = variables;
    }

    Lightbox.videoHTML = '<embed type="application/x-shockwave-flash" '
      +'src="' + href + '" '
      + 'id="' + id + '" name="' + id + '" ' + bgcolor + ' '
      + 'quality="high" wmode="transparent" ' + flashvars + ' '
      + 'height="' + Lightbox.videoHeight + '" '
      + 'width="' + Lightbox.videoWidth + ' '
      + '">';
  },


  // checkKnownVideos()
  checkKnownVideos: function(href) {
    if (Lightvideo.checkYouTubeVideo(href) || Lightvideo.checkGoogleVideo(href)
      || Lightvideo.checkMySpaceVideo(href) || Lightvideo.checkLiveVideo(href)
      || Lightvideo.checkMetacafeVideo(href)
      || Lightvideo.checkIFilmSpikeVideo(href)
      ) {
      return true;
    }
    return false;
  },


  // checkYouTubeVideo()
  checkYouTubeVideo: function(href) {
    var patterns = new Array(
      'youtube.com/v/([^"&]+)',
      'youtube.com/watch\\?v=([^"&]+)',
      'youtube.com/\\?v=([^"&]+)');

    for (var i = 0; i < patterns.length; i++) {
      var pattern = new RegExp(patterns[i], "i");
      var results = pattern.exec(href);
      if (results != null) {
        Lightbox.videoId = results[1];
        Lightvideo.createEmbed("http://www.youtube.com/v/"+Lightbox.videoId, "flvvideo", "#ffffff");
        return true;
      }
    }
    return false;
  },

  // checkGoogleVideo()
  checkGoogleVideo: function(href) {
    var patterns = new Array(
      'http://video.google.[a-z]{2,4}/googleplayer.swf\\?docId=(-?\\d*)',
      'http://video.google.[a-z]{2,4}/videoplay\\?docid=([^&]*)&',
      'http://video.google.[a-z]{2,4}/videoplay\\?docid=(.*)');

    for (var i = 0; i < patterns.length; i++) {
      var pattern = new RegExp(patterns[i], "i");
      var results = pattern.exec(href);
      if (results != null) {
        Lightbox.videoId = results[1];
        Lightvideo.createEmbed("http://video.google.com/googleplayer.swf?docId="+Lightbox.videoId+"&hl=en", "flvvideo", "#ffffff");
        return true;
      }
    }
    return false;
  },

  // checkMetacafeVideo()
  checkMetacafeVideo: function(href) {
    var patterns = new Array(
      'metacafe.com/watch/(\.[^/]*)/(\.[^/]*)/',
      'metacafe.com/watch/(\.[^/]*)/(\.*)',
      'metacafe.com/fplayer/(\.[^/]*)/(\.[^.]*).');

    for (var i = 0; i < patterns.length; i++) {
      var pattern = new RegExp(patterns[i], "i");
      var results = pattern.exec(href);
      if (results != null) {
        Lightbox.videoId = results[1];
        Lightvideo.createEmbed("http://www.metacafe.com/fplayer/"+Lightbox.videoId+"/.swf", "flvvideo", "#ffffff");
        return true;
      }
    }
    return false;
  },

  // checkIFilmSpikeVideo()
  checkIFilmSpikeVideo: function(href) {
    var patterns = new Array(
      'spike.com/video/[^/&"]*?/(\\d+)',
      'ifilm.com/video/[^/&"]*?/(\\d+)',
      'spike.com/video/([^/&"]*)',
      'ifilm.com/video/([^/&"]*)');

    for (var i = 0; i < patterns.length; i++) {
      var pattern = new RegExp(patterns[i], "i");
      var results = pattern.exec(href);
      if (results != null) {
        Lightbox.videoId = results[1];
        Lightvideo.createEmbed("http://www.spike.com/efp", "flvvideo", "#000", "flashvars=\"flvbaseclip="+Lightbox.videoId+"&amp;\"");
        return true;
      }
    }
    return false;
  },

  // checkMySpaceVideo()
  checkMySpaceVideo: function(href) {
    var patterns = new Array(
      'src="myspace.com/index.cfm\\?fuseaction=vids.individual&videoid=([^&"]+)',
      'myspace.com/index.cfm\\?fuseaction=vids.individual&videoid=([^&"]+)',
      'src="myspacetv.com/index.cfm\\?fuseaction=vids.individual&videoid=([^&"]+)"',
      'myspacetv.com/index.cfm\\?fuseaction=vids.individual&videoid=([^&"]+)');

    for (var i = 0; i < patterns.length; i++) {
      var pattern = new RegExp(patterns[i], "i");
      var results = pattern.exec(href);
      if (results != null) {
        Lightbox.videoId = results[1];
        Lightvideo.createEmbed("http://lads.myspace.com/videos/vplayer.swf", "flvvideo", "#ffffff", "flashvars=\"m="+Lightbox.videoId+"\"");
        return true;
      }
    }
    return false;
  },

  // checkLiveVideo()
  checkLiveVideo: function(href) {
    var patterns = new Array(
      'livevideo.com/flvplayer/embed/([^"]*)"',
      'livevideo.com/video/[^/]*?/([^/]*)/',
      'livevideo.com/video/([^/]*)/');

    for (var i = 0; i < patterns.length; i++) {
      var pattern = new RegExp(patterns[i], "i");
      var results = pattern.exec(href);
      if (results != null) {
        Lightbox.videoId = results[1];
        Lightvideo.createEmbed("http://www.livevideo.com/flvplayer/embed/"+Lightbox.videoId, "flvvideo", "#ffffff");
        return true;
      }
    }
    return false;
  }

};
