(function() {
/*
    Variables
*/
var language = "en-US";
var theme = "dark";
var queue = Array();
var fq = Array();
var uploading = false;
/*
    Translations?
*/
var phrases = {
    "Tags": "Tags:",
    "LoadingTags": "Loading tags...",
    "FetchingTags": "Fetching tags...",
    "NoTagsFound": "No tags found.",
    "ThereAreStill": "There are still ",
    "FilesBeingUploaded": " files being uploaded.",
    "Uploading": "Uploading... ",
    "Error": "Error ",
    "DuringUploadOfFile": " during upload of file ",
    "Open": "Open",
    "SuggestedTags": "Suggested Tags",
    "Untag": "Untag",
    "UploadSuccess": "Upload Success!"
};
function linguist(key, arg1, arg2) {
	if (language == "en-US") {
	    switch(key) {
    		case "Tags":
    		case "LoadingTags":
    		case "FetchingTags":
    		case "NoTagsFound":
    		case "Open":
    		case "SuggestedTags":
    		case "Untag":
    		//
    		    return phrases[key];
    		    break;
    		case "ThereAreStillFilesBeingUploaded":
    		    return phrases.ThereAreStill + arg1 +
                    phrases.FilesBeingUploaded;
    		    break;
    		case "Uploading":
    		    return phrases.Uploading + arg1;
    		    break;
    		case "ErrorDuringUploadOfFile":
    		    return phrases.Error + "(" + arg1 + ")" +
                    phrases.DuringUploadOfFile + arg2;
    		    break;
    		case "Success":
    		    return arg1 + ": " + phrases.UploadSuccess;
    		    break;
    		default:
    		    return "";
	    }
	}
};
/*
    AJAX
*/
function sequencialupload() {
    if (!uploading) {
        if (queue.length > 0) {
            var puturl = location.href;
            if (puturl.match(/#/)) puturl = puturl.split("#")[0];
            if (puturl.match(/\?/)) puturl = puturl.split("?")[0];
            while (puturl.match(/\/$/)) puturl = puturl.replace(/\/$/,"");
            // start upload
            queue[0].open("PUT", puturl + "/" + fq[0].name, true); //NONROOTPATH
            queue[0].setRequestHeader("X_FILENAME", fq[0].name);
            queue[0].send(fq[0]);
            uploading = true;
        } else {
            // done uploading, time to get tags
            $("#fetchtags").click();
        }
    }
}

function upload(file) {
    if ( (ALLOWUPLOAD==undefined) || (ALLOWUPLOAD=="true") ){
    	$(".browse").addClass("uploading");
    	var li = $('<li>');
    	li.append($('<div style="clear:both;"><p>' +
            linguist("Uploading", file.name) + '</p><div class="progress">'+
            '<div class="progress-bar" role="progressbar" style="width: 0%;">'+
            '0%</div></div></div>'));
    	$(li).appendTo($(".tags"));
    	var xhr = new XMLHttpRequest();
    	xhr.upload.addEventListener("progress", function(e) {
    	    var pc = parseInt((e.loaded / e.total * 100));
    	    $(".progress", $(li)).show();
    	    $(".progress-bar", $(li)).css("width", pc + "%");
    	    $(".progress-bar", $(li)).empty().append(pc + "%");
    	}, false);
    	xhr.onreadystatechange = function(e) {
    	    if (xhr.readyState == 4) {
        		$("#webupload").addClass("uploading");
    		// progress.className = (xhr.status == 200 ? "success" : "failure");
        		if (xhr.status == 200) {
                    $(li).html(linguist("Success", file.name));
                    tagsDBRefreshMeta(JSON.parse(xhr.responseText));
        		} else {
        		    $(li).html(linguist("ErrorDuringUploadOfFile",
                        xhr.status, file.name));
        		}
        		// file uploaded successfully, remove from queue
                uploading = false;
        		var index = queue.indexOf(xhr);
        		if (index > -1) {
        		    queue.splice(index, 1);
                    fq.splice(index, 1);
                    sequencialupload();
        		}
    	    }
    	};
    	// should queue all uploads.
    	queue.push(xhr);
        fq.push(file);
        sequencialupload();
    }
};
/*
    Document Bindings
*/
$(document).ready(function() {
    var tmptheme = localStorage.getItem("theme");
    var gettheme = (tmptheme) ? tmptheme : theme;
    $(document.body).parent().attr("id", gettheme);
	if ( (ALLOWUPLOAD==undefined) || (ALLOWUPLOAD=="true") ){
        // only show if on home, not on individual tag page
        if (!location.href.match(/[0-9a-f]{128}/)) {
        	$("#webupload").addClass("show");
        }
    }
    if ( (ALLOWADDTAG==undefined) || (ALLOWADDTAG=="true") ) {
    	$("#search").addClass("showtable");
    	$("#addtagform").addClass("show");
        $("#searchtopform").addClass("show");
    }
    if               ($("h2.page-header").text().match(/youtube\.com\/watch\?v=/)) {
        var erase = $("h2.page-header").text().match(/.*youtube\.com\/watch\?v=/);
        var youtubevideoid = $("h2.page-header").text().replace(erase,"").match(/[0-9a-zA-Z]{11}/);
        $("#content").append($('<iframe></iframe>').attr({
            "frameborder":"0",
            "allowfullscreen":"allowfullscreen",
            "src":"https://www.youtube.com/embed/"+youtubevideoid+"?rel=0"
        }));
    } else if        ($("h2.page-header").text().match(/\/youtu\.be\//)) {
        var erase = $("h2.page-header").text().match(/.*\/youtu\.be\//);
        var youtubevideoid = $("h2.page-header").text().replace(erase,"").match(/[0-9a-zA-Z]{11}/);
        $("#content").append($('<iframe></iframe>').attr({
            "frameborder":"0",
            "allowfullscreen":"allowfullscreen",
            "src":"https://www.youtube.com/embed/"+youtubevideoid+"?rel=0"
        }));
    } else if        ($("h2.page-header").text().match(
            /https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/
    )) {
        var soundcloudurl = $("h2.page-header").text().match(
            /https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/
        );
        SC.oEmbed(
            soundcloudurl[0],
            {
                color: "434C58",
                maxheight: 169
            },
            $("#content")[0]
        );
    }

    var strippedname = $('h2.page-header').text();
    var externalurl = '';
    if (strippedname.match(/https?:\/\/.*/)) {
        var eurl = strippedname.match(/https?:\/\/.*/);
        strippedname = strippedname.replace(
            eurl,
            ''
        );
        externalurl = ' <a href="'+eurl+'">'+eurl+'</a>';
    }
    $('h2.page-header').html(strippedname + externalurl);
    $('span#classify-header').html(strippedname + externalurl);

    tagsFor("card-suggested", "Cached Tags");
    tagsFor("card-tags", '');
});
$(window).bind("beforeunload", function(){
	if (queue.length==0) {
	    return;
	}
	return linguist("ThereAreStillFilesBeingUploaded", queue.length);
});
$(document).bind("dragenter", function(event) {
	event.preventDefault();
}).bind("dragover", function(event) {
	event.preventDefault();
	// show drop indicator
	$("#webupload").addClass("dragged");
}).bind("dragleave", function(event) {
	$("#webupload").removeClass("dragged");
}).bind("drop dragdrop", function(event) {
    $("#webupload").addClass("show");
	var files = event.originalEvent.target.files ||
        event.originalEvent.dataTransfer.files;
	$.each(files, function(index, file) {
	    upload(file);
	});
	event.stopPropagation();
	event.preventDefault();
});
/*
    Button AJAX
*/
$("a.browse").on("click", function(e) {
	$("input[type=file]").click();
	return (false); //prevent a click
});
$("input[type=file]").on("change", function(e) {
	$.each(this.files, function(index, file) {
	    if (file instanceof Blob) {
    		upload(file);
	    }
	});
});
/*
    Button Local Storage
*/
$("#clearlocal").on("click", function(e){
    localStorage.removeItem("tagsDB");
});
/*
    Buttons Themes
*/
$("#themedark").on("click", function(e){
	$(document.body).parent().attr("id", "dark");
    localStorage.setItem("theme", "dark");
});
$("#themebright").on("click", function(e){
	$(document.body).parent().attr("id", "bright");
    localStorage.setItem("theme", "bright");
});
/*
    Media
*/
$("video").on("click", function(e){
    $(this).get(0).paused ? $(this).get(0).play() : $(this).get(0).pause();
});

})();
