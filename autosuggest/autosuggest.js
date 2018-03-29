
//autosuggest

function autosuggest_onchange(ini, flag, code, GUID, formid) {
    var dataOld = $(ini).data('old');
    var dataValue = $(ini).val();

    if (dataOld != dataValue) {
        $(ini).data('old', dataValue);
        preview(flag, code, GUID, formid, ini);
        if ($(this).data("child") == 'Y') {
            $('#child_button_save').show();
        }
        else {
            $('#button_save').show();
        }

    }
}

function autosuggestSetValue(SelectID, code, colKey, defaultValue, wf1, wf2) { autosuggest_setValue(SelectID, code, colKey, defaultValue, wf1, wf2); } //old version

function autosuggest_setValue(SelectID, code, colKey, defaultValue, wf1, wf2) {
    //default value only
    if (wf1 == '' || wf1 == undefined) wf1 = 'wf1isnone';
    if (wf2 == '' || wf2 == undefined) wf2 = 'wf2isnone';
    if (defaultValue != '' && defaultValue  != undefined) {
        var aj = $.ajax({
            url: "OPHCORE/api/msg_autosuggest.aspx",
            data: {
                code: code,
                colkey: colKey,
                defaultValue: defaultValue,
                wf1value: ($("#" + wf1).data("value") === undefined ? "" : $("#" + wf1).data("value")),
                wf2value: ($("#" + wf2).data("value") === undefined ? "" : $("#" + wf2).data("value")),

            },
            dataType: "json",
            success: function (data) {
                var newOption = new Option(data.results[0].text, data.results[0].id, true, true);
                var InitialValue = data.results[0].id;
                $("#" + SelectID).data("old", InitialValue);
                $("#" + SelectID).val(InitialValue);
                $("#" + SelectID).data("oldtext", data.results[0].text);
                $("#" + SelectID).append(newOption).trigger('change');

            }
        });
    }

    return aj;
}