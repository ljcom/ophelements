
//connection
function signUp(account) {

    var suba = $('#newaccountid').val();
    var company = $('#companyname').val();
    var admin = $('#adminname').val();
    var email = $('#emailaddress').val();

    //var uid = getCookie(account + '_userId');
    //if ($("#userid").val() !== "") uid = $("#userid").val();
    var pwd = $("#pwd").val();

    var dataForm = new FormData();

    dataForm.append('mode', 'signup');
    dataForm.append('newaccountid', suba);
    dataForm.append('companyname', company);
    dataForm.append('adminname', admin);
    dataForm.append('emailaddress', email);
    //dataForm.append('newpwd', $('#newpwd').val());
    //dataForm.append('confirmpwd', $('#confirmpwd').val());

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

                if (msg !== '') {
                    if ($(this)[0].nodeName === "sent") {
                    //if ($(this)[0].nodeName === "accountid") {
                        setCookie(account+'_accountid', suba, 365, 1, 1);
                        goTo('?code=login&mode=4&email=' + email);
                    }
                    if ($(this)[0].nodeName === "message") {
                        showMessage(msg, 4, true, function () {
                            if (getCookie('isWhiteAddress') === '0') window.location.reload();
                        });

                    }
                }
            });
        }
    });
}
function signIn(account, autoLogin) {
    //if (autoLogin) {
    //if ($('#skipAutoLoginPage').prop("checked")) setCookie("skipAutoLoginPage", "1", 1, 0, 0);
    //url = window.location.href + (window.location.href.indexOf('?') >= 0 ? '&' : '?') + 'autologin=1';
    //goTo(url, true);
    //}
    //else {

    var suba = getCookie(account+'_accountid');
    var uid = getCookie(account + '_userId');
    if ($("#userid").val() !== "") uid = $("#userid").val();
    if (getCode() === 'lockscreen') uid = getCookie(account.toLowerCase() + '_userId');

    var pwd = $("#pwd").val();

    var dataForm = new FormData();

    dataForm.append('mode', 'signin');
    dataForm.append('userid', uid);
    dataForm.append('suba', suba);
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
                            if (getCookie('isWhiteAddress') === '0') window.location.reload();
                        });

                    }
                }
            });
        }
    });
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

function signOut(code, f) {

    var path = 'OPHCore/api/default.aspx?mode=signout' + '&unique=' + getUnique();
    $.post(path).done(function () {
        setCookie("cartID", "", 0, 0, 0);
        setCookie("isLogin", "0", 0, 1, 0);
        var app = window.location.href.substring(0, window.location.href.indexOf("/index")).substring(window.location.href.substring(0, window.location.href.indexOf("/index")).lastIndexOf("/") + 1).replace(":", "");
        setCookie(app + "_lastPar", "", 0, 1, 0);
        setCookie("lastPar", "", 0, 1, 0);
        if (typeof f === "function") f();
		if (code==undefined) code='login';
        window.location = "?code="+code;
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

function checkForgot(account, email) {
    if (email !== '') {

        var dataForm = new FormData();

        dataForm.append('mode', 'forgotpwd');
        dataForm.append('step', 'sendemail');
        dataForm.append('suba', getCookie(account+'_accountid'));
        dataForm.append('email', email);

        var path = 'OPHCore/api/default.aspx?unique=' + getUnique();
        $.ajax({
            url: path,
            data: dataForm,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            timeout: 80000,
            beforeSend: function () {
                //setCursorWait(this);
            },
            success: function (data) {
                var x = $(data).find("sqroot").children().each(function () {
                    var msg = $(this).text();

                    if (msg !== '') {
                        if (msg=='1') {
                            goTo('?code=login&mode=4&email=' + email);
                        }
                        if ($(this)[0].nodeName === "message") showMessage(msg, 4);
                    }
                });
            }
        });
    }
    else
        showMessage('Please fill the valid email address before continue.', 4, true);

}

function checkCode(account, code) {
    if (code !== '') {

        var dataForm = new FormData();

        dataForm.append('mode', 'forgotpwd');
        dataForm.append('step', 'verifycode');
        dataForm.append('suba', getCookie(account+'_accountid'));
        dataForm.append('email', getQueryVariable("email"));
        dataForm.append('verifycode', code);

        var path = 'OPHCore/api/default.aspx?unique=' + getUnique();
        $.ajax({
            url: path,
            data: dataForm,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            timeout: 80000,
            beforeSend: function () {
                //setCursorWait(this);
            },
            success: function (data) {
                var x = $(data).find("sqroot").children().each(function () {
                    var msg = $(this).text();

                    if (msg !== '') {
                        if ($(this)[0].nodeName === "verified") {
                            goTo('?code=login&mode=5&email=' + getQueryVariable("email") + '&secret=' + code);
                        }
                        if ($(this)[0].nodeName === "message") showMessage(msg, 4);
                    }
                });
            }
        });
    }
    else
        showMessage('Please fill the valid email address before continue.', 4, true);

}

function resetPwd(account, newpwd, confirmpwd) {
    if (newpwd !== '' && newpwd === confirmpwd) {

        var dataForm = new FormData();

        dataForm.append('mode', 'resetpwd');
        dataForm.append('suba', getCookie(account+'_accountid'));
        dataForm.append('email', getQueryVariable("email"));
        dataForm.append('secret', getQueryVariable("secret"));
        dataForm.append('newpwd', newpwd);
        dataForm.append('confirmpwd', confirmpwd);

        var path = 'OPHCore/api/default.aspx?unique=' + getUnique();
        $.ajax({
            url: path,
            data: dataForm,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            timeout: 80000,
            beforeSend: function () {
                //setCursorWait(this);
            },
            success: function (data) {
                var x = $(data).find("sqroot").children().each(function () {
                    var msg = $(this).text();

                    if (msg !== '') {
                        if ($(this)[0].nodeName === "reset") {
                            goTo('?code=login');
                        }
                        if ($(this)[0].nodeName === "message") showMessage(msg, 4);
                    }
                });
            }
        });
    }
    else
        showMessage('Please fill both password match and strong enough before continue.', 4, true);

}

function chooseAccount(account, suba) {
    if (suba !== '') {
        var dataForm = new FormData();

        dataForm.append('mode', 'checkAccount');
        dataForm.append('suba', suba);

        var path = 'OPHCore/api/default.aspx?unique=' + getUnique();
        $.ajax({
            url: path,
            data: dataForm,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            timeout: 80000,
            beforeSend: function () {
                //setCursorWait(this);
            },
            success: function (data) {
                var x = $(data).find("sqroot").children().each(function () {
                    var msg = $(this).text();

                    if (msg !== '') {
                        if ($(this)[0].nodeName === "exist") {
                            setCookie(account+'_accountid', suba, 365, 0, 0);
                            goTo('?code=login');
                        }
                        if ($(this)[0].nodeName === "message") showMessage(msg, 4);
                    }
                });
            }
        });
    }
    else
        showMessage('Please fill Account ID before continue.', 4, true);

}

