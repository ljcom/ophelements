//upload class
var Upload = function (file) {
    this.file = file;
};

Upload.prototype.getType = function () {
    return this.file.type;
};
Upload.prototype.getSize = function () {
    return this.file.size;
}; 
Upload.prototype.getName = function () {
    return this.file.name;
};
Upload.prototype.doUpload = function (url, successF, errorF) {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file, this.getName());
    formData.append("upload_file", true);

    $.ajax({
        type: "POST",
        url: url,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            if (typeof successF == "function") successF(data, that);
            // your callback here
        },
        error: function (error) {
            if (typeof errorF == "function") errorF(error, that);
            // handle error
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 600000
    });
}

function upload_init(code, f_success, f_error) {

    // We can attach the `fileselect` event to all file inputs on the page
    //if ($(document).data("upload") != 1) {
    $(":file").each(function (i) {
        cd = $(":file").eq(i).data("code");
        if (code.toLowerCase() == cd.toLowerCase()) {
            $(":file").eq(i).change(function () {
                var input = $(this),
                    numFiles = input.get(0).files ? input.get(0).files.length : 1,
                    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                    //label = input.get(0).files.join(',');
                label = "";
                for (var i = 1; i < input[0].files.length; i++) {
                    label = label + ", " + input[0].files[i].name;
                }
                if (label == "") {
                    label = input[0].files[0].name
                }

                input.trigger('fileselect', [numFiles, label]);


                var file = this.files[0];
                if (file.size > 5024000) {
                    alert('max upload size is 5M')
                }
                    //submit ajax
                else {
                    var file = $(this)[0].files[0];
                    var upload = new Upload(file);
                    var p = $(this).parent().parent().parent().parent().parent().parent().parent().data("parentguid");//gchild
                    if (p == undefined) p = $("#cid").val();//child
                    var url = 'OPHCore/api/default.aspx?mode=upload&code=' + input.data("code") + '&parentGUID=' + p;


                    upload.doUpload(url,
                    function (data) {
                        //success

                        if (typeof f_success == "function") f_success(data);
                    },
                    function (data) {
                        //error

                        if (typeof f_error == "function") f_error(data);
                        else if (typeof f_success == "function") f_success(data);
                    });
                    preview('1', getCode(), getGUID(), 'formheader', this);
                }
                if (input.data("webcam")=="1") {
                    //showImage(input, '');
                    showImage(this, this.name.replace('_hidden', '')+'_camera_img'); 
                }
            });

            $(':file').eq(i).on('fileselect', function (event, numFiles, label) {
                var d=$(this).data("field");    
                if (d) input= $('#'+d)
                else var input = $(this).parents('.input-group').find(':text');
                
                //log = numFiles > 1 ? numFiles + ' files selected' : label;
                var log = label;
                if (input.length) {
                    input.val(log);
                    checkChanges(this);
                } else {
                    //if( log ) alert(log);
                }

            });
        }
    });


}

function showImage(input, imgDiv) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#'+imgDiv)
                    .attr('src', e.target.result);
                    //.width(150)
                    //.height(200);
            };

            reader.readAsDataURL(input.files[0]);
			checkChanges(input, true);
        }
    }

function export_init(code, withParam, mode, par, xmlpar, afterSuccess) {
    $(document).on('change', ':file', function () {
        if(withParam == 0) $('#btn_imp').attr('disabled', 'disabled');
        $('#btn_exp').button('loading');
        $("body").css("cursor", "progress");

        var input = $(this), numFiles = input.get(0).files ? input.get(0).files.length : 1, label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
        var file = this.files[0];
            
        if (file.size > 10000000) {
            showMessage("Maximum file size is 10 Mb");
            $('#btn_exp').button('reset');
            $('#btn_imp').removeAttr('disabled');
            $("body").css("cursor", "default");
        } 
        else {
            var file = $(this)[0].files[0];
            var upload = new Upload(file);
            var exportMode = mode;
            var parameter = par;
            var xmlParameter = xmlpar;
            var fields = parameter.split(",");
                
            for (var i = 0; i < fields.length; i++) {
				if (fields[i]!='') {
					var value = $('#' + fields[i]).val()
					value = (value && value != '') ? value : 'NULL';
					xmlParameter = xmlParameter.split('#' + fields[i] + '#').join(value);
				}
            }
            xmlParameter = xmlParameter.split('<').join('ss3css').split('>').join('ss3ess');
            xmlParameter = xmlParameter.split('&lt;').join('ss3css').split('&gt;').join('ss3ess');
            xmlParameter = xmlParameter.split('=').join('ss3dss').split('/').join('ss2fss').split('"').join('ss84ss');

            var url = 'OPHCore/api/default.aspx?mode=upload&header=true&code=' + code + '&exportMode=' + exportMode + '&xmlParameter=' + xmlParameter; 
            upload.doUpload(url, 
              function (data) {
                  location.reload();
              },
              function (error) {
                  showMessage(error);
              }
            );            
        } //endIF
    });
}