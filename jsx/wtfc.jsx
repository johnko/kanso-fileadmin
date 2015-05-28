function tagsDBLoad() {
    var tagsDB = JSON.parse(localStorage.getItem("tagsDB"));
    return (tagsDB) ? tagsDB : {};
}
// global
var tagsDB = tagsDBLoad();
/*============================================================================*/
function isFile(obj){
    var isfile = true;
    if (obj.type.match(/image/)) {
    } else if (obj.type.match(/audio/)) {
    } else if (obj.type.match(/video/)) {
    } else if (obj.type.match(/text/)) {
    } else if (obj.type.match(/pdf/)) {
    } else if (obj.name.match(/youtube\.com\/watch\?v=/)) {
    } else if (obj.name.match(/\/youtu\.be\//)) {
    } else if (obj.name.match(/https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/)) {
    } else if ((obj.type!='tag')&&(obj.size!=0)) {
    } else {
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
    $.each(recvObj, function(h, o) {
        if (!tagsDB[h]) {
            tagsDB[h] = {};
        }
        tagsDB[h]["hash"] = h;
        $.each(o, function(k, v) {
            tagsDB[h][k] = v;
        });
    });
    localStorage.setItem("tagsDB", JSON.stringify(tagsDB));
}
/*============================================================================*/
function timeLongFormatDate(timeString) {
    var localdate = new Date(Date.parse(timeString));
    var year = localdate.getFullYear();
    var month = (
        localdate.getMonth() < 9
    ) ? '0'+(localdate.getMonth()+1) : (localdate.getMonth()+1) ;
    var day = (
        localdate.getDate() < 10
    ) ? '0'+localdate.getDate() : localdate.getDate() ;
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
    var aw = (a["name"]==undefined) ? '' : a["name"].toLowerCase();
    var bw = (b["name"]==undefined) ? '' : b["name"].toLowerCase();
    return ((aw < bw) ? -1 : ((aw > bw) ? 1 : 0));
}
/*============================================================================*/
function sortType(a, b) {
    var aw = (
        a["type"]==undefined
    ) ? '' : a["type"].toLowerCase();
    aw = (aw=="tag") ? 'zzzzzzzzzz' : aw;
    var bw = (
        b["type"]==undefined
    ) ? '' : b["type"].toLowerCase();
    bw = (bw=="tag") ? 'zzzzzzzzzz' : bw;
    return ((aw < bw) ? -1 : ((aw > bw) ? 1 : 0));
}
/*============================================================================*/
function sortSize(a, b) {
    var aw = (a["size"]==undefined) ? 0 : a["size"];
    var bw = (b["size"]==undefined) ? 0 : b["size"];
    return aw - bw;
}
/*============================================================================*/
function sortTime(a, b) {
    var aw = (
        a["time"]==undefined
    ) ? '' : a["time"].toLowerCase();
    var bw = (
        b["time"]==undefined
    ) ? '' : b["time"].toLowerCase();
    return ((aw < bw) ? -1 : ((aw > bw) ? 1 : 0));
}
/*============================================================================*/
var MetaFileIcon = React.createClass({
    previewShow: function(event) {
        var divid = "#previewdiv"+this.props.hash;
        if($.trim($(divid).html())=='') {
            if (this.props.type.match(/image/)) {
                $(divid).append($('<img/>').attr({
                    "id":"preview"+this.props.hash,
                    "src":"./raw/"+this.props.hash
                }).addClass("previewimage"));
                $(divid).attr(
                    "style","display:block!important"
                );
            } else if (this.props.type.match(/audio/)) {
                $(divid).append($('<audio></audio>').attr({
                    "id":"preview"+this.props.hash,
                    "controls":"controls"
                }).addClass("previewaudio").append($('<source/>').attr({
                    "src":"./raw/"+this.props.hash,
                    "type":this.props.type
                })));
                $(divid).attr(
                    "style","display:block!important"
                );
            } else if (this.props.type.match(/video/)) {
                $(divid).append($('<video></video>').attr({
                    "id":"preview"+this.props.hash,
                    "controls":"controls"
                }).addClass("previewvideo").on("click",function(e){
                    $(this).get(0).paused ?
                    $(this).get(0).play() :
                    $(this).get(0).pause();
                }).append($('<source/>').attr({
                    "src":"./raw/"+this.props.hash,
                    "type":this.props.type
                })));
                $(divid).attr(
                    "style","display:block!important"
                );
            } else if        (this.props.name.match(/youtube\.com\/watch\?v=/)) {
                var erase = this.props.name.match(/.*youtube\.com\/watch\?v=/);
                var youtubevideoid = this.props.name.replace(
                    erase,''
                ).match(/[0-9a-zA-Z]{11}/);
                $(divid).append(
                $('<iframe></iframe>').attr({
                    "id":"preview"+this.props.hash,
                    "frameborder":"0",
                    "allowfullscreen":"allowfullscreen",
                    "src":"https://www.youtube.com/embed/"+youtubevideoid+"?rel=0"
                }).addClass("previewyoutube"));
                $(divid).attr(
                    "style","display:block!important"
                );
            } else if        (this.props.name.match(/\/youtu\.be\//)) {
                var erase = this.props.name.match(/.*\/youtu\.be\//);
                var youtubevideoid = this.props.name.replace(
                    erase,''
                ).match(/[0-9a-zA-Z]{11}/);
                $(divid).append(
                $('<iframe></iframe>').attr({
                    "id":"preview"+this.props.hash,
                    "frameborder":"0",
                    "allowfullscreen":"allowfullscreen",
                    "src":"https://www.youtube.com/embed/"+youtubevideoid+"?rel=0"
                }).addClass("previewyoutube"));
                $(divid).attr(
                    "style","display:block!important"
                );
            } else if (
                this.props.name.match(
                    /https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/
                )
            ) {
                var soundcloudurl = this.props.name.match(
                    /https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/
                );
                SC.oEmbed(
                    soundcloudurl[0],
                    {
                        color: "434C58",
                        maxheight: 169
                    },
                    $(divid)[0]
                );
                $(divid).attr(
                    "style","display:block!important"
                );
            }
        }
    },
    previewHide: function(event) {
        var divid = "#previewdiv"+this.props.hash;
        $(divid).attr("style",'');
        $(divid).empty();
    },
    previewToggle: function(event) {
        var divid = "#previewdiv"+this.props.hash;
        if($.trim($(divid).html())=='') {
            this.previewShow(event);
        } else {
            this.previewHide(event);
        }
    },
    render: function() {
        var typeicon = '';
        if (this.props.type.match(/image/)) {
            typeicon = (
                <span
                    className="glyphicon glyphicon-picture"
                    aria-hidden="true">
                </span>
            );
        } else if (this.props.type.match(/audio/)) {
            typeicon = (
                <span
                    className="glyphicon glyphicon-music"
                    aria-hidden="true">
                </span>
            );
        } else if (this.props.type.match(/video/)) {
            typeicon = (
                <span
                    className="glyphicon glyphicon-film"
                    aria-hidden="true">
                </span>
            );
        } else if (this.props.type.match(/text/)) {
            typeicon = (
                <span
                    className="glyphicon glyphicon-text-size"
                    aria-hidden="true">
                </span>
            );
        } else if (this.props.type.match(/pdf/)) {
            typeicon = (
                <span
                    className="glyphicon glyphicon-text-background"
                    aria-hidden="true">
                </span>
            );
        } else if (this.props.name.match(/youtube\.com\/watch\?v=/)) {
            typeicon = (
                <span
                    className="glyphicon icon-youtube"
                    aria-hidden="true">
                </span>
            );
        } else if (this.props.name.match(/\/youtu\.be\//)) {
            typeicon = (
                <span
                    className="glyphicon icon-youtube"
                    aria-hidden="true">
                </span>
            );
        } else if (
            this.props.name.match(/https?:\/\/soundcloud\.com\/[^/]*\/[^/]*/)
        ) {
            typeicon = (
                <span
                    className="glyphicon icon-soundcloud"
                    aria-hidden="true">
                </span>
            );
        } else if ((this.props.type!='tag')&&(this.props.size!=0)) {
            typeicon = (
                <span
                    className="glyphicon glyphicon-file"
                    aria-hidden="true">
                </span>
            );
        }
        if (isFile(this.props)) {
            return (
                <span
                    className={this.props.myclass}>
                    <button
                        className={"btn "+this.props.myclass}
                        onClick={this.previewToggle}
                        title={this.props.type}>
                        {typeicon}
                    </button>
                    <button
                        className="forcepreviewshow"
                        onClick={this.previewShow}></button>
                </span>
            );
        } else {
            return null;
        }
    }
});
/*============================================================================*/
var TagTableRow = React.createClass({
    toggleTick: function() {
        var hash = this.props.hash;
        var ticked = (
            this.props.done
        ) ? this.props.done : false;
        var newtick = (ticked) ? false : true;
        // save not now, but when we ajax
        tagsDB[hash]["done"] = newtick;
        this.props.onLoadTagsFromLocal();
        if ( (ALLOWADDTAG==undefined) || (ALLOWADDTAG=="true") ) {
            localStorage.setItem("tagsDB", JSON.stringify(tagsDB));
            // now actually do the query
            var donehash = "07b8a32b38151e20c27bf64ee5fa32cf2f19e2ef0f749e50"+
                "ecf8069a368eddd1f0822b7b4dea7e8380d9e26425efbeb54ccac432c09"+
                "b75b82356afcf94cec37d";
            if (newtick) {
                // if newtick = true, post to /get/done adddone=hash
                $.ajax({
                    type: "POST",
                    url: location.href.match(/https?:\/\/[^\/]*/) +
                        NONROOTPATH + "/get/"+donehash,
                    dataType: 'json',
                    data: 'adddone='+hash,
                    success: function(data) {
                        tagsDBRefreshMeta(data);
                        this.props.onLoadTagsFromLocal();
                    }.bind(this),
                    error: function(xhr, status, err) {
                        var s = "Error ("+xhr.status+") "+err.toString();
                        console.error(s);
                        alert(s);
                    }.bind(this)
                });
            } else {
                // else newtick = false, post to /get/done delhash=hash
                $.ajax({
                    type: "POST",
                    url: location.href.match(/https?:\/\/[^\/]*/) +
                        NONROOTPATH + "/get/"+donehash,
                    dataType: 'json',
                    data: 'deldone='+hash,
                    success: function(data) {
                        tagsDBRefreshMeta(data);
                        this.props.onLoadTagsFromLocal();
                    }.bind(this),
                    error: function(xhr, status, err) {
                        var s = "Error ("+xhr.status+") "+err.toString();
                        console.error(s);
                        alert(s);
                    }.bind(this)
                });
            }
        }
    },
    deleteHash: function(e) {
        var hash = getHashFromLocation();
        var delhash = this.props.hash;
        if (hash) {
            this.props.onDeleteHash(delhash);
            $.ajax({
                type: "POST",
                url: location.href,
                dataType: 'json',
                data: 'delhash=' + delhash,
                success: function(data) {
                    tagsDBRefreshMeta(data);
                    this.props.onLoadTagsFromLocal();
                }.bind(this),
                error: function(xhr, status, err) {
                    var s = "Error ("+xhr.status+") "+err.toString();
                    console.error(s);
                    alert(s);
                }.bind(this)
            });
        }
        // make sure another Trash button is not selected
        $("#hiddenfocus").focus();
    },
    render: function() {
        var rawbutton = '';
        var typeicon = (
            <MetaFileIcon
                hash={this.props.hash}
                type={this.props.type}
                name={this.props.name}
                myclass={"typeicon"}
            />
        );
        if ((this.props.type!='tag')&&(this.props.size!=0)) {
            if ( (SHOWRAWBUTTON==undefined) || (SHOWRAWBUTTON=="true") ) {
                rawbutton = (
                    <a
                        className="btn btn-warning"
                        href={"./raw/" + this.props.hash}>
                        <span
                            className="glyphicon glyphicon-download-alt"
                            aria-hidden="true">
                        </span>
                    </a>
                );
            }
        }
        var doneornot = '';
        if (this.props.done) {
            doneornot = (
                <button
                    onClick={this.toggleTick}
                    className="tagtick btn btn-default">
                    <span
                        className="glyphicon glyphicon-ok"
                        aria-hidden="true">
                    </span>
                </button>
            );
        } else {
            doneornot = (
                <button
                    onClick={this.toggleTick}
                    className="tagtick btn btn-default">
                    <span
                        className="glyphicon glyphicon-unchecked"
                        aria-hidden="true">
                    </span>
                </button>
            );
        }
        var cellsize = (<td/>);
        if (this.props.size!=0) {
            cellsize = (
                <td className="tablenumber">
                    {numberFormat(this.props.size)}
                </td>
            );
        }
        var celltime = (<td/>);
        if (this.props.time) {
            celltime = (
                <td className="tabletime">
                    <span
                        className="pull-left">
                        {timeLongFormatDate(this.props.time)}
                    </span>
                    <span
                        className="pull-left">
                        {timeLongFormatTime(this.props.time)}
                    </span>
                    <span
                        className="pull-left"
                        data-livestamp={Date.parse(this.props.time)/1000}>
                    </span>
                </td>
            );
        }
        var celldeletetag = '';
    	if ( (ALLOWDELTAG==undefined) || (ALLOWDELTAG=="true") ) {
            if (getHashFromLocation()) {
                celldeletetag = (
                    <button
                        className="btn btn-danger"
                        data={this.props.hash}
                        onClick={this.deleteHash}>
                        <span
                            className="glyphicon glyphicon-trash"
                            aria-hidden="true">
                        </span>
                    </button>
                );
            }
        }
        var doneClass = (this.props.done) ? "done" : '' ;
        var strippedname = this.props.name;
        var externalurl = '';
        var tagscount = '';
        if (this.props.name.match(/https?:\/\/.*/)) {
            var eurl = this.props.name.match(/https?:\/\/.*/);
            strippedname = this.props.name.replace(
                eurl,
                ''
            );
            externalurl = (
                <a href={eurl}>{eurl}</a>
            );
        } else {
            if (!isFile(this.props)) {
                tagscount = (
                    <span className="badge">{this.props.count}</span>
                );
            }
        }
        return (
            <tr className={"tagitem "+doneClass}>
                <td>
                    {doneornot}
                </td>
                <td className="tabletype">
                    {typeicon}
                </td>
                <td className="tagname">
                    <a
                        href={"./get/" + this.props.hash}
                        className="tagname">
                        {strippedname}
                    </a>
                    {' '}
                    {externalurl}
                    {tagscount}
                    <div
                        id={"previewdiv"+this.props.hash}
                        className="previewdiv"></div>
                </td>
                {cellsize}
                <td className="tabletype">
                    {rawbutton}
                </td>
                {celltime}
                <td>
                    {celldeletetag}
                </td>
            </tr>
        );
    }
});
/*============================================================================*/
var TagsTable = React.createClass({
    deleteHash: function(delhash) {
        $(".previewdiv").empty();
        this.props.onDeleteHash(delhash);
    },
    changeHideDone: function(e) {
        this.props.onChangeHideDone(
            !this.props.hidedone
        );
    },
    handleFilter: function(e) {
        $(".previewdiv").empty();
        if ($("#filterNameInput").val().trim().length > 0) {
            $("#filterNameInput").attr("class","filters filterson");
        } else {
            $("#filterNameInput").attr("class","filters");
        }
        if ($("#filterTimeInput").val().trim().length > 0) {
            $("#filterTimeInput").attr("class","filters filterson");
        } else {
            $("#filterTimeInput").attr("class","filters");
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
        switch(this.props.sort) {
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
            if ( (o.name) && (o.time) ) {
                var matchname = true;
                if (this.state.filtername.length > 0) {
                    var regexname = new RegExp(this.state.filtername,"i");
                    matchname = regexname.test(o.name)
                }
                var matchtime = true;
                if (this.state.filtertime.length > 0) {
                    var regextime = new RegExp(this.state.filtertime,"i");
                    matchtime = regextime.test(timeLongFormat(o.time))
                }
                if ( (matchname) && (matchtime) ) {
                    tagNodesTwo.push(
                        <TagTableRow
                            hash={o.hash}
                            name={o.name}
                            type={o.type}
                            size={o.size}
                            time={o.time}
                            done={o.done}
                            count={o.tags.length}
                            onDeleteHash={this.deleteHash}
                            onLoadTagsFromLocal={this.loadTagsFromLocal}
                        />
                    );
                }
            }
        }.bind(this));
        var hidedone = (this.props.hidedone) ? "hidedone" : '';
        var tableClass = "taglist "+
            "table table-striped table-condensed table-hover "+hidedone;
        var alt = (this.state.sortorder) ? "-alt" : '';
        var openclose = (this.props.hidedone) ? "-close" : "-open";
        var classObj = {
            "done":'',
            "type":'',
            "name":'',
            "size":'',
            "time":''
        };
        switch(this.props.sort) {
            case "nameaz":
            case "nameza":
                classObj["name"] = " btn-primary";
                break;
            case "typeaz":
            case "typeza":
                classObj["type"] = " btn-primary";
                break;
            case "sizebigsmall":
            case "sizesmallbig":
                classObj["size"] = " btn-primary";
                break;
            case "timenewold":
            case "timeoldnew":
                classObj["time"] = " btn-primary";
                break;
        }
        classObj["done"] = (this.props.hidedone) ? " btn-primary" : '';
        return (
            <table
                className={tableClass}>
                <thead>
                    <tr>
                        <th>
                            <button
                                type="button"
                                className={"btn btn-default"+classObj["done"]}
                                aria-expanded="false"
                                onClick={this.changeHideDone}>
                                <span
                        className={"glyphicon glyphicon-eye"+openclose}
                        aria-hidden="true">
                                </span>
                            </button>
                            <br/>
DONE
                        </th>
                        <th className="tabletype">
                            <button
                                type="button"
                                className={"btn btn-default"+classObj["type"]}
                                aria-expanded="false"
                                onClick={this.clickSortTypeToggle}>
                                <span
                        className="glyphicon glyphicon glyphicon-sort"
                        aria-hidden="true">
                                </span>
                            </button>
                            <br/>
TYPE
                        </th>
                        <th>
                            <button
                                type="button"
                                className={"btn btn-default"+classObj["name"]}
                                aria-expanded="false"
                                onClick={this.clickSortNameToggle}>
                                <span
                        className={"glyphicon glyphicon-sort-by-alphabet"+alt}
                        aria-hidden="true">
                                </span>
                            </button>
                            <input
                                type="text"
                                className="filters"
                                id="filterNameInput"
                                placeholder="Filter by..."
                                onChange={this.handleFilter}
                                value={this.props.filterName}
                            />
                            <br/>
NAME
                        </th>
                        <th>
                            <button
                                type="button"
                                className={"btn btn-default"+classObj["size"]}
                                aria-expanded="false"
                                onClick={this.clickSortSizeToggle}>
                                <span
                    className={"glyphicon glyphicon-sort-by-attributes"+alt}
                    aria-hidden="true">
                                </span>
                            </button>
                            <br/>
SIZE (bytes)
                        </th>
                        <th />
                        <th colSpan="2">
                            <button
                                type="button"
                                className={"btn btn-default"+classObj["time"]}
                                aria-expanded="false"
                                onClick={this.clickSortTimeToggle}>
                                <span
                        className={"glyphicon glyphicon-sort-by-order"+alt}
                        aria-hidden="true">
                                </span>
                            </button>
                            <input
                                type="text"
                                className="filters"
                                id="filterTimeInput"
                                placeholder="Filter by..."
                                onChange={this.handleFilter}
                                value={this.props.filterTime}
                            />
                            <br/>
DATE TIME
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tagNodesTwo}
                </tbody>
            </table>
        );
    }
});
/*============================================================================*/
var TagsOuter = React.createClass({
    sortBy: function(key, array) {
        localStorage.setItem("sort", key);
        $(".previewdiv").empty();
        if (array) {
    		if (array.length > 0) {
    		    switch(key) {
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
        switch(this.state.viewas) {
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
        $.each($("button.forcepreviewshow"),function(i,o){
            o.click();
        });
    },
    hashesToObject: function(hash) {
        var obj = {};
        if (tagsDB[hash]) {
            if (tagsDB[hash]["tags"]) {
                $.each(tagsDB[hash]["tags"], function(i, h) {
                    if (tagsDB[h]) {
                        obj[h] = tagsDB[h];
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
            tagsObj = (tagsDB) ? tagsDB : false;
        }
        if (tagsObj) {
            // parse all objects
            $.each(tagsObj, function(h, o) {
                o["hash"] = h;
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
            if (location.href.match(/\/get\//)) {
//DEBUGconsole.log('TagsOuter loadTagsFromRemote AJAX');
                $.ajax({
                    url: location.href.replace(/\/get\//,"/tags/"),
                    dataType: 'json',
                    success: function(data) {
                        tagsDBRefreshMeta(data);
                        this.loadTagsFromLocal();
                    }.bind(this),
                    error: function(xhr, status, err) {
                        var s = "Error ("+xhr.status+") "+err.toString();
                        console.error(s);
			//silent the timed fetch errors alert(s);
                    }.bind(this)
                });
            }
        } else {
            // get tags "front page" only if not get hash
            var fronthash = "7510bce1049b98f56b5b4d4c0ef7d70800467f23318b"+
                "4da865cebec69e08d94b848d66cdb37f57af8ba50089b7cd1ded45a1"+
                "24846f0c49782ab7a35919902bd7";
            $.ajax({
                url: location.href.match(/https?:\/\/[^\/]*/) +
                    NONROOTPATH + "/tags/"+fronthash,
                dataType: 'json',
                success: function(data) {
                    tagsDBRefreshMeta(data);
                    this.loadTagsFromLocal();
                }.bind(this),
                error: function(xhr, status, err) {
                    var s = "Error ("+xhr.status+") "+err.toString();
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
        var hidedone = (tmphidedone=="false") ? false : true;
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
        var index = tagsDB[hash]["tags"].indexOf(delhash);
        if (index > -1) {
            tagsDB[hash]["tags"].splice(index, 1);
        }
        delete this.state.data[delhash];
        this.setState({
            "data": this.sortBy(this.state.sort, this.state.data),
            "sort": this.state.sort,
            "viewas": this.state.viewas,
            "hidedone": this.state.hidedone
        });
    },
    addTag: function(event){
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: location.href,
            dataType: 'json',
            data: ({
                "addtag":$("#addtaginput").val().trim()
            }),
            success: function(data) {
                tagsDBRefreshMeta(data);
                this.loadTagsFromLocal();
                $("#addtaginput").val('');
            }.bind(this),
            error: function(xhr, status, err) {
                var s = "Error ("+xhr.status+") "+err.toString();
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
            switch(this.state.viewas) {
                case "table":
                    viewTagsAs = (
                        <TagsTable
                            data={this.state.data}
                            sort={this.state.sort}
                            hidedone={this.state.hidedone}
                            filtername={this.state.filtername}
                            filtertime={this.state.filtertime}
                            onDeleteHash={this.deleteHash}
                            onChangeHideDone={this.changeHideDone}
                            onLoadTagsFromLocal={this.loadTagsFromLocal}
                            onClickSortNameAZ={this.clickSortNameAZ}
                            onClickSortNameZA={this.clickSortNameZA}
                            onClickSortTimeNewOld={this.clickSortTimeNewOld}
                            onClickSortTimeOldNew={this.clickSortTimeOldNew}
                            onClickSortSizeBigSmall={this.clickSortSizeBigSmall}
                            onClickSortSizeSmallBig={this.clickSortSizeSmallBig}
                            onClickSortTypeAZ={this.clickSortTypeAZ}
                            onClickSortTypeZA={this.clickSortTypeZA}
                        />
                    );
                    tagSortBar = '';
                    break;
                case "buttons":
                default:
                    viewTagsAs = (
                        <TagsListB data={this.state.data} />
                    );
                    var classObj = {
                        "done":'',
                        "type":'',
                        "name":'',
                        "size":'',
                        "time":''
                    };
                    switch(this.state.sort) {
                        case "nameaz":
                        case "nameza":
                            classObj["name"] = " btn-primary";
                            break;
                        case "typeaz":
                        case "typeza":
                            classObj["type"] = " btn-primary";
                            break;
                        case "sizebigsmall":
                        case "sizesmallbig":
                            classObj["size"] = " btn-primary";
                            break;
                        case "timenewold":
                        case "timeoldnew":
                            classObj["time"] = " btn-primary";
                            break;
                    }
                    tagSortBar = (
                        <div
                            className="pull-left tagoptions">
                            <div
                                className="btn-group"
                                role="group"
                                aria-label="...">
                                <button
                                    type="button"
                            className={"btn btn-default"+classObj["type"]}
                            aria-expanded="false"
                                    onClick={this.clickSortTypeAZ}>
                                    <span
                        className="glyphicon glyphicon glyphicon-sort"
                        aria-hidden="true">
                                    </span><span className="btnlabel">
Type
                                    </span>
                                </button>
                                <button
                                    type="button"
                            className={"btn btn-default"+classObj["name"]}
                            aria-expanded="false"
                                    onClick={this.clickSortNameAZ}>
                                    <span
                        className="glyphicon glyphicon-sort-by-alphabet"
                        aria-hidden="true">
                                    </span><span className="btnlabel">
Name
                                    </span>
                                </button>
                                <button
                                    type="button"
                            className={"btn btn-default"+classObj["size"]}
                            aria-expanded="false"
                                    onClick={this.clickSortSizeBigSmall}>
                                    <span
                        className="glyphicon glyphicon-sort-by-attributes-alt"
                        aria-hidden="true">
                                    </span><span className="btnlabel">
Largest
                                    </span>
                                </button>
                                <button
                                    type="button"
                            className={"btn btn-default"+classObj["time"]}
                            aria-expanded="false"
                                    onClick={this.clickSortTimeNewOld}>
                                    <span
                        className="glyphicon glyphicon-time"
                        aria-hidden="true">
                                    </span><span className="btnlabel">
Newest
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                    break;
            }
            var refresh = (
                <button
                    type="button"
                    className="btn btn-default"
                    id="fetchtags"
                    onClick={this.clickRefreshTags}
                    >
                    <span
                        className="glyphicon glyphicon-refresh"
                        aria-hidden="true">
                    </span><span className="btnlabel">
Refresh
                    </span>
                </button>
            );
            var tabletile = (
                <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.clickViewAs}>
                    <span
                        className="glyphicon glyphicon-th-list"
                        aria-hidden="true">
                    </span><span className="btnlabel">
Table/Tiles
                    </span>
                </button>
            );
            var previewall = (
                <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.clickPreviewAll}>
                    <span
                        className="glyphicon glyphicon-glass"
                        aria-hidden="true">
                    </span><span className="btnlabel">
Load Previews
                    </span>
                </button>
            );
            var addtagform = '';
            if ( (ALLOWADDTAG==undefined) || (ALLOWADDTAG=="true") ) {
                addtagform = (
                    <form className="form-inline">
                		<div className="form-group">
                		    <input
                                type="text"
                                className="form-control"
                                id="addtaginput"
                                placeholder="tag"/>
                		</div>
                		<button
                            type="submit"
                            className="btn btn-success"
                            id="addtagbutton"
                            onClick={this.addTag}>
Add tag
                        </button>
                    </form>
                );
            }
            if (getHashFromLocation()) {
                return (
                    <div className="tagsouter">
                        <h4>{this.props.title}</h4>
                        {addtagform}
                        <div className="pull-left tagoptions">
                            <div
                                className="btn-group"
                                role="group"
                                aria-label="...">
                                {tabletile}
                                {previewall}
                                {refresh}
                            </div>
                        </div>
                        {tagSortBar}
                        {viewTagsAs}
                    </div>
                );
            } else {
                //no refresh
                return (
                    <div className="tagsouter">
                        <h4>{this.props.title}</h4>
                        <div className="pull-left tagoptions">
                            <div
                                className="btn-group"
                                role="group"
                                aria-label="...">
                                {tabletile}
                                {previewall}
                            </div>
                        </div>
                        {tagSortBar}
                        {viewTagsAs}
                    </div>
                );
            }
        /*} else {
            return null;
        }*/
    }
});
/*============================================================================*/
var TagListBButton = React.createClass({
    render: function() {
        var typeicon = (
            <MetaFileIcon
                hash={this.props.hash}
                type={this.props.type}
                name={this.props.name}
                myclass={"typeicon"}
            />
        );
        var metasize = '';
        if (this.props.size!=0) {
            metasize = (
                <span className="size">
                    {numberFormat(this.props.size) + " bytes"}
                </span>
            );
        }
        var metatime = '';
        if (this.props.time) {
            metatime = (
                <span
                    className="time"
                    data-livestamp={Date.parse(this.props.time)/1000}>
                </span>
            );
        }
        var dropdown = '';
        var dropbutton = '';
        var strippedname = this.props.name;
        var externalurl = '';
        var tagscount = '';
        if (this.props.name.match(/https?:\/\/.*/)) {
            var eurl = this.props.name.match(/https?:\/\/.*/);
            strippedname = this.props.name.replace(
                eurl,
                ''
            );
            externalurl = (
                <li><a href={eurl}>{eurl}</a></li>
            );
            //has external url
            dropdown = (
                <ul className="dropdown-menu" role="menu">
                    {externalurl}
                </ul>
            );
            dropbutton = (
                <button
                    type="button"
                    className="btn dropdown-toggle"
                    data-toggle="dropdown"
                    aria-expanded="false">
                    <span className="glyphicon glyphicon-option-vertical"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                </button>
            );
        } else {
            if (!isFile(this.props)) {
                tagscount = (
                    <span className="badge">{this.props.count}</span>
                );
            }
        }
        var mainbutton = (
            <a
                href={"./get/"+this.props.hash}
                type="button"
                className="tagname">
                {strippedname}
                {tagscount}
            </a>
        );
        return (
            <li className="tagitem">
                <div className="tagwrapper">
                    <div className="tagtop">
                        {typeicon}
                        {dropbutton}
                        {mainbutton}
                        {dropdown}
                    </div>
                    <div
                        id={"previewdiv"+this.props.hash}
                        className="previewdiv"></div>
                    {metasize}
                    {metatime}
                    <div
                        className="tagbottom">
                    </div>
                </div>
            </li>
        );
    }
});
/*============================================================================*/
var TagsListB = React.createClass({
    render: function() {
        var tagNodes = [];
        this.props.data.forEach(function(o) {
            if ( (o.name) && (o.time) ) {
                tagNodes.push(
                    <TagListBButton
                        hash={o.hash}
                        name={o.name}
                        type={o.type}
                        size={o.size}
                        time={o.time}
                        count={o.tags.length}
                    />
                );
            }
        }.bind(this));
        return (
            <ul className="taglist">
                {tagNodes}
            </ul>
        );
    }
});
/*============================================================================*/
function tagsFor(id, title) {
    if (document.getElementById(id)) {
        React.render(
            <TagsOuter
                title={title}
                pollIntervalRemote={POLLINTERVALREMOTE}
            />,
            document.getElementById(id)
        );
    }
}
