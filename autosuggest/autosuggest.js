
//autosuggest

function autosuggest_onchange(ini, flag, code, GUID, formid) {
    var dataOld = $(ini).data('old');
    var dataValue = $(ini).val();

    if (dataOld != dataValue) {
        $(ini).data('old', dataValue);
        preview(flag, code, GUID, formid, ini);
        if ($(ini).data("child") === 'Y') {
            $('#child_button_addSave').show();
            $('#child_button_save').show();
            $('#child_button_cancel').show();
            $('#child_button_delete').hide();
            $('#child_button_save2').show();
            $('#child_button_cancel2').show();
            $('#child_button_delete2').hide();
        }
        else {
            //$('#button_addSave').show();
            $('#button_save').show();
            $('#button_cancel').show();
            $('#button_submit').hide();
            $('#button_delete').hide();
            $('#button_approve').hide();
            $('#button_reject').hide();
            $('#button_close').hide();
            $('#button_save2').show();
            $('#button_cancel2').show();

            $('.action-save').show();
            $('.action-cancel').show();
            $('.action-submit').hide();
            $('.action-delete').hide();
            $('.action-approve').hide();
            $('.action-reject').hide();
            $('.action-close').hide();
        }

    }
}

function autosuggestSetValue(deferreds, SelectID, code, colKey, defaultValue, wf1, wf2) {
    autosuggest_setValue(deferreds, SelectID, code, colKey, defaultValue, wf1, wf2);
} //old version

function autosuggest_setValue(deferreds, SelectID, code, colKey, defaultValue, wf1, wf2, f) {
    //default value only
    if (wf1 == '' || wf1 == undefined) wf1 = 'wf1isnone';
    if (wf2 == '' || wf2 == undefined) wf2 = 'wf2isnone';
    if (defaultValue != '' && defaultValue != undefined) {
        if (deferreds) {
            deferreds.push($.ajax({
                url: "OPHCORE/api/msg_autosuggest.aspx",
                data: {
                    code: code,
                    colkey: colKey,
                    defaultValue: defaultValue,
                    wf1value: ($("#" + wf1).data("value") === undefined ? "" : $("#" + wf1).data("value")),
                    wf2value: ($("#" + wf2).data("value") === undefined ? "" : $("#" + wf2).data("value")),
                    parentCode: getCode()
                },
                dataType: "json",
                success: function (data) {
                    var newOption = new Option(data.results[0].text, data.results[0].id, true, true);
                    var InitialValue = data.results[0].id;
                    $("#" + SelectID).data("old", InitialValue);
                    $("#" + SelectID).val(InitialValue);
                    $("#" + SelectID).data("oldtext", data.results[0].text);
                    $("#" + SelectID).append(newOption).trigger('change');

                    $selection = $("#select2-" + SelectID + "-container").parents('.selection');
                    if ($selection.children('#removeForm' + SelectID).length === 0)
                        $('#removeForm' + SelectID).appendTo($selection);
                    $('#removeForm' + SelectID).show();

                    $selection = $("#select2-" + SelectID + "-container").parents('.selection');
                    if ($selection.children('#editForm' + SelectID).length === 0)
                        $('#editForm' + SelectID).appendTo($selection);
                    $('#editForm' + SelectID).show();
					
					if (typeof f === "function") f();
                }
            }));
        }
        else {

            $.ajax({
                url: "OPHCORE/api/msg_autosuggest.aspx",
                data: {
                    code: code,
                    colkey: colKey,
                    defaultValue: defaultValue,
                    wf1value: ($("#" + wf1).data("value") === undefined ? "" : $("#" + wf1).data("value")),
                    wf2value: ($("#" + wf2).data("value") === undefined ? "" : $("#" + wf2).data("value")),
                    parentCode: getCode()
                },
                dataType: "json",
                success: function (data) {
                    var newOption = new Option(data.results[0].text, data.results[0].id, true, true);
                    var InitialValue = data.results[0].id;
                    $("#" + SelectID).data("old", InitialValue);
                    $("#" + SelectID).val(InitialValue);
                    $("#" + SelectID).data("oldtext", data.results[0].text);
                    $("#" + SelectID).append(newOption).trigger('change');

                    $selection = $("#select2-" + SelectID + "-container").parents('.selection');
                    if ($selection.children('#removeForm' + SelectID).length === 0)
                        $('#removeForm' + SelectID).appendTo($selection);
                    $('#removeForm' + SelectID).show();

                    $selection = $("#select2-" + SelectID + "-container").parents('.selection');
                    if ($selection.children('#editForm' + SelectID).length === 0)
                        $('#editForm' + SelectID).appendTo($selection);
                    $('#editForm' + SelectID).show();

                }
            })
        }
    }

    //return aj;
}

