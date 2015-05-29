function tagsDBLoad() {
    //var tagsDB = JSON.parse(localStorage.getItem("tagsDB"));
    return (tagsDB) ? tagsDB : {};
}

function docsDBLoad() {
    //var docsDB = JSON.parse(localStorage.getItem("docsDB"));
    return (docsDB) ? docsDB : {};
}
// global
//var tagsDB = tagsDBLoad();
var tagsDB = {};
//var docsDB = docsDBLoad();
var docsDB = {};
/*============================================================================*/
function isFile(obj) {
    var isfile = true;
    if (obj.content_type.match(/image/)) {} else if (obj.content_type.match(/audio/)) {} else if (obj.content_type.match(/video/)) {} else if (obj.content_type.match(/text/)) {} else if (obj.content_type.match(/pdf/)) {} else if (obj.filename.match(/youtube\.com\/watch\?v=/)) {} else if (obj.filename.match(/\/youtu\.be\//)) {} else if (obj.filename.match(/https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/)) {} else if ((obj.content_type != 'tag') && (obj.length !== 0)) {} else {
        isfile = false;
    }
    return isfile;
}
/*============================================================================*/
function getHashFromLocation() {
    var hash = location.href.match(/[0-9a-f]{128}/);
    return (hash) ? hash : false;
}
/*============================================================================*/
function tagsDBRefreshMeta(recvObj) {
    if (recvObj.rows) {
        $.each(recvObj.rows, function(h, o) {
            if (o.doc) {
                // save the doc so we can try to PUT to couchDB
                docsDB[o.doc._id] = o.doc;
                if (o.doc.dtfc) {
                    $.each(o.doc.dtfc, function(k, v) {
                        if (o.doc.tags) {
                            v.tags = o.doc.tags;
                        }
                        /*
                        if ((v.content_type == "tag") && (v.length === 0)) {
                            if (v.filename) {
                                if (v.filename.match(/[0-9a-f]{128}/)) {} else {
                                    if (!tagsDB[v.filename]) {
                                        tagsDB[v.filename] = {};
                                    }
                                    tagsDB[v.filename] = v;
                                }
                            }
                        }
                        */
                        if (v.sha512) {
                            if (!tagsDB[v.sha512]) {
                                tagsDB[v.sha512] = {};
                            }
                            tagsDB[v.sha512] = v;
                        }
                    });
                }
            }
        });
        //localStorage.setItem("tagsDB", JSON.stringify(tagsDB));
        //localStorage.setItem("docsDB", JSON.stringify(docsDB));
    }
}
/*============================================================================*/
function timeLongFormatDate(timeString) {
    var localdate = new Date(Date.parse(timeString));
    var year = localdate.getFullYear();
    var month = (
        localdate.getMonth() < 9
    ) ? '0' + (localdate.getMonth() + 1) : (localdate.getMonth() + 1);
    var day = (
        localdate.getDate() < 10
    ) ? '0' + localdate.getDate() : localdate.getDate();
    return year + '-' + month + '-' + day;
}
/*============================================================================*/
function timeLongFormatTime(timeString) {
    var localdate = new Date(Date.parse(timeString));
    return localdate.toLocaleTimeString();
}
/*============================================================================*/
function timeLongFormat(timeString) {
    return timeLongFormatDate(timeString) + ' ' +
        timeLongFormatTime(timeString);
}
/*============================================================================*/
function numberFormat(number) {
    var separated = number;
    if (number.toLocaleString) {
        separated = number.toLocaleString();
    }
    return separated;
}
/*============================================================================*/
function sortName(a, b) {
    var aw = (a.filename === undefined) ? '' : a.filename.toLowerCase();
    var bw = (b.filename === undefined) ? '' : b.filename.toLowerCase();
    return ((aw < bw) ? -1 : ((aw > bw) ? 1 : 0));
}
/*============================================================================*/
function sortType(a, b) {
    var aw = (
        a.content_type === undefined
    ) ? '' : a.content_type.toLowerCase();
    aw = (aw == "tag") ? 'zzzzzzzzzz' : aw;
    var bw = (
        b.content_type === undefined
    ) ? '' : b.content_type.toLowerCase();
    bw = (bw == "tag") ? 'zzzzzzzzzz' : bw;
    return ((aw < bw) ? -1 : ((aw > bw) ? 1 : 0));
}
/*============================================================================*/
function sortSize(a, b) {
    var aw = (a.length === undefined) ? 0 : a.length;
    var bw = (b.length === undefined) ? 0 : b.length;
    return aw - bw;
}
/*============================================================================*/
function sortTime(a, b) {
    var aw = (
        a.time === undefined
    ) ? '' : a.time.toLowerCase();
    var bw = (
        b.time === undefined
    ) ? '' : b.time.toLowerCase();
    return ((aw < bw) ? -1 : ((aw > bw) ? 1 : 0));
}
/*============================================================================*/
var MetaFileIcon = React.createClass({
    displayName: "MetaFileIcon",
    previewShow: function(event) {
        var divid = "#previewdiv" + this.props.sha512;
        if ($.trim($(divid).html()) === '') {
            if (this.props.content_type.match(/image/)) {
                $(divid).append($('<img/>').attr({
                    "id": "preview" + this.props.sha512,
                    "src": "./raw/" + this.props.sha512
                }).addClass("previewimage"));
                $(divid).attr(
                    "style", "display:block!important"
                );
            } else if (this.props.content_type.match(/audio/)) {
                $(divid).append($('<audio></audio>').attr({
                    "id": "preview" + this.props.sha512,
                    "controls": "controls"
                }).addClass("previewaudio").append($('<source/>').attr({
                    "src": "./raw/" + this.props.sha512,
                    "type": this.props.content_type
                })));
                $(divid).attr(
                    "style", "display:block!important"
                );
            } else if (this.props.content_type.match(/video/)) {
                $(divid).append($('<video></video>').attr({
                    "id": "preview" + this.props.sha512,
                    "controls": "controls"
                }).addClass("previewvideo").on("click", function(e) {
                    if ($(this).get(0).paused) {
                        $(this).get(0).play();
                    } else {
                        $(this).get(0).pause();
                    }
                }).append($('<source/>').attr({
                    "src": "./raw/" + this.props.sha512,
                    "type": this.props.content_type
                })));
                $(divid).attr(
                    "style", "display:block!important"
                );
            } else if (this.props.filename.match(/youtube\.com\/watch\?v=/)) {
                var erase = this.props.filename.match(/.*youtube\.com\/watch\?v=/);
                var youtubevideoid = this.props.filename.replace(
                    erase, ''
                ).match(/[0-9a-zA-Z]{11}/);
                $(divid).append(
                    $('<iframe></iframe>').attr({
                        "id": "preview" + this.props.sha512,
                        "frameborder": "0",
                        "allowfullscreen": "allowfullscreen",
                        "src": "https://www.youtube.com/embed/" + youtubevideoid + "?rel=0"
                    }).addClass("previewyoutube"));
                $(divid).attr(
                    "style", "display:block!important"
                );
            } else if (this.props.filename.match(/\/youtu\.be\//)) {
                var erase2 = this.props.filename.match(/.*\/youtu\.be\//);
                var youtubevideoid2 = this.props.filename.replace(
                    erase2, ''
                ).match(/[0-9a-zA-Z]{11}/);
                $(divid).append(
                    $('<iframe></iframe>').attr({
                        "id": "preview" + this.props.sha512,
                        "frameborder": "0",
                        "allowfullscreen": "allowfullscreen",
                        "src": "https://www.youtube.com/embed/" + youtubevideoid2 + "?rel=0"
                    }).addClass("previewyoutube"));
                $(divid).attr(
                    "style", "display:block!important"
                );
            } else if (
                this.props.filename.match(
                    /https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/
                )
            ) {
                var soundcloudurl = this.props.filename.match(
                    /https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/
                );
                SC.oEmbed(
                    soundcloudurl[0], {
                        color: "434C58",
                        maxheight: 169
                    },
                    $(divid)[0]
                );
                $(divid).attr(
                    "style", "display:block!important"
                );
            }
        }
    },
    previewHide: function(event) {
        var divid = "#previewdiv" + this.props.sha512;
        $(divid).attr("style", '');
        $(divid).empty();
    },
    previewToggle: function(event) {
        var divid = "#previewdiv" + this.props.sha512;
        if ($.trim($(divid).html()) === '') {
            this.previewShow(event);
        } else {
            this.previewHide(event);
        }
    },
    render: function() {
        var typeicon = '';
        if (this.props.content_type.match(/image/)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon glyphicon-picture",
                    "aria-hidden": "true"
                })
            );
        } else if (this.props.content_type.match(/audio/)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon glyphicon-music",
                    "aria-hidden": "true"
                })
            );
        } else if (this.props.content_type.match(/video/)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon glyphicon-film",
                    "aria-hidden": "true"
                })
            );
        } else if (this.props.content_type.match(/text/)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon glyphicon-text-size",
                    "aria-hidden": "true"
                })
            );
        } else if (this.props.content_type.match(/pdf/)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon glyphicon-text-background",
                    "aria-hidden": "true"
                })
            );
        } else if (this.props.filename.match(/youtube\.com\/watch\?v=/)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon icon-youtube",
                    "aria-hidden": "true"
                })
            );
        } else if (this.props.filename.match(/\/youtu\.be\//)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon icon-youtube",
                    "aria-hidden": "true"
                })
            );
        } else if (
            this.props.filename.match(/https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/)
        ) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon icon-soundcloud",
                    "aria-hidden": "true"
                })
            );
        } else if ((this.props.content_type != 'tag') && (this.props.length !== 0)) {
            typeicon = (
                React.createElement("span", {
                    className: "glyphicon glyphicon-file",
                    "aria-hidden": "true"
                })
            );
        }
        if (isFile(this.props)) {
            return (
                React.createElement("span", {
                        className: this.props.myclass
                    },
                    React.createElement("button", {
                            className: "btn " + this.props.myclass,
                            onClick: this.previewToggle,
                            title: this.props.content_type
                        },
                        typeicon
                    ),
                    React.createElement("button", {
                        className: "forcepreviewshow",
                        onClick: this.previewShow
                    })
                )
            );
        } else {
            return null;
        }
    }
});
/*============================================================================*/
var TagTableRow = React.createClass({
    displayName: "TagTableRow",
    toggleTick: function() {
        var hash = this.props.sha512;
        var ticked = (
            this.props.done
        ) ? this.props.done : false;
        var newtick = (ticked) ? false : true;
        // save not now, but when we ajax
        //tagsDB[hash].done = newtick;
        //this.props.onLoadTagsFromLocal();
        if ((ALLOWADDTAG === undefined) || (ALLOWADDTAG == "true")) {
            //localStorage.setItem("tagsDB", JSON.stringify(tagsDB));
            // now actually do the query
            if (hash) {
                if (newtick) {
                    // if newtick = true, post to /get/done adddone=hash

                    // only ajax if we are on an actual file
                    var newdoc = docsDB[hash];
                    newdoc.tags.push("done");
                    if (newdoc.dtfc) {
                        $.each(newdoc.dtfc, function(k, v) {
                            if (v.tags) delete v.tags;
                        });
                    }
                    $.ajax({
                        type: "PUT",
                        url: "./_db/" + hash,
                        dataType: 'json',
                        data: JSON.stringify(newdoc),
                        success: function(data) {
                            this.props.onLoadTagsFromRemote();
                        }.bind(this),
                        error: function(xhr, status, err) {
                            var s = "Error (" + xhr.status + ") " + err.toString();
                            console.error(s);
                            alert(s);
                        }.bind(this)
                    });

                } else {
                    // else newtick = false, post to /get/done delhash=hash
                    var newdoc2 = docsDB[hash];
                    var index = newdoc2.tags.indexOf("done");
                    if (index > -1) {
                        newdoc2.tags.splice(index, 1);
                    }
                    if (newdoc2.dtfc) {
                        $.each(newdoc2.dtfc, function(k, v) {
                            if (v.tags) delete v.tags;
                        });
                    }
                    $.ajax({
                        type: "PUT",
                        url: "./_db/" + hash,
                        dataType: 'json',
                        data: JSON.stringify(newdoc2),
                        success: function(data) {
                            this.props.onLoadTagsFromRemote();
                        }.bind(this),
                        error: function(xhr, status, err) {
                            var s = "Error (" + xhr.status + ") " + err.toString();
                            console.error(s);
                            alert(s);
                        }.bind(this)
                    });
                }
            }
        }
    },
    deleteHash: function(e) {
        var delhash = this.props.sha512;
        var thishash = getHashFromLocation();
        if (thishash) {
            if (delhash) {
                var newdoc = docsDB[thishash];
                var index = newdoc.tags.indexOf(delhash);
                if (index > -1) {
                    newdoc.tags.splice(index, 1);
                }
                if (newdoc.dtfc) {
                    $.each(newdoc.dtfc, function(k, v) {
                        if (v.tags) delete v.tags;
                    });
                }
                this.props.onDeleteHash(delhash);
                $.ajax({
                    type: "PUT",
                    url: "./_db/" + thishash,
                    dataType: 'json',
                    data: JSON.stringify(newdoc),
                    success: function(data) {
                        this.props.onLoadTagsFromRemote();
                    }.bind(this),
                    error: function(xhr, status, err) {
                        var s = "Error (" + xhr.status + ") " + err.toString();
                        console.error(s);
                        alert(s);
                    }.bind(this)
                });
            }
            // make sure another Trash button is not selected
            $("#hiddenfocus").focus();
        }
    },
    render: function() {
        var rawbutton = '';
        var typeicon = (
            React.createElement(MetaFileIcon, {
                sha512: this.props.sha512,
                content_type: this.props.content_type,
                filename: this.props.filename,
                myclass: "typeicon"
            })
        );
        if ((this.props.content_type != 'tag') && (this.props.length !== 0)) {
            if ((SHOWRAWBUTTON === undefined) || (SHOWRAWBUTTON == "true")) {
                rawbutton = (
                    React.createElement("a", {
                            className: "btn btn-warning",
                            href: "./raw/" + this.props.sha512
                        },
                        React.createElement("span", {
                            className: "glyphicon glyphicon-download-alt",
                            "aria-hidden": "true"
                        })
                    )
                );
            }
        }
        var doneornot = '';
        if (this.props.done) {
            doneornot = (
                React.createElement("button", {
                        onClick: this.toggleTick,
                        className: "tagtick btn btn-default"
                    },
                    React.createElement("span", {
                        className: "glyphicon glyphicon-ok",
                        "aria-hidden": "true"
                    })
                )
            );
        } else {
            doneornot = (
                React.createElement("button", {
                        onClick: this.toggleTick,
                        className: "tagtick btn btn-default"
                    },
                    React.createElement("span", {
                        className: "glyphicon glyphicon-unchecked",
                        "aria-hidden": "true"
                    })
                )
            );
        }
        var cellsize = (React.createElement("td", null));
        if (this.props.length !== 0) {
            cellsize = (
                React.createElement("td", {
                        className: "tablenumber"
                    },
                    numberFormat(this.props.length)
                )
            );
        }
        var celltime = (React.createElement("td", null));
        if (this.props.time && (this.props.time != "2000-01-01T00:00:00.000Z")) {
            celltime = (
                React.createElement("td", {
                        className: "tabletime"
                    },
                    React.createElement("span", {
                            className: "pull-left"
                        },
                        timeLongFormatDate(this.props.time)
                    ),
                    React.createElement("span", {
                            className: "pull-left"
                        },
                        timeLongFormatTime(this.props.time)
                    ),
                    React.createElement("span", {
                        className: "pull-left",
                        "data-livestamp": Date.parse(this.props.time) / 1000
                    })
                )
            );
        }
        var celldeletetag = '';
        if ((ALLOWDELTAG === undefined) || (ALLOWDELTAG == "true")) {
            if (getHashFromLocation()) {
                celldeletetag = (
                    React.createElement("button", {
                            className: "btn btn-danger",
                            data: this.props.sha512,
                            onClick: this.deleteHash
                        },
                        React.createElement("span", {
                            className: "glyphicon glyphicon-trash",
                            "aria-hidden": "true"
                        })
                    )
                );
            }
        }
        var doneClass = (this.props.done) ? "done" : '';
        var strippedname = this.props.filename;
        var externalurl = '';
        var tagscount = '';
        if (this.props.filename.match(/https?:\/\/.*/)) {
            var eurl = this.props.filename.match(/https?:\/\/.*/);
            strippedname = this.props.filename.replace(
                eurl,
                ''
            );
            externalurl = (
                React.createElement("a", {
                    href: eurl
                }, eurl)
            );
        } else {
            if (!isFile(this.props) && (this.props.count > 0)) {
                tagscount = (
                    React.createElement("span", {
                        className: "badge"
                    }, this.props.count)
                );
            }
        }
        var linkhref = (this.props.sha512) ? "sha512:" + this.props.sha512 : "tag:" + this.props.filename;
        return (
            React.createElement("tr", {
                    className: "tagitem " + doneClass
                },
                React.createElement("td", null,
                    doneornot
                ),
                React.createElement("td", {
                        className: "tabletype"
                    },
                    typeicon
                ),
                React.createElement("td", {
                        className: "tagname"
                    },
                    React.createElement("a", {
                            href: "./" + linkhref,
                            className: "tagname"
                        },
                        strippedname
                    ),
                    ' ',
                    externalurl,
                    tagscount,
                    React.createElement("div", {
                        id: "previewdiv" + this.props.sha512,
                        className: "previewdiv"
                    })
                ),
                cellsize,
                React.createElement("td", {
                        className: "tabletype"
                    },
                    rawbutton
                ),
                celltime,
                React.createElement("td", null,
                    celldeletetag
                )
            )
        );
    }
});
/*============================================================================*/
var TagsTable = React.createClass({
    displayName: "TagsTable",
    deleteHash: function(delhash) {
        $(".previewdiv").empty();
        this.props.onDeleteHash(delhash);
    },
    changeHideDone: function(e) {
        this.props.onChangeHideDone(!this.props.hidedone);
    },
    handleFilter: function(e) {
        $(".previewdiv").empty();
        if ($("#filterNameInput").val().trim().length > 0) {
            $("#filterNameInput").attr("class", "filters filterson");
        } else {
            $("#filterNameInput").attr("class", "filters");
        }
        if ($("#filterTimeInput").val().trim().length > 0) {
            $("#filterTimeInput").attr("class", "filters filterson");
        } else {
            $("#filterTimeInput").attr("class", "filters");
        }
        this.setState({
            "sortorder": this.state.sortorder,
            "filtername": $("#filterNameInput").val().trim(),
            "filtertime": $("#filterTimeInput").val().trim()
        });
    },
    loadTagsFromLocal: function(e) {
        this.props.onLoadTagsFromLocal();
    },
    loadTagsFromRemote: function(e) {
        this.props.onLoadTagsFromRemote();
    },
    clickSortNameToggle: function(e) {
        if (this.state.sortorder) {
            this.props.onClickSortNameAZ();
        } else {
            this.props.onClickSortNameZA();
        }
        this.setState({
            "sortorder": !this.state.sortorder,
            "filtername": this.state.filtername,
            "filtertime": this.state.filtertime
        });
    },
    clickSortTimeToggle: function(e) {
        if (this.state.sortorder) {
            this.props.onClickSortTimeOldNew();
        } else {
            this.props.onClickSortTimeNewOld();
        }
        this.setState({
            "sortorder": !this.state.sortorder,
            "filtername": this.state.filtername,
            "filtertime": this.state.filtertime
        });
    },
    clickSortSizeToggle: function(e) {
        if (this.state.sortorder) {
            this.props.onClickSortSizeSmallBig();
        } else {
            this.props.onClickSortSizeBigSmall();
        }
        this.setState({
            "sortorder": !this.state.sortorder,
            "filtername": this.state.filtername,
            "filtertime": this.state.filtertime
        });
    },
    clickSortTypeToggle: function(e) {
        if (this.state.sortorder) {
            this.props.onClickSortTypeAZ();
        } else {
            this.props.onClickSortTypeZA();
        }
        this.setState({
            "sortorder": !this.state.sortorder,
            "filtername": this.state.filtername,
            "filtertime": this.state.filtertime
        });
    },
    getInitialState: function() {
        var sort = false;
        switch (this.props.sort) {
            case "nameaz":
                sort = false;
                break;
            case "nameza":
                sort = true;
                break;
            case "typeaz":
                sort = false;
                break;
            case "typeza":
                sort = true;
                break;
            case "sizebigsmall":
                sort = true;
                break;
            case "sizesmallbig":
                sort = false;
                break;
            case "timenewold":
                sort = true;
                break;
            case "timeoldnew":
                sort = false;
                break;
        }
        return {
            "sortorder": sort,
            "filtername": '',
            "filtertime": ''
        };
    },
    render: function() {
        var tagNodesTwo = [];
        this.props.data.forEach(function(o) {
            if ((o.filename) && (o.time)) {
                var matchname = true;
                if (this.state.filtername.length > 0) {
                    var regexname = new RegExp(this.state.filtername, "i");
                    matchname = regexname.test(o.filename);
                }
                var matchtime = true;
                if (this.state.filtertime.length > 0) {
                    var regextime = new RegExp(this.state.filtertime, "i");
                    matchtime = regextime.test(timeLongFormat(o.time));
                }
                if ((matchname) && (matchtime)) {
                    var tagcount = 0;
                    var isDone = false;
                    if (o.tags) {
                        tagcount = o.tags.length;
                        if (o.tags.indexOf("done") > -1) {
                            isDone = true;
                        }
                    }
                    tagNodesTwo.push(
                        React.createElement(TagTableRow, {
                            sha512: o.sha512,
                            filename: o.filename,
                            content_type: o.content_type,
                            length: o.length,
                            time: o.time,
                            done: isDone,
                            count: tagcount,
                            onDeleteHash: this.deleteHash,
                            onLoadTagsFromLocal: this.loadTagsFromLocal,
                            onLoadTagsFromRemote: this.loadTagsFromRemote
                        })
                    );
                }
            }
        }.bind(this));
        var hidedone = (this.props.hidedone) ? "hidedone" : '';
        var tableClass = "taglist " +
            "table table-striped table-condensed table-hover " + hidedone;
        var alt = (this.state.sortorder) ? "-alt" : '';
        var openclose = (this.props.hidedone) ? "-close" : "-open";
        var classObj = {
            "done": '',
            "content_type": '',
            "filename": '',
            "length": '',
            "time": ''
        };
        switch (this.props.sort) {
            case "nameaz":
            case "nameza":
                classObj.filename = " btn-primary";
                break;
            case "typeaz":
            case "typeza":
                classObj.content_type = " btn-primary";
                break;
            case "sizebigsmall":
            case "sizesmallbig":
                classObj.length = " btn-primary";
                break;
            case "timenewold":
            case "timeoldnew":
                classObj.time = " btn-primary";
                break;
        }
        classObj.done = (this.props.hidedone) ? " btn-primary" : '';
        return (
            React.createElement("table", {
                    className: tableClass
                },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null,
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.done,
                                    "aria-expanded": "false",
                                    onClick: this.changeHideDone
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-eye" + openclose,
                                    "aria-hidden": "true"
                                })
                            ),
                            React.createElement("br", null),
                            "DONE"
                        ),
                        React.createElement("th", {
                                className: "tabletype"
                            },
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.content_type,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortTypeToggle
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon glyphicon-sort",
                                    "aria-hidden": "true"
                                })
                            ),
                            React.createElement("br", null),
                            "TYPE"
                        ),
                        React.createElement("th", null,
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.filename,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortNameToggle
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-sort-by-alphabet" + alt,
                                    "aria-hidden": "true"
                                })
                            ),
                            React.createElement("input", {
                                type: "text",
                                className: "filters",
                                id: "filterNameInput",
                                placeholder: "Filter by...",
                                onChange: this.handleFilter,
                                value: this.props.filterName
                            }),
                            React.createElement("br", null),
                            "NAME"
                        ),
                        React.createElement("th", null,
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.length,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortSizeToggle
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-sort-by-attributes" + alt,
                                    "aria-hidden": "true"
                                })
                            ),
                            React.createElement("br", null),
                            "SIZE (bytes)"
                        ),
                        React.createElement("th", null),
                        React.createElement("th", {
                                colSpan: "2"
                            },
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.time,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortTimeToggle
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-sort-by-order" + alt,
                                    "aria-hidden": "true"
                                })
                            ),
                            React.createElement("input", {
                                type: "text",
                                className: "filters",
                                id: "filterTimeInput",
                                placeholder: "Filter by...",
                                onChange: this.handleFilter,
                                value: this.props.filterTime
                            }),
                            React.createElement("br", null),
                            "DATE TIME"
                        )
                    )
                ),
                React.createElement("tbody", null,
                    tagNodesTwo
                )
            )
        );
    }
});
/*============================================================================*/
var TagsOuter = React.createClass({
    displayName: "TagsOuter",
    sortBy: function(key, array) {
        localStorage.setItem("sort", key);
        $(".previewdiv").empty();
        if (array) {
            if (array.length > 0) {
                switch (key) {
                    case "nameaz":
                        array.sort(sortName);
                        break;
                    case "nameza":
                        array.sort(sortName);
                        array.reverse();
                        break;
                    case "typeaz":
                        array.sort(sortType);
                        break;
                    case "typeza":
                        array.sort(sortType);
                        array.reverse();
                        break;
                    case "sizebigsmall":
                        array.sort(sortSize);
                        array.reverse();
                        break;
                    case "sizesmallbig":
                        array.sort(sortSize);
                        break;
                    case "timenewold":
                        array.sort(sortTime);
                        array.reverse();
                        break;
                    case "timeoldnew":
                        array.sort(sortTime);
                        break;
                }
            }
            return array;
        } else {
            return [];
        }
    },
    clickSortNameAZ: function(e) {
        this.setState({
            "data": this.sortBy("nameaz", this.state.data),
            "sort": "nameaz",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortNameZA: function(e) {
        this.setState({
            "data": this.sortBy("nameza", this.state.data),
            "sort": "nameza",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortTimeNewOld: function(e) {
        this.setState({
            "data": this.sortBy("timenewold", this.state.data),
            "sort": "timenewold",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortTimeOldNew: function(e) {
        this.setState({
            "data": this.sortBy("timeoldnew", this.state.data),
            "sort": "timeoldnew",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortSizeBigSmall: function(e) {
        this.setState({
            "data": this.sortBy("sizebigsmall", this.state.data),
            "sort": "sizebigsmall",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortSizeSmallBig: function(e) {
        this.setState({
            "data": this.sortBy("sizesmallbig", this.state.data),
            "sort": "sizesmallbig",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortTypeAZ: function(e) {
        this.setState({
            "data": this.sortBy("typeaz", this.state.data),
            "sort": "typeaz",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickSortTypeZA: function(e) {
        this.setState({
            "data": this.sortBy("typeza", this.state.data),
            "sort": "typeza",
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickRefreshTags: function(e) {
        this.loadTagsFromLocal();
        this.loadTagsFromRemote();
    },
    clickViewAs: function() {
        var viewas;
        switch (this.state.viewas) {
            case "buttons":
                viewas = "table";
                break;
            case "table":
            default:
                viewas = "buttons";
                break;
        }
        localStorage.setItem("viewas", viewas);
        this.setState({
            "data": this.sortBy(this.state.sort, this.state.data),
            "sort": this.state.sort,
            "viewas": viewas,
            "hidedone": this.state.hidedone
        });
    },
    clickPreviewAll: function(e) {
        $.each($("button.forcepreviewshow"), function(i, o) {
            o.click();
        });
    },
    sha512only: function() {
        var obj = {};
        $.each(tagsDB, function(i, h) {
            if (i.match(/[0-9a-f]{128}/)) {
                obj[i] = h;
            }
        });
        return obj;
    },
    hashesToObject: function(hash) {
        var obj = {};
        if (tagsDB[hash]) {
            if (tagsDB[hash].tags) {
                $.each(tagsDB[hash].tags, function(i, h) {
                    if (tagsDB[h]) {
                        obj[h] = tagsDB[h];
                    } else {
                        if (h.match(/[0-9a-f]{128}/)) {} else {
                            obj[h] = {
                                "filename": h,
                                "content_type": "tag",
                                "length": 0,
                                "time": "2000-01-01T00:00:00.000Z"
                            };
                        }
                    }
                });
                return obj;
            }
        }
    },
    loadTagsFromLocal: function() {
        var tagsArray = [];
        var tagsObj = [];
        var hash = getHashFromLocation();
        if (hash) {
            //DEBUGconsole.log('TagsOuter loadTagsFromLocal hashesToObject');
            var hto = this.hashesToObject(hash);
            tagsObj = (hto) ? hto : false;
        } else {
            //DEBUGconsole.log('TagsOuter loadTagsFromLocal all tagsDB cached');
            var hto2 = this.sha512only();
            tagsObj = (hto2) ? hto2 : false;
        }
        if (tagsObj) {
            // parse all objects
            $.each(tagsObj, function(h, o) {
                //o.sha512 = h;
                tagsArray.push(o);
            });
        }
        if (tagsArray) {
            //DEBUGconsole.log('TagsOuter loadTagsFromLocal set state.data');
            this.setState({
                "data": this.sortBy(this.state.sort, tagsArray),
                "sort": this.state.sort,
                "viewas": this.state.viewas,
                "hidedone": this.state.hidedone
            });
        }
    },
    loadTagsFromRemote: function() {
        if (getHashFromLocation()) {
            //DEBUGconsole.log('TagsOuter loadTagsFromRemote AJAX');
            var thishash = getHashFromLocation();
            var queryhash = "?startkey=" + encodeURIComponent('"' + thishash + '"') +
                "&endkey=" + encodeURIComponent('"' + thishash + '\\ufff0' + '"') +
                "&include_docs=true";
            $.ajax({
                url: "./_ddoc/_view/dtfcdocs" + queryhash,
                dataType: 'json',
                success: function(data) {
                    tagsDBRefreshMeta(data);
                    this.loadTagsFromLocal();
                }.bind(this),
                error: function(xhr, status, err) {
                    var s = "Error (" + xhr.status + ") " + err.toString();
                    console.error(s);
                    //silent the timed fetch errors alert(s);
                }.bind(this)
            });
        } else {
            // get tags "front page" only if not get hash
            var fronthash = "?startkey=" + encodeURIComponent('"front page' + '"') +
                "&endkey=" + encodeURIComponent('"front page' + '\\ufff0' + '"') +
                "&include_docs=true";
            if (location.href.match(/tag:.*/)) {
                //console.log(location.href.match(/tag:.*/));
                var wordtag = decodeURIComponent(location.href.match(/tag:.*/)[0].replace("tag:", ""));
                //console.log(wordtag);
                fronthash = "?startkey=" + encodeURIComponent('"' + wordtag + '"') +
                    "&endkey=" + encodeURIComponent('"' + wordtag + '\\ufff0' + '"') +
                    "&include_docs=true";
            }
            $.ajax({
                url: "./_ddoc/_view/tag" + fronthash,
                dataType: 'json',
                success: function(data) {
                    tagsDBRefreshMeta(data);
                    this.loadTagsFromLocal();
                }.bind(this),
                error: function(xhr, status, err) {
                    var s = "Error (" + xhr.status + ") " + err.toString();
                    console.error(s);
                    //silent the timed fetch errors alert(s);
                }.bind(this)
            });
        }
    },
    getInitialState: function() {
        var tmpsort = localStorage.getItem("sort");
        var sort = (tmpsort) ? tmpsort : "timenewold";
        var tmpviewas = localStorage.getItem("viewas");
        var viewas = (tmpviewas) ? tmpviewas : "table";
        var tmphidedone = localStorage.getItem("hidedone");
        var hidedone = (tmphidedone == "false") ? false : true;
        return {
            "data": [],
            "sort": sort,
            "viewas": viewas,
            "hidedone": hidedone
        };
    },
    componentDidMount: function() {
        this.loadTagsFromLocal();
        this.loadTagsFromRemote();
        //no need to polllocal if we use state
        //setInterval(this.loadTagsFromLocal, this.props.pollIntervalLocal);
        if (this.props.pollIntervalRemote > 999) {
            setInterval(this.loadTagsFromRemote,
                this.props.pollIntervalRemote);
        }
    },
    deleteHash: function(delhash) {
        //DEBUGconsole.log('TagsOuter deleteHash');
        var hash = getHashFromLocation();
        var index = tagsDB[hash].tags.indexOf(delhash);
        if (index > -1) {
            tagsDB[hash].tags.splice(index, 1);
        }
        delete this.state.data[delhash];
        this.setState({
            "data": this.sortBy(this.state.sort, this.state.data),
            "sort": this.state.sort,
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    addTag: function(event) {
        event.preventDefault();
        var thishash = getHashFromLocation();
        var newdoc = docsDB[thishash];
        newdoc.tags.push($("#addtaginput").val().trim());
        if (newdoc.dtfc) {
            $.each(newdoc.dtfc, function(k, v) {
                if (v.tags) delete v.tags;
            });
        }
        $.ajax({
            type: "PUT",
            url: "./_db/" + thishash,
            dataType: 'json',
            data: JSON.stringify(newdoc),
            success: function(data) {
                this.loadTagsFromRemote();
                $("#addtaginput").val('');
            }.bind(this),
            error: function(xhr, status, err) {
                var s = "Error (" + xhr.status + ") " + err.toString();
                console.error(s);
                alert(s);
            }.bind(this)
        });
        return (false); //prevent form submit
    },
    changeHideDone: function(hidedone) {
        localStorage.setItem("hidedone", hidedone);
        this.setState({
            "data": this.sortBy(this.state.sort, this.state.data),
            "sort": this.state.sort,
            "viewas": this.state.viewas,
            "hidedone": hidedone
        });
    },
    render: function() {
        //if (this.state.data.length > 0) {
        var viewTagsAs = '';
        var tagSortBar = '';
        switch (this.state.viewas) {
            case "table":
                viewTagsAs = (
                    React.createElement(TagsTable, {
                        data: this.state.data,
                        sort: this.state.sort,
                        hidedone: this.state.hidedone,
                        filtername: this.state.filtername,
                        filtertime: this.state.filtertime,
                        onDeleteHash: this.deleteHash,
                        onChangeHideDone: this.changeHideDone,
                        onLoadTagsFromLocal: this.loadTagsFromLocal,
                        onLoadTagsFromRemote: this.loadTagsFromRemote,
                        onClickSortNameAZ: this.clickSortNameAZ,
                        onClickSortNameZA: this.clickSortNameZA,
                        onClickSortTimeNewOld: this.clickSortTimeNewOld,
                        onClickSortTimeOldNew: this.clickSortTimeOldNew,
                        onClickSortSizeBigSmall: this.clickSortSizeBigSmall,
                        onClickSortSizeSmallBig: this.clickSortSizeSmallBig,
                        onClickSortTypeAZ: this.clickSortTypeAZ,
                        onClickSortTypeZA: this.clickSortTypeZA
                    })
                );
                tagSortBar = '';
                break;
            case "buttons":
            default:
                viewTagsAs = (
                    React.createElement(TagsListB, {
                        data: this.state.data
                    })
                );
                var classObj = {
                    "done": '',
                    "content_type": '',
                    "filename": '',
                    "length": '',
                    "time": ''
                };
                switch (this.state.sort) {
                    case "nameaz":
                    case "nameza":
                        classObj.filename = " btn-primary";
                        break;
                    case "typeaz":
                    case "typeza":
                        classObj.content_type = " btn-primary";
                        break;
                    case "sizebigsmall":
                    case "sizesmallbig":
                        classObj.length = " btn-primary";
                        break;
                    case "timenewold":
                    case "timeoldnew":
                        classObj.time = " btn-primary";
                        break;
                }
                tagSortBar = (
                    React.createElement("div", {
                            className: "pull-left tagoptions"
                        },
                        React.createElement("div", {
                                className: "btn-group",
                                role: "group",
                                "aria-label": "..."
                            },
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.content_type,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortTypeAZ
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon glyphicon-sort",
                                    "aria-hidden": "true"
                                }), React.createElement("span", {
                                        className: "btnlabel"
                                    },
                                    "Type"
                                )
                            ),
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.filename,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortNameAZ
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-sort-by-alphabet",
                                    "aria-hidden": "true"
                                }), React.createElement("span", {
                                        className: "btnlabel"
                                    },
                                    "Name"
                                )
                            ),
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.length,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortSizeBigSmall
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-sort-by-attributes-alt",
                                    "aria-hidden": "true"
                                }), React.createElement("span", {
                                        className: "btnlabel"
                                    },
                                    "Largest"
                                )
                            ),
                            React.createElement("button", {
                                    type: "button",
                                    className: "btn btn-default" + classObj.time,
                                    "aria-expanded": "false",
                                    onClick: this.clickSortTimeNewOld
                                },
                                React.createElement("span", {
                                    className: "glyphicon glyphicon-time",
                                    "aria-hidden": "true"
                                }), React.createElement("span", {
                                        className: "btnlabel"
                                    },
                                    "Newest"
                                )
                            )
                        )
                    )
                );
                break;
        }
        var refresh = (
            React.createElement("button", {
                    type: "button",
                    className: "btn btn-default",
                    id: "fetchtags",
                    onClick: this.clickRefreshTags
                },
                React.createElement("span", {
                    className: "glyphicon glyphicon-refresh",
                    "aria-hidden": "true"
                }), React.createElement("span", {
                        className: "btnlabel"
                    },
                    "Refresh"
                )
            )
        );
        var tabletile = (
            React.createElement("button", {
                    type: "button",
                    className: "btn btn-default",
                    onClick: this.clickViewAs
                },
                React.createElement("span", {
                    className: "glyphicon glyphicon-th-list",
                    "aria-hidden": "true"
                }), React.createElement("span", {
                        className: "btnlabel"
                    },
                    "Table/Tiles"
                )
            )
        );
        var previewall = (
            React.createElement("button", {
                    type: "button",
                    className: "btn btn-default",
                    onClick: this.clickPreviewAll
                },
                React.createElement("span", {
                    className: "glyphicon glyphicon-glass",
                    "aria-hidden": "true"
                }), React.createElement("span", {
                        className: "btnlabel"
                    },
                    "Load Previews"
                )
            )
        );
        var addtagform = '';
        if ((ALLOWADDTAG === undefined) || (ALLOWADDTAG == "true")) {
            addtagform = (
                React.createElement("form", {
                        className: "form-inline"
                    },
                    React.createElement("div", {
                            className: "form-group"
                        },
                        React.createElement("input", {
                            type: "text",
                            className: "form-control",
                            id: "addtaginput",
                            placeholder: "tag"
                        })
                    ),
                    React.createElement("button", {
                            type: "submit",
                            className: "btn btn-success",
                            id: "addtagbutton",
                            onClick: this.addTag
                        },
                        "Add tag"
                    )
                )
            );
        }
        if (getHashFromLocation()) {
            return (
                React.createElement("div", {
                        className: "tagsouter"
                    },
                    React.createElement("h4", null, this.props.title),
                    addtagform,
                    React.createElement("div", {
                            className: "pull-left tagoptions"
                        },
                        React.createElement("div", {
                                className: "btn-group",
                                role: "group",
                                "aria-label": "..."
                            },
                            tabletile,
                            previewall,
                            refresh
                        )
                    ),
                    tagSortBar,
                    viewTagsAs
                )
            );
        } else {
            //no refresh
            return (
                React.createElement("div", {
                        className: "tagsouter"
                    },
                    React.createElement("h4", null, this.props.title),
                    React.createElement("div", {
                            className: "pull-left tagoptions"
                        },
                        React.createElement("div", {
                                className: "btn-group",
                                role: "group",
                                "aria-label": "..."
                            },
                            tabletile,
                            previewall
                        )
                    ),
                    tagSortBar,
                    viewTagsAs
                )
            );
        }
        /*} else {
            return null;
        }*/
    }
});
/*============================================================================*/
var TagListBButton = React.createClass({
    displayName: "TagListBButton",
    render: function() {
        var typeicon = (
            React.createElement(MetaFileIcon, {
                sha512: this.props.sha512,
                content_type: this.props.content_type,
                filename: this.props.filename,
                myclass: "typeicon"
            })
        );
        var metasize = '';
        if (this.props.length !== 0) {
            metasize = (
                React.createElement("span", {
                        className: "size"
                    },
                    numberFormat(this.props.length) + " bytes"
                )
            );
        }
        var metatime = '';
        if (this.props.time && (this.props.time != "2000-01-01T00:00:00.000Z")) {
            metatime = (
                React.createElement("span", {
                    className: "time",
                    "data-livestamp": Date.parse(this.props.time) / 1000
                })
            );
        }
        var dropdown = '';
        var dropbutton = '';
        var strippedname = this.props.filename;
        var externalurl = '';
        var tagscount = '';
        if (this.props.filename.match(/https?:\/\/.*/)) {
            var eurl = this.props.filename.match(/https?:\/\/.*/);
            strippedname = this.props.filename.replace(
                eurl,
                ''
            );
            externalurl = (
                React.createElement("li", null, React.createElement("a", {
                    href: eurl
                }, eurl))
            );
            //has external url
            dropdown = (
                React.createElement("ul", {
                        className: "dropdown-menu",
                        role: "menu"
                    },
                    externalurl
                )
            );
            dropbutton = (
                React.createElement("button", {
                        type: "button",
                        className: "btn dropdown-toggle",
                        "data-toggle": "dropdown",
                        "aria-expanded": "false"
                    },
                    React.createElement("span", {
                        className: "glyphicon glyphicon-option-vertical"
                    }),
                    React.createElement("span", {
                        className: "sr-only"
                    }, "Toggle Dropdown")
                )
            );
        } else {
            if (!isFile(this.props) && (this.props.count > 0)) {
                tagscount = (
                    React.createElement("span", {
                        className: "badge"
                    }, this.props.count)
                );
            }
        }
        var linkhref = (this.props.sha512) ? "sha512:" + this.props.sha512 : "tag:" + this.props.filename;
        var mainbutton = (
            React.createElement("a", {
                    href: "./" + linkhref,
                    type: "button",
                    className: "tagname"
                },
                strippedname,
                tagscount
            )
        );
        return (
            React.createElement("li", {
                    className: "tagitem"
                },
                React.createElement("div", {
                        className: "tagwrapper"
                    },
                    React.createElement("div", {
                            className: "tagtop"
                        },
                        typeicon,
                        dropbutton,
                        mainbutton,
                        dropdown
                    ),
                    React.createElement("div", {
                        id: "previewdiv" + this.props.sha512,
                        className: "previewdiv"
                    }),
                    metasize,
                    metatime,
                    React.createElement("div", {
                        className: "tagbottom"
                    })
                )
            )
        );
    }
});
/*============================================================================*/
var TagsListB = React.createClass({
    displayName: "TagsListB",
    render: function() {
        var tagNodes = [];
        this.props.data.forEach(function(o) {
            if ((o.filename) && (o.time)) {
                var tagcount = 0;
                if (o.tags) {
                    tagcount = o.tags.length;
                }
                tagNodes.push(
                    React.createElement(TagListBButton, {
                        sha512: o.sha512,
                        filename: o.filename,
                        content_type: o.content_type,
                        length: o.length,
                        time: o.time,
                        count: tagcount
                    })
                );
            }
        }.bind(this));
        return (
            React.createElement("ul", {
                    className: "taglist"
                },
                tagNodes
            )
        );
    }
});
/*============================================================================*/
function tagsFor(id, title) {
    if (document.getElementById(id)) {
        React.render(
            React.createElement(TagsOuter, {
                title: title,
                pollIntervalRemote: POLLINTERVALREMOTE
            }),
            document.getElementById(id)
        );
    }
}
