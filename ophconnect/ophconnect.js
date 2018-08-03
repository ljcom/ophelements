
//connection
function signIn(withchaptcha) {
    //if (top.document.domain == window.location.hostname) {
    //withchaptcha = (withchaptcha == 1) ? 1 : 0;
    var uid = getCookie('userId');
    if ($("#userid").val() != "") uid = $("#userid").val();
    if (getCode() == 'lockscreen') uid = getCookie('userId');
    var pwd = $("#pwd").val();

    var dataForm = $('form').serialize() + '&source=' + window.location.toString().replace('&', '*').replace('?', '*') //.split('_').join('');

    var dfLength = dataForm.length;
    dataForm = dataForm.substring(2, dfLength);
    dataForm = dataForm.split('%3C').join('%26lt%3B');
    path = "OPHCore/api/default.aspx?mode=signin&userid=" + uid + "&pwd=" + pwd;// + "&withCaptcha=" + withchaptcha;

    $.ajax({
        url: path,
        data: dataForm,
        type: 'POST',
        dataType: "xml",
        timeout: 80000,
        beforeSend: function () {
            //setCursorWait(this);
        },
        success: function (data) {
            var x = $(data).find("sqroot").children().each(function () {
                var msg = $(this).text();

                var landingPage = (getCookie('lastPar') == null || getCookie('lastPar') == '') ? '?' : getCookie('lastPar');

                if (msg != '') {
                    if ($(this)[0].nodeName == "userGUID") {
                        //setCookie('userId', $("#userid").val(), 7);
                        setCookie('userId', uid, 7);
                        goTo(landingPage);
                        //window.location = landingPage;
                    }
                    if ($(this)[0].nodeName == "message") {
                        showMessage(msg, 4, true, function () { window.location.reload(); })

                    }
                }
                else {

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

                var landingPage = (getCookie('lastPar') == null || getCookie('lastPar') == '') ? '?' : getCookie('lastPar');

                if (msg != '') {
                    if ($(this)[0].nodeName == "userGUID") {
                        //setCookie('userId', $("#userid").val(), 7);
                        //setCookie('userId', uid, 7);
                        goTo(landingPage);
                        //window.location = landingPage;
                    }
                    if ($(this)[0].nodeName == "message") showMessage(msg, 4);
                }
                else {

                }
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
        if (typeof f == "function") f();
        goHome()
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
        signin_GConnect(id_token, profile.getName(), profile.getEmail(), profile.getImageUrl())
    }
}

function signoff() {
    url = "OPHCore/api/default.aspx?mode=signoff";
    $.post(url)
}