function nextDataAutosuggest(ini, code, colkey, SelectID, wf1, wf2) {
    wf1 = undefined
    wf2 = undefined
    
    $("#" + SelectID).select2({      
        ajax: {
            url: "OPHCORE/api/msg_autosuggest.aspx",
            delay: 0, //500
            data: function (params) {
                var query = {
                code: code,
                colkey: colkey,
                /*search: params.term == undefined ? '' : params.term.toString().split('+').join('%2B'),*/
                wf1value: ($("#" + wf1).data("value") === undefined ? "" : $("#" + wf1).data("value")),
                wf2value: ($("#" + wf2).data("value") === undefined ? "" : $("#" + wf2).data("value")),
                parentCode: getCode(),
                page: params.page || 2
            }
        return query;
        
        },
        dataType: 'json',

        /*
        results: function (data) {
            return {
                results: $.map(data, function(obj) {
                    return { id: obj.id, text: obj.text };
                })
            };
        },*/



        results: function (data, params) {
            params.page = params.page || 1;
            return {
                results: $.map(data, function (obj) {
                    return {
                        id: obj.name, text: obj.name
                    };
                })
            };
        },

        cache: true

    }
    });

    $("#" + SelectID).on("select2:open", function (e) {
        var s2id = $("span[class*='select2-dropdown select2-dropdown']").children('.select2-results').children().attr('id');
        s2id = s2id.split('select2-').join('').split('-results').join('');
        if (s2id == "#" + SelectID) {
            $("#select2-" + SelectID + "-addNew").appendTo("span[class*='select2-dropdown select2-dropdown']").show();
        }
    });

    //pgNo = 1

    //$.ajax({
    //    url: "OPHCORE/api/msg_autosuggest.aspx",
    //    data: {
    //        code: code,
    //        colkey: colkey,
    //        pgNo: pgNo+1,
    //        //defaultValue: defaultValue,
    //        wf1value: ($("#" + wf1).data("value") === undefined ? "" : $("#" + wf1).data("value")),
    //        wf2value: ($("#" + wf2).data("value") === undefined ? "" : $("#" + wf2).data("value")),
    //        parentCode: getCode()
    //    },
    //    dataType: "json",
      
    //    success: function (data) {       
    //        var newOption = new Option(data.results[0].text, data.results[0].id, true, true);
    //        $("#" + SelectID).append(newOption);//.trigger('change');
    //        var newOption1 = new Option(data.results[1].text, data.results[1].id, true, true);
    //        $("#" + SelectID).append(newOption1);//.trigger('change');
    //        $("#" + SelectID).trigger('change');

    //        //if ($("#" + SelectID).find("option[value='" + data.results + "']").length) {
    //        //    $("#" + SelectID).val(data.id).trigger('change');
    //        //}
            
    //    }
    //})
}

// auto suggest pop-up
function loadModalForm(divID, code, guid) {
    var xmldoc = 'OPHCore/api/default.aspx?mode=form&code=' + code + '&guid=' + guid + '&unique=' + getUnique();
    var xsldoc = 'OPHContent/themes/' + loadThemeFolder() + '/xslt/master_form_modal.xslt';

    if (code.indexOf('par') == 0) {
        $('#' + divID).text('| Parameter : ' + code);
    } else {
        showXML(divID, xmldoc, xsldoc, true, true);
    }
}

function saveModalForm(ini, selectID, code, guid) {
    $(ini).button('loading');
    var selectID = $(ini).parents("div[id*='addNew']").attr('id');
    selectID = selectID.split('addNew').join('');
    var md = "#addNew" + selectID;
    var formId = $('#modalForm' + selectID).children('form:first').attr('id');

    saveFunction(code, guid, 50, formId, function (data) {
        var msg = $(data).children().find("message").text();
        var retguid = $(data).children().find("guid").text();
        msg = (msg == "") ? $('#notiModal').data('message') : msg;

        if (isGuid(retguid)) {
            $(ini).button('reset');
            $(md).modal('hide');
            autosuggestSetValue(selectID, getCode(), selectID, retguid);
        } else {
            if (msg != "") {
                //show error message
                $('#modalFormAlert' + code + ' p').text(msg);
                $('#modalFormAlert' + code).show();
                $(md).animate({ scrollTop: 0 }, 'slow');
                $(ini).button('reset');
            } else {
                $(ini).button('reset');
            }
        }
    })

}
