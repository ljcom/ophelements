
//connection
function signIn(account, autoLogin) {
    //if (autoLogin) {
        //if ($('#skipAutoLoginPage').prop("checked")) setCookie("skipAutoLoginPage", "1", 1, 0, 0);
        //url = window.location.href + (window.location.href.indexOf('?') >= 0 ? '&' : '?') + 'autologin=1';
        //goTo(url, true);
    //}
    //else {

        var uid = getCookie(account + '_userId');
        if ($("#" + account + "_userid").val() !== "") uid = $("#" + account + "_userid").val();
        if (getCode() === 'lockscreen') uid = getCookie(account.toLowerCase() + '_userId');

        var pwd = $("#" + account + "_pwd").val();

        //var dataForm = $('form').serialize() + '&source=' + window.location.toString().replace('&', '*').replace('?', '*'); //.split('_').join('');

        var dataForm = new FormData();

        //var dfLength = dataForm.length;
        //dataForm = dataForm.substring(2, dfLength);
        //dataForm = dataForm.split('%3C').join('%26lt%3B');
        //?mode=signin&userid=" + uid + "&pwd=" + pwd

        dataForm.append('mode', 'signin');
        dataForm.append('userid', uid);
        dataForm.append('pwd', pwd);
        dataForm.append('autoLogin', autoLogin);
        dataForm.append('source', window.location.toString().replace('&', '*').replace('?', '*'));

        path = "OPHCore/api/default.aspx";
        $.ajax({
            url: path,
            data: dataForm,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            dataType: "xml",
            timeout: 80000,
            beforeSend: function () {
                //setCursorWait(this);
            },
            success: function (data) {
                var x = $(data).find("sqroot").children().each(function () {
                    var msg = $(this).text();
                    var app = window.location.href.substring(0, window.location.href.indexOf("/index")).substring(window.location.href.substring(0, window.location.href.indexOf("/index")).lastIndexOf("/") + 1).replace(":", "");

                    var landingPage = getCookie(app + '_lastPar') === null || getCookie(app + '_lastPar') === '' ? '?' : getCookie(app + '_lastPar');

                    if (msg !== '') {
                        if ($(this)[0].nodeName === "userGUID") {
                            //setCookie('userId', $("#userid").val(), 7);
                            setCookie(account.toLowerCase() + '_userId', uid, 7);
                            goTo(landingPage);
                            //window.location = landingPage;
                        }
                        if ($(this)[0].nodeName === "message") {
                            showMessage(msg, 4, true, function () { 
							if (getCookie('isWhiteAddress')==0) window.location.reload(); 
							});

                        }
                    }
                    //else {

                    //}
                });


            }
        });
    //}
}

function signin_GConnect(gid) {
    path = "OPHCore/api/default.aspx?mode=gConnect&gid=" + gid;

    $.ajax({
        url: path,
        type: 'POST',
        timeout: 80000,
        beforeSend: function () {
            //setCursorWait(this);
        },
        success: function (data) {
            var x = $(data).find("sqroot").children().each(function () {
                var msg = $(this).text();

                var landingPage = getCookie('lastPar') === null || getCookie('lastPar') === '' ? '?' : getCookie('lastPar');

                if (msg !== '') {
                    if ($(this)[0].nodeName === "userGUID") {
                        //setCookie('userId', $("#userid").val(), 7);
                        //setCookie('userId', uid, 7);
                        goTo(landingPage);
                        //window.location = landingPage;
                    }
                    if ($(this)[0].nodeName === "message") showMessage(msg, 4);
                }
                //else {

                //}
            });


        }
    });

}
function clearLoginText() {
    $("#userid").val('');
    $("#pwd").val('');
}

function signOut(f) {

    var path = 'OPHCore/api/default.aspx?mode=signout' + '&unique=' + getUnique();
    $.post(path).done(function () {
        setCookie("cartID", "", 0, 0, 0);
        setCookie("isLogin", "0", 0, 1, 0);
		var app = window.location.href.substring(0, window.location.href.indexOf("/index")).substring(window.location.href.substring(0, window.location.href.indexOf("/index")).lastIndexOf("/") + 1).replace(":", "");
		setCookie(app + "_lastPar", "", 0, 1, 0);
		setCookie("lastPar", "", 0, 1, 0);
        if (typeof f === "function") f();
        window.location = "?code=login";
        //goHome();
    });

}

function signInGConnect(googleUser) {
    var profile = googleUser.getBasicProfile();
    //alert('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //alert('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    if (profile.getId()) {
        var id_token = googleUser.getAuthResponse().id_token;
        signin_GConnect(id_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
    }
}

function signoff() {
    url = "OPHCore/api/default.aspx?mode=signoff";
    $.post(url);
}
