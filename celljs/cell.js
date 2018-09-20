var start, lastStart, cell_autosave;
var cell_changed = false;
var cell_added = false;
var cell_elementonchange = null;
var cell_saveworking = false;
var cell_deferred;

function cell_init(code) {

    $(".cell").css('vertical-align', 'middle');


    $(".cell").each(function (i) {
        var c = $(".cell").eq(i);
        if ($(c).parent().data("code"))
            if ($(c).parent().data("code").toLowerCase() == code.toLowerCase() && c.data('old') == undefined) {
                if (isIE() || isEdge()) {
                    c.data('old', $(".cell").eq(i).children('div').html());
                }
                else {
                    c.data('old', $(".cell").eq(i).html());
                }
                c.click(function () {
                    if (start != this) cell_focus(this);
                });
                c.keydown(function (e) { return cell_keyCheck(e) });
            }
    });

    $(".cell-editor-textbox").each(function (i) {
        var c = $(".cell-editor-textbox").eq(i);
        if (isIE() || isEdge()) {
            if ($(c).parent().data("code").toLowerCase() == code.toLowerCase()
                && $(".cell-editor-textbox").eq(i).children('div').attr('contenteditable') == undefined) {
                txt = $(".cell-editor-textbox").eq(i).html();
                $(".cell-editor-textbox").eq(i).html("<div contenteditable='true' placeholder='Enter Text Here...' style='overflow:none'>" + txt + "</div>")
            }
        }
        else {
            if ($(c).parent().data("code").toLowerCase() == code.toLowerCase() && $(".cell-editor-textbox").eq(i).attr('contenteditable') == undefined) {
                $(".cell-editor-textbox").eq(i).attr('contenteditable', 'true');
                $(".cell-editor-textbox").eq(i).attr('placeholder', 'Enter Text Here...');
                $(".cell-editor-textbox").eq(i).css('overflow', 'auto');

            }
        }
    });

    $(".cell-editor-datepicker").each(function (i) {
        var c = $(".cell-editor-datepicker").eq(i);
        if (isIE() || isEdge()) {
            if ($(c).parent().data("code").toLowerCase() == code.toLowerCase()
                && $(".cell-editor-datepicker").eq(i).children('div').attr('contenteditable') == undefined) {

                txt = $(".cell-editor-datepicker").eq(i).html();
                d1 = new Date(txt);
                d = d1.getDate() + '/' + (d1.getMonth() + 1) + '/' + d1.getFullYear();
                $(".cell-editor-datepicker").eq(i).html("<div contenteditable='true' data-date='" + d + "'>" + txt + "</div>");

                $('.cell-editor-datepicker').eq(i).children('div').datepicker({
                    autoclose: true,
                    format: "dd M yyyy",
                    onSelect: function (date) {
                        $(this).html(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());

                    }
                })
                    .on('changeDate', function (ev) {
                        if (ev.date != undefined) $(this).html(ev.date.getMonth() + 1 + '/' + ev.date.getDate() + '/' + ev.date.getFullYear());
                        cell_changed = true;
                        cell_button_onsave(start, true);

                        cell_elementonchange = start;
                        cell_edit(start);
                    });

                $('.cell-editor-datepicker').eq(i).children('div').focus(function () {
                    if ($(this).html() == '')
                        $(this).datepicker("setDate", new Date());

                });
            }
        }
        else {
            if ($(c).parent().data("code").toLowerCase() == code.toLowerCase()
                && $(".cell-editor-datepicker").eq(i).attr('contenteditable') == undefined) {

                $(".cell-editor-datepicker").eq(i).attr('contenteditable', 'true');
                d1 = new Date($(".cell-editor-datepicker").eq(i).html());
                d = d1.getDate() + '/' + (d1.getMonth() + 1) + '/' + d1.getFullYear();
                $(".cell-editor-datepicker").eq(i).data("date", d);

                $('.cell-editor-datepicker').eq(i).datepicker({
                    autoclose: true,
                    format: "dd M yyyy",
                    onSelect: function (date) {
                        $(this).html(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
                    }
                })
                    .on('changeDate', function (ev) {
                        if (ev.date != undefined) $(this).html(ev.date.getMonth() + 1 + '/' + ev.date.getDate() + '/' + ev.date.getFullYear());
                        cell_changed = true;
                        cell_button_onsave(start, true);

                        cell_elementonchange = start;
                        cell_edit(start);
                    });

                $('.cell-editor-datepicker').eq(i).focus(function () {
                    if ($(this).html() == '')
                        $(this).datepicker("setDate", new Date());
                });
            }
        }
    });

    $(".cell-editor-checkbox").each(function (i) {
        var c = this;
        if ($(c).parent().data("code").toLowerCase() == code.toLowerCase() && $(c).children("input").length == 0) {
            var isChecked = ($(c).html() == '1' ? 'checked' : '');
            $(c).html("<input type='checkbox' data-child='Y' " + isChecked + " />");
            $(c).click(function (e) {
                var chk = $(this).closest("tr").find("input:checkbox").get(0);
                if (e.target != chk) {
                    if (start == c) {
                        cell_save();
                        chk.checked = !chk.checked;
                        cell_changed = true;
                        cell_button_onsave(start, true);
                        cell_elementonchange = start;
                        cell_edit(start);
                    }
                }

            });
            $(c).find("input").click(function () {
                cell_save();
                cell_changed = true;
                cell_button_onsave(start, true);
                start = $(this).parent();
                cell_elementonchange = start;
                cell_edit(start);

            });
        }
    });

    $(".cell-editor-select2").each(function (i) {
        var c = $(".cell-editor-select2").eq(i);
        if ($(c).parent().data("code").toLowerCase() == code.toLowerCase()) {

            if ($(".cell-editor-select2").eq(i).children("span").length == 0) {
                var fn = $(c).data("field");
                var cd = $(c).parent().data("code");
                var id = $(c).data("id");
                var selid = fn + '_' + $(this).parent().data("guid");

                $(".cell-editor-select2").eq(i).html('<span><select id="' + selid + '" style="width:100%" data-child="Y"></select></span>');
                $(".cell-editor-select2").eq(i).data("old", id);
                var wf1 = '', wf2 = '';
                $(".cell-editor-select2").eq(i).children('span').children("select").select2({
                    placeholder: 'Choose on list',
                    onAdd: function (x) {
                        g = $(start).parent().data("guid");
                        var preview = $(start).data("preview");
                        cell_preview($(this).data("preview"), getCode(), g, this);
                    },

                    ajax: {
                        url: "OPHCORE/api/msg_autosuggest.aspx",
                        delay: 0,
                        data: function (params) {
                            var query = {
                                code: $(this).parent().parent().parent().data("code"),
                                colkey: $(this).parent().parent().data("field"),
                                search: params.term,
                                wf1value: $(this).parent().parent().parent().find('[data-field="' + $(this).parent().parent().data("wf1") + '"]').find("select").length == 0 ? $('#' + $(this).parent().parent().data("wf1")).val() : $(this).parent().parent().parent().find('[data-field="' + $(this).parent().parent().data("wf1") + '"]').find("select").val(),
                                wf2value: $(this).parent().parent().parent().find('[data-field="' + $(this).parent().parent().data("wf2") + '"]').find("select").length == 0 ? $('#' + $(this).parent().parent().data("wf2")).val() : $(this).parent().parent().parent().find('[data-field="' + $(this).parent().parent().data("wf2") + '"]').find("select").val(),
                                page: params.page
                            }
                            return query;
                        },
                        dataType: 'json',
                    }
                });

                autosuggest_setValue(cell_deferred, selid, cd, fn, id, '', '');

                $(".cell-editor-select2").eq(i).css("padding", "2px");

                $(".cell-editor-select2").eq(i).change(function () {
                    var id = $(".cell-editor-select2").eq(i).data("id");
                    var o = $(".cell-editor-select2").eq(i).find("select").data("old");
                    var v = $(".cell-editor-select2").eq(i).find("select").val();
                    var preview = $(".cell-editor-select2").eq(i).data("preview");
                    cell_autosuggest_onchange(this, getCode(), id);
                    if (v != o && v != 'NULL') {
                        cell_changed = true;
                        cell_button_onsave(start, true);

                        cell_elementonchange = start;
                        cell_edit(start);

                        setTimeout(function () {

                            g = $(start).parent().data("guid");
                            var preview = $(start).data("preview");
                            cell_preview(preview, code, g, null, start);
                        }, 100);
                    }
                })

                $(".cell-editor-select2").eq(i).find('span').find("select").on('open', function () {
                    this.$search.attr('tabindex', 0);
                    //self.$search.focus(); remove this line
                    setTimeout(function () { this.$search.focus(); }, 10);//add this line})
                });
            }
        }
    });

    $(".select2-selection").css("border-style", "none");


    $(".cell-parentSelector").each(function (i) {
        var c = $(".cell-parentSelector").eq(i);
        if ($(c).parent().data("code").toLowerCase() == code.toLowerCase() && !c.find("span").is("span") && ($(c).parent().data("guid") != '00000000-0000-0000-0000-000000000000')) {
            c.html('<span><ix class="fa fa-plus"></ix></span>');
            c.click(function () {
                if ($(this).children('span').find('ix').hasClass("fa-plus")) {
                    //cell_expand(this);
                    $(this).children('span').find('ix').removeClass("fa-plus");
                    $(this).children('span').find('ix').addClass("fa-minus");
                    $("#tr2_" + $(this).parent().data("code") + $(this).parent().data("guid")).css("display", "");
                    cd = $(c).parent().data("code").toLowerCase();
                    gd = $(c).parent().data("guid");    //.split("-").join("");
                    eval("loadChild_" + cd + "('" + gd + "')");
                }
                else {
                    $(this).children('span').find('ix').removeClass("fa-minus");
                    $(this).children('span').find('ix').addClass("fa-plus");
                    $("#tr2_" + $(this).parent().data("code") + $(this).parent().data("guid")).css("display", "none");
                    //cell_collapse(this);
                }
            })
        }
    });
    $(".cell-recordSelectors").each(function (i) {
        if ($(".cell-recordSelectors").eq(i).children("span").length == 0) {
            $(".cell-recordSelectors").eq(i).html("<span><ix class='fas fa-thumbtack'></ix></span>");

            $(".cell-recordSelectors").eq(i).click(function () {
                cell_selectAll(this);
            });
        }

    });
    $(".cell-recordSelector").each(function (i) {
        var c = $(".cell-recordSelector").eq(i);
        if ($(c).parent().data("code").toLowerCase() == code.toLowerCase() && !c.find("span").is("span")) {
            c.html('<span><ix class="fa"></ix></span>');

            c.click(function () {

                if ($(this).children('span').find('ix').hasClass("fa-pencil")) cell_save();
                else //if (!$(this).children('span').find('ix').hasClass("fa-thumb-tack"))
                    cell_recordSelector(this);
            });

            c.mouseover(function () {
                if (!$(this).children('span').find('ix').hasClass("fa-thumbtack") && !$(this).children('span').find('ix').hasClass("fa-pencil"))
                    $(this).children('span').find('ix').addClass("fa-caret-right");
            });

            c.mouseout(function () {
                if (!$(this).children('span').find('ix').hasClass("fa-thumbtack") && !$(this).children('span').find('ix').hasClass("fa-pencil"))
                    $(this).children('span').find('ix').removeClass("fa-caret-right");
            });
        }
    });


    //document.onkeydown = cell_keyCheck;

    window.onbeforeunload = function (event) {
        if (cell_added || cell_changed) {
            var message = 'Some data not yet saved. Are you sure want to leave?';
            if (typeof event == 'undefined') {
                event = window.event;
            }
            if (event) {
                event.returnValue = message;
            }
            return message;
        }
    }

}

function cell_defer(def) {
    cell_deferred = def;

}
function cell_focus(sibling, mode) {	//mode=0 normal, mode=1 force, mode=2 save, mode=3 cancel
    if (mode == undefined) mode = 0;
    //if (cell_added && $(sibling).parent().attr("id") != $(start).parent().attr("id")) {
    //    showMessage("Please complete your new line, press ESC to cancel.", 1, start, function () { cell_setFocus(start); })

    //}
    if (sibling != null) {
        sibling.focus();
        if (start != sibling || mode == 1) {
            cell_blur(sibling);

            cell_setFocus(sibling);
            start = sibling;
        }
    }

}


function cell_keyCheck(e) {
    var isPrevent = true;
    e = e || window.event;

    var kc = e.keyCode;
    var shift = e.shiftKey;

    if (kc == '13' && !shift) {
        kc = '9'
        return false;
    };         //if enter, changed to tab
    if (kc == '13' && shift) {
        shift = false;    //if shift-enter, changed to enter
        return false;
    }

    if (kc == '9') {	//tab
        if (shift) 	//shift-tab
            kc = 37;		//right
        else
            kc = 39;		//left
    }

    if (kc == '27') {	//esc
        cell_cancelSave();

    } else if (kc >= 112 && kc <= 121) {	//f1-f10
        if (kc == '113') {  //f2
            if (!window.getSelection().isCollapsed) {
                if (isIE() || isEdge()) {
                    placeCaretAtEnd($(start).children("div")[0]);
                }
                else {
                    placeCaretAtEnd($(start)[0]);
                }

            }
            else
                cell_focus(start, 1);

        }
    } else if (kc == 38) {	// up arrow
        if ($(start).length > 0) {
            var idx = $(start)[0].cellIndex;
            var nextrow = $(start).parent().prev().prev();
            if ($(start).parent().find(".cell-parentSelector").length > 0) idx--;

            if (nextrow != null) {
                var sibling = $(nextrow).children("td.cell").eq(idx - 1);
                if ($(sibling).length > 0) cell_focus(sibling);

            }
        }
    } else if (kc == 40) {	// down arrow
        if ($(start).length > 0) {
            var idx = $(start)[0].cellIndex;
            var nextrow = $(start).parent().next().next();
            if ($(start).parent().find(".cell-parentSelector").length > 0) idx--;

            if (nextrow != null) {
                var sibling = $(nextrow).children("td.cell").eq(idx - 1);
                if ($(sibling).length > 0) cell_focus(sibling);

            }
        }
    } else if (kc == '37') {	// left arrow
        if ($(start).length > 0) {
            var idx = $(start)[0].cellIndex;
            if ($(start).parent().find(".cell-parentSelector").length > 0) idx--;

            $(start).parent().children("td.cell").each(function (i) {
                if (i == idx - 2) {
                    var sibling = $(start).parent().children("td.cell").eq(i);
                    if ($(sibling).length > 0) cell_focus(sibling);
                }
            });
        }

    } else if (kc == '39') {	// right arrow
        if ($(start).length > 0) {
            var idx = $(start)[0].cellIndex;
            if ($(start).parent().find(".cell-parentSelector").length > 0) idx--;

            $(start).parent().children("td.cell").each(function (i) {
                if (i == idx) {
                    var sibling = $(start).parent().children("td.cell").eq(i);
                    if ($(sibling).length > 0) cell_focus(sibling);
                }
            });

        }

    } else if ($(start).hasClass('cell-editor-checkbox') && kc == '32') {	//space for checkbox
        var c = $(start).find("input").prop("checked");
        $(start).find("input").prop("checked", !c);
        //($(start).find(".input").checked();

    } else if (kc != undefined && kc != 16) {   //any else
        cell_edit(start);
        isPrevent = false;
    }

    if (isPrevent) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function selectAllText(div) {
    //var div = document.getElementById("editable");
    if (window.getSelection && document.createRange) {
        range = document.createRange();
        range.selectNodeContents(div);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(div);
        range.select();
    }
    //div.onfocus = function () {
    //    window.setTimeout(function () {
    //        var sel, range;
    //        if (window.getSelection && document.createRange) {
    //            range = document.createRange();
    //            range.selectNodeContents(div);
    //            sel = window.getSelection();
    //            sel.removeAllRanges();
    //            sel.addRange(range);
    //        } else if (document.body.createTextRange) {
    //            range = document.body.createTextRange();
    //            range.moveToElementText(div);
    //            range.select();
    //        }
    //    }, 1);
    //};
}

function cell_recordSelector(t) {
    $(t).parent().parent().find("tr").each(function (i) {
        $(t).parent().parent().find("tr").eq(i).find(".cell-recordSelector").children("span").children("ix").removeClass("fa-caret-right");
    })
    if ($(t).children("span").children("ix").hasClass("fa-thumbtack")) {
        $(t).children("span").children("ix").removeClass("fa-thumbtack");
        $(t).children("span").children("ix").addClass("fa-caret-right");
    }
    else {
        $(t).children("span").children("ix").removeClass("fa-caret-right");
        $(t).children("span").children("ix").addClass("fa-thumbtack");
    }
}
function cell_cancelSave() {
    if (cell_added) cell_cancelAdded();
    else cell_cancelChange();
}

function cell_cancelChange() {
    t = cell_elementonchange;
    $(t).parent().children("td.cell").each(function (i) {

        var e = $(t).parent().children("td.cell").eq(i);

        if ($(e).hasClass("cell-editor-checkbox"))
            $(e).find("input").val($(start).data("old") == "1" ? true : false);
        //else if ($(e).hasClass("cell-editor-select2"))
        else if ($(e).hasClass("cell-editor-datepicker")) {
            if (isIE() || isEdge())
                $(e).children('div').datepicker("setDate", $(e).data("old"));
            else
                $(e).datepicker("setDate", $(e).data("old"));
        }
        else if ($(e).hasClass("cell-editor-select2"))
            $(e).find("select").val($(e).find("select").data("old")).trigger("change");
        else {
            if (isIE() || isEdge()) {
                $(e).children('div').html($(e).data("old"));
            }
            else {
                $(e).html($(e).data("old"));
            }
        }
    })

    $(t).parent().find("td.cell-recordSelector").children("span").children("ix").removeClass("fa-pencil");
    $(t).parent().find("td.cell-recordSelector").children("span").children("ix").addClass("fa-caret-right");

    clearTimeout(cell_autosave);
    cell_changed = false;
    cell_button_onsave(start, false);

    cell_elementonchange = null;
}
function cell_setFocus(t) {
    $(t).attr('tabindex', '1');

    if (!$(t).parent().find('.cell-recordSelector').children('span').find('ix').hasClass("fa-pencil")) {
        $(t).parent().find('.cell-recordSelector').children('span').find('ix').addClass("fa-caret-right");
    }


    //if (!$(t).hasClass("cell-editor-select2")) $(t).find("select").select2('open');

    if ($(t).hasClass("cell-editor-textbox") || $(t).hasClass("cell-editor-datepicker")) {
        //$(t).focus(function() {document.execCommand('selectAll', false, null)});


        if (isIE() || isEdge()) {
            selectAllText($(t).children("div")[0]);
            $(t).children("div").focus();
        }
        else {
            selectAllText($(t)[0]);
            $(t).focus();
        }
    }
    else if ($(t).hasClass("cell-editor-select2") && !$(t).hasClass("select2-hidden-accessible")) {
        $(t).find("span").find("select").select2('open');
        $(".select2-search__field").focus();
    }
}
function cell_blur(next) {

    if ($(start).hasClass("cell-editor-select2") && $(start).hasClass("select2-hidden-accessible")) {
        try { $(start).find("span").find("select").select2('close'); } catch (e) { }
    }

    g = $(start).parent().data("guid");

    var preview = $(start).data("preview");
    var c
    if (c == undefined) {
        c = $(start).parent().data('code')
        if (c != undefined) {
            code = c
        }
    }
    if (start == undefined) {
        //cell_preview(preview, code, g, null, next);	//Samuel: 11/7/2018 remark karena pertama kali klik blur, akan panggil preview yang sebelumnya. Tidak perlu!
    }
    else {
        cell_preview(preview, code, g, null, start);
    }


    if ($(start).parent().attr("id") != $(next).parent().attr("id")) {

        cell_save()

        cell_clearTack(next);
        $(start).parent().find('.cell-recordSelector').children('span').find('ix').removeClass("fa-caret-right");
        //$(next).parent().find('.cell-recordSelector').children('span').find('ix').addClass("fa-caret-right");  //start=next setelah save selesai

        //$(lastStart).parent().find('.cell-recordSelector').children('span').find('ix').removeClass("fa-caret-right");
        //$(start).parent().find('.cell-recordSelector').children('span').find('ix').addClass("fa-caret-right");  //start=next setelah save selesai
    }
    else {
    }
}

function cell_save(afterSuccess) {
    t = cell_elementonchange;

    if (!cell_saveworking) {
        if (cell_changed || cell_added) {
            cell_blur(start);

            clearTimeout(cell_autosave);
            var code = $(t).parent().data("code");
            var guid = $(t).parent().data("guid");
            var formId = '';
            if (code != undefined) {
                cell_saveworking = true;

                lastStart = start;

                $(t).parent().children("td.cell").each(function (i) {
                    if (isIE() || isEdge()) {
                        if ($(t).parent().children("td.cell").eq(i).children('div').html() == 'Enter Text Here...') {
                            $(t).parent().children("td.cell").eq(i).children('div').html('');
                        }

                    }
                    else {
                        if ($(t).parent().children("td.cell").eq(i).html() == 'Enter Text Here...') {
                            $(t).parent().children("td.cell").eq(i).html('');
                        }
                    }
                });

                var data = '';// new FormData();
                $("#tr1_" + code.toLowerCase() + guid).children("td.cell").each(function (i, td) {
                    if (!$(td).hasClass("cell-disabled")) {
                        f = $("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).data("field");
                        if ($("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).hasClass("cell-editor-select2"))
                            d = $("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).find("select").val();
                        else if ($("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).hasClass("cell-editor-checkbox"))
                            d = $("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).find("input").prop('checked') ? 1 : 0;
                        else {
                            if (isIE() || isEdge()) {
                                d = $("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).children('div').html();
                            }
                            else {
                                d = $("#tr1_" + code.toLowerCase() + guid).children("td.cell").eq(i).html();
                            }
                        }
                        if (d != undefined && d != null) data = data + f + '=' + d.toString().replace("&nbsp;", " ") + '&';
                    }
                });

                if ($("#tr1_" + code.toLowerCase() + guid).parents("tr").length > 0)
                    cid = $("#" + $("#tr1_" + code.toLowerCase() + guid).parents("tr").attr("id").split("tr2").join("tr1")).data("guid");//gchild
                else
                    cid = $("#cid").val();//child

                //data.append("cid", cid);
                data = data + "cid" + '=' + cid;

                dataFrm = data;//.serialize();

                saveFunction1(code, guid, '30', formId, dataFrm, function (data) {
                    var msg = $(data).children().find("message").text();
                    var retguid = $(data).children().find("guid").text();
                    var reload = $(data).children().find("reload").text();
                    var parentKey = document.getElementById('PKName').value;

                    if (isGuid(msg)) retguid = msg;    //compatible with old version
                    
                    if (retguid != "") {                    
                        if (retguid == guid) {//update
                            $(lastStart).parent().children("td.cell").each(function (i) {
                                if (isIE() || isEdge()) {
                                    var h = $(lastStart).parent().children("td.cell").eq(i).children('div').html();
                                }
                                else {
                                    var h = $(lastStart).parent().children("td.cell").eq(i).html();
                                }
                                $(lastStart).parent().children("td.cell").eq(i).data("old", h);
                            })

                            //$(lastStart).parent().find("td.cell-recordSelector").find("ix").addClass("fa-caret-right");
                            $(lastStart).parent().find("td.cell-recordSelector").find("ix").removeClass("fa-pencil");

                            $(start).parent().find('.cell-recordSelector').children('span').find('ix').addClass("fa-caret-right");  //start=next setelah save selesai


                            cell_changed = false;
                            cell_button_onsave(start, false);

                            cell_elementonchange = null;
                            var modes = getCookie(code.toLowerCase() + '_browseMode');
                            if (modes == '') modes = 'inline';
                            if (reload == '1') loadChild(code, parentKey, cid, null, modes, "undefined");

                        }
                        else if (retguid != guid) {//new
                            $(lastStart).parent().data("guid", retguid);
                            $(lastStart).parent().attr("id", "tr1_" + $(lastStart).parent().data("code") + retguid);
                            $(lastStart).parent().next().attr("id", "tr2_" + $(lastStart).parent().data("code") + retguid);
                            $(lastStart).parent().find("select").each(function (i) {
                                $(lastStart).parent().find("select").eq(i).attr("id", $(lastStart).parent().find("select").eq(i).attr("id").replace(guid, retguid));
                            });

                            //$(lastStart).parent().find("td.cell-recordSelector").find("ix").addClass("fa-caret-right");
                            $(lastStart).parent().find("td.cell-recordSelector").find("ix").removeClass("fa-pencil");

                            $(start).parent().find('.cell-recordSelector').children('span').find('ix').addClass("fa-caret-right");  //start=next setelah save selesai

                            //loadChild(code);
                            cell_init(code);
                            cell_changed = false;
                            cell_added = false;
                            cell_button_onsave(start, false);

                            cell_elementonchange = null;

                            if (reload == '1') loadChild(code, parentKey, cid, null, "inline", "undefined");
                        }
                        if (typeof afterSuccess == "function") afterSuccess(data);
                    }
                    else {//error
                        showMessage(msg, 4);
                        //cell_changed = false;
                        cell_focus(lastStart);

                    }
                    cell_saveworking = false;
                });
            }
        }
    }
}

function cell_edit(t) {
    if (!$(t).hasClass("cell-disabled")) {
        cell_clearTack(t);
        $(t).parent().find("td.cell-recordSelector").find("ix").removeClass("fa-caret-right");
        $(t).parent().find("td.cell-recordSelector").find("ix").addClass("fa-pencil");

        cell_changed = true;
        cell_button_onsave(start, true);
        cell_elementonchange = t;
        cell_autosave = setTimeout(function () { cell_save() }, 60000);
    }
}

function cell_clearTack(t) {
    $(t).parent().parent().find("tr").each(function (i) {
        $(t).parent().parent().find("tr").eq(i).find("td.cell-recordSelector").find("ix").removeClass("fa-thumbtack");
    });
}

function cell_add(code, columns, isParent, t) {
    if (cell_added || cell_changed) {
        cell_save(function () {
            cell_add(code, columns, isParent, t);
        });
    }
    else {

        //var cx = columns.split(",");
        var columns_string = "";
        columns.forEach(function (ix) {

            //ix = i.split(":")
            if (ix[0].split("=")[0] != "")
                columns_string += "<td class='cell cell-editor-" + ix[0].split("=")[1].trim() + "' data-field='" + ix[1].split("=")[1] + "' data-preview='" + ix[2].split("=")[1] + "' data-wf1='" + ix[4].split("=")[1] + "' data-wf2='" + ix[5].split("=")[1] + "' align='" + (ix[6].split("=")[1] == '2' ? 'right' : (ix[6].split("=")[1] == '1' ? 'center' : 'left')) + "'>" + ix[3].split("=")[1] + "</td>"
            else
                if (ix[1].split("=")[0] == undefined) columns_string += "<td class='cell'></td>"
        });

        //if ($("tbody#" + code + "").parent().data("haschildren")=='1') tdparent = "<td class='cell-parentSelector'></td>";
        $(t).parent().parent().children("div").children("table").children("tbody").append("<tr id='tr1_" + code + "00000000-0000-0000-0000-000000000000' data-code='" + code + "' data-guid='00000000-0000-0000-0000-000000000000'>"
            + (isParent > 0 ? "<td class='cell-parentSelector'></td>" : "")
            + "<td class='cell-recordSelector'></td>" + columns_string + "</tr>"
            + (isParent ? "<tr id='tr2_" + code + "00000000-0000-0000-0000-000000000000' style='display:none'><td colspan='100'></td></tr>" : ""))
        cell_init(code);

        start = null;
        lastStart = null;
        n = $("#tr1_" + code + "00000000-0000-0000-0000-000000000000").find(".cell").eq(0);
        $(n).parent().find("td.cell-recordSelector").find("ix").addClass("fa-pencil");
        cell_focus(n);
        cell_preview(1, code, "00000000-0000-0000-0000-000000000000", null, n);
        cell_added = true;
        cell_elementonchange = n;
        cell_button_onsave(n, true);

    }
}

function cell_cancelAdded() {
    t = cell_elementonchange;
    cell_button_onsave(t, false)

    $(t).parent().remove();
    clearTimeout(cell_autosave);
    cell_added = false;
    cell_changed = false;

    clearTimeout(cell_autosave);
    start = null;

}

function cell_delete(code, t) {
    var guidlist = [];
    var cid = $("#cid").val();
    var parentKey = document.getElementById('PKName').value;
    var mode = getCookie(code.toLowerCase() + '_browseMode')

    $(t).parent().parent().children("div").children("table").children("tbody").children("tr").children("td.cell-recordSelector").children("span").children("ix.fa-thumbtack").each(function (i) {
        guidlist.push($(t).parent().parent().children("div").children("table").children("tbody").children("tr").children("td.cell-recordSelector").children("span").children("ix.fa-thumbtack").eq(i).parent().parent().parent().data("guid"));
    });
    if (guidlist.length > 0) {
        var g = guidlist.join(",")
        btn_function(code, g, 'delete', null, 30, null, null, function (data) {
            //alert("deleted");
        });
        loadChild(code, parentKey, cid, null, mode, "undefined");
    }
    else showMessage("Please tack at least one record to be deleted.", 4)
}

function cell_expand(t) {
    //$(t).parent().parent().parent().
}

function cell_collapse(t) {
}

function cell_preview(flag, code, GUID, formid, t) {
    var data = '';// new FormData();
    $("#tr1_" + code.toLowerCase() + GUID).children("td.cell").each(function (i, td) {
        if (!$(td).hasClass("cell-disabled")) {
            f = $("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).data("field");

            if ($("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).hasClass("cell-editor-select2"))
                d = $("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).find("select").val();
            else if ($("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).hasClass("cell-editor-checkbox"))
                d = $("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).find("input").val() == 'on' ? '1' : '0';
            else {
                if (isIE() || isEdge()) {
                    d = $("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).children('div').html();
                }
                else {
                    d = $("#tr1_" + code.toLowerCase() + GUID).children("td.cell").eq(i).html();
                }
            }
            if (d != undefined) data = data + f + '=' + d.toString().replace("&nbsp;", " ") + '&';
        }
    });

    if ($("#tr1_" + code.toLowerCase() + GUID).parents("tr").length > 0)
        cid = $("#" + $("#tr1_" + code.toLowerCase() + GUID).parents("tr").attr("id").split("tr2").join("tr1")).data("guid");//gchild
    else
        cid = $("#cid").val();//child

    //data.append("cid", cid);
    data = data + "docGUID" + '=' + cid;

    dataFrm = data;//.serialize();

    previewFunction(flag, code, GUID, formid, dataFrm, t, function (data) {
        $(data).find("message").children().each(function () {
            dt = this;
            $(t).parent().children("td.cell").each(function (i) {
                if ($(t).parent().children("td.cell").eq(i).data("field") == dt.tagName) {

                    if ($(t).parent().children("td.cell").eq(i).hasClass('cell-editor-select2')) {

                        var c = $(t).parent().children("td.cell").eq(i);
                        var fn = $(c).data("field");
                        var cd = $(c).parent().data("code");
                        var id = $(dt).text();  //default value
                        var selid = fn + '_' + $(this).parent().data("guid");

                        autosuggest_setValue(undefined, selid, cd, fn, id, '', '');

                        //autosuggestSetValue(this.tagName, code, this.tagName, this.textContent);


                        //var checktext = $(this.nextSibling)[0]
                        //if (checktext == this.tagName + '_name') {
                        //    var newOption = new Option($(this.nextSibling).text(), $(this).text(), true, true);
                        //    $("#" + this.tagName).append(newOption).trigger('change');
                        //} else {
                        //    autosuggestSetValue(this.tagName, code, this.tagName, this.textContent);
                        //}
                    } else {
                        //document.getElementById(this.tagName).value = $(this).text();
                        if (isIE() || isEdge()) {
                            $(t).parent().children("td.cell").eq(i).children('div').html($(dt).text());
                        }
                        else {
                            $(t).parent().children("td.cell").eq(i).html($(dt).text());
                        }
                    }
                }

            })

        })


    });
}

function cell_autosuggest_onchange(ini, code, GUID) {
    var dataOld = $(ini).find("select").data('old');
    var dataValue = $(ini).find("select").val();

    if (dataOld != dataValue) {
        $(ini).find("select").data('old', dataValue);


    }
}
function cell_selectAll(t) {
    $(t).parent().parent().parent().find("tr").each(function (i) {
        tx = $(t).parent().parent().parent().find("tr").eq(i).find(".cell-recordSelector");
        if ($(tx).children("span").children("ix").hasClass("fa-thumbtack")) {
            $(tx).children("span").children("ix").removeClass("fa-thumbtack");
            //$(tx).children("span").children("ix").addClass("fa-caret-right");
        }
        else {
            $(tx).children("span").children("ix").removeClass("fa-caret-right");
            $(tx).children("span").children("ix").addClass("fa-thumbtack");
        }
    })
}

function cell_button_onsave(t, flag) {
    if (flag) {
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_add").text("SAVE & ADD NEW");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_save").css("display", "inline");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_cancel").css("display", "inline");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_delete").css("display", "none");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_download").css("display", "none");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_upload").css("display", "none");
    }
    else {
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_add").text("ADD");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_save").css("display", "none");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_cancel").css("display", "none");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_delete").css("display", "inline");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_download").css("display", "inline");
        $(t).parent().parent().parent().parent().parent().children(".box-footer").children("button#cell_button_upload").css("display", "inline");
    }
}