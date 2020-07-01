var _auth2;
var gAuth;

function gSigninInit(clientid, afterLoad) {
	
		gapi.load('auth2', function() {

			_auth2 = gapi.auth2.init({
			client_id: clientid,	//'OUR_REAL_ID_GOES_HERE',
			scope: 'email',
			fetch_basic_profile: false
			});

			if (typeof afterLoad === "function") afterLoad();	  
    
		});
	
}
//connection
function signUp(account) {
	r=false;
	if ($('#newaccountid').val()=='' || $('#companyname').val()=='' || $('#adminname').val()=='' || $('#emailaddress').val()=='') {
		showMessage('Please complete all fields before continue.');
	}
	else if($('#newaccountid').val().split(' ').length>1) {
		showMessage('Account ID cannot using space.');
		
	}
	else { 						

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
		r=true;
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
	return r;
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
                            goTo('?code=login&accountid='+suba);
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

function clearLoginText() {
    $("#userid").val('');
    $("#pwd").val('');
}

function signOut(code, f, clientid) {
	var path = 'OPHCore/api/default.aspx?mode=signout' + '&unique=' + getUnique();
	var isGSignout=true;
	
	if (clientid!=undefined && gapi!=null && gapi.auth2!=null) {
		
		var a2 = gapi.auth2.getAuthInstance();
		if (a2.isSignedIn.get()) {
			isGSignout=false;
			gSigninInit(clientid, function() {
				a2.signOut().then(function () {
					a2.disconnect();		
					isGSignout=true;
				});						
			});	
			
		}
	}
	setTimeout(function() {	
		if (isGSignout)
			$.post(path).done(function () {
				setCookie("cartID", "", 0, 0, 0);
				setCookie("isLogin", "0", 0, 1, 0);
				var app = window.location.href.substring(0, window.location.href.indexOf("/index")).substring(window.location.href.substring(0, window.location.href.indexOf("/index")).lastIndexOf("/") + 1).replace(":", "");
				setCookie(app + "_lastPar", "", 0, 1, 0);
				setCookie("lastPar", "", 0, 1, 0);
				if (typeof f === "function") f();
				if (code==undefined) code='login';
				window.location = "?code="+code;

			});
	}, 1000);	 
}

function signUpGConnect(googleUser) {
	if ($('#newaccountid').val()=='' || $('#companyname').val()=='') {
		showMessage('Please complete your account and company name before continue.');
	}
	else if($('#newaccountid').val().split(' ').length>0) {
		showMessage('Account ID cannot using space.');
		
	}
	else { 						
	// Useful data for your client-side scripts:
		var profile = googleUser.getBasicProfile();
		console.log("ID: " + profile.getId()); // Don't send this directly to your server!
		console.log('Full Name: ' + profile.getName());
		console.log('Given Name: ' + profile.getGivenName());
		console.log('Family Name: ' + profile.getFamilyName());
		console.log("Image URL: " + profile.getImageUrl());
		console.log("Email: " + profile.getEmail());

		// The ID token you need to pass to your backend:
		var id_token = googleUser.getAuthResponse().id_token;
		console.log("ID Token: " + id_token);
		signUp('<xsl:value-of select="/sqroot/header/info/account"/>');
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
                if (data=='' || data==null)
					showMessage('Please fill both password match and strong enough before continue.', 4, true);					
				else
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


function signin_GConnect(gid) {
	base=getCookie('baseAccount');
    path = "OPHCore/api/default.aspx?mode=gConnect&gid=" + gid +'&suba=' + getCookie(base+'_accountid');

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

                var landingPage = getCookie(base+'_lastPar') === null || getCookie(base+'_lastPar') === '' ? '?' : getCookie(base+'_lastPar');

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


function signInGConnect(googleUser) {
    var profile = googleUser.getBasicProfile();
    //alert('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //alert('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    if (profile.getId()) {
        var ac_token = googleUser.getAuthResponse().access_token;
        signin_GConnect(ac_token, profile.getName(), profile.getEmail(), profile.getImageUrl());
    }
}
function signInFailure(e) {
	if (e.error=='popup_closed_by_user') window.location.reload();
	else 
		showMessage(e.error);
}

function signInCallback(authResult) {
  if (authResult['code']) {

    // Hide the sign-in button now that the user is authorized, for example:
    $('#signinButton').attr('style', 'display: none');
	path = "OPHCore/api/default.aspx?mode=gConnect&gid=" + gid;
	
    // Send the code to the server
    $.ajax({
      type: 'POST',
	  
      url: 'http://example.com/storeauthcode',
      // Always include an `X-Requested-With` header in every AJAX request,
      // to protect against CSRF attacks.
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      contentType: 'application/octet-stream; charset=utf-8',
      success: function(result) {
        // Handle or verify the server response.
      },
      processData: false,
      data: authResult['code']
    });
  } else {
    // There was an error.
  }
}

	//function onSuccess(googleUser) {
      //console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    //}
    //function onFailure(error) {
      //console.log(error);
    //}
    function renderGButton(id, onSuccess, onFailure) {
      gapi.signin2.render(id, {
        'scope': 'profile email',
        //'width': 240,
        //'height': 50,
        //'longtitle': true,
        'theme': 'dark',
        'onsuccess': signInGConnect,
        'onfailure': signInFailure
      });
    }	