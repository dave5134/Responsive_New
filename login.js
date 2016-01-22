var jQ = jQuery; //.noConflict();
 
jQ(document).ready(function() {
	setupLogin();
	//Hello
});

function setupLogin() {
	setTimeout("autoLoginRememberMe()",2000);
	setTimeout("autoLoginGoogleRememberMe()",1500);
}

function populateFields() {
      var rememberMe = f_rememberMe();
      var userName =readCookie('user_name');;
      if(userName !=''){
    	  rememberMe = true;
      }else{
    	  rememberMe = false;
      }
      jQ("#rememberMe").attr("checked", rememberMe);
      jQ(".username").val(userName);
      checkForDashesInUserId();
}


function readCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return '';
}


function loginAdminRequest() {
    if(window.location.href.indexOf('accessId') > -1){
    	showOverlayLogin();
        jQ(".waitImgLogin").show();
    	jQ(".submitAdmin").click();
	 }
}

function pageIsResponsive(curPageLocation){
	// login pages below are responsive, must be updated as more pages are.
	if (curPageLocation.indexOf("apa/portal/home")>-1){
		return true;
	}
	else return false;
}


function readCookieNameLike(name) {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(name) == 0) return c.substring(c.indexOf(name), c.length);
    }
    return '';
}


function autoLoginRememberMe() {
	//Please uncomment this method for the auto login Remember me functionality to work IDM-1011 
	 var cookieName = window.location.hostname.split('.').join('_');
     var rememberMe =readCookie(cookieName);
      if(rememberMe !=''){
    	  showOverlayLogin();
            jQ(".waitImgLogin").show();
            userName = f_getUsername();
			if(userName==''){
				userName = '     ';
			}
			f_login(userName,userName, true);
      }
}




function autoLoginGoogleRememberMe() {
	 var cookieName = "AutoLoginToGoogle" + window.location.hostname.split('.').join('_');
     var rememberMe =readCookie(cookieName);
     if(rememberMe =='true'){
            jQ(".submitGoogleButton").click();
      }
}



function showOverlayLogin() {
	jQ("<div id='overlay'></div><div id='overlayImage'><div class='waitText'><img src='/apa/shop/img/ajax.gif' /></div><div class='waitText'>Please Wait...</div></div>").appendTo("body");
	jQ("#overlay").css("width", jQ(document).width());
	jQ("#overlay").css("height", jQ(document).height());
}

 
var userName = '';
var retryCount = 0;

function waitForBigIpCookie(userName){
	var bigIpCookieName = 'BIGipServermy';
	var bigIpCookie  =readCookieNameLike(bigIpCookieName);
	if(bigIpCookie !=''){
		f_login(userName,userName, true);
	}else{
		if(retryCount++ <20){
			setTimeout(waitForBigIpCookie(userName),1000);
		}else{
			f_login(userName,userName, true);
		}
	}
}


function wait(msecs)
{
	var start = new Date().getTime();
	var cur = start
	while(cur - start < msecs)
	{
		cur = new Date().getTime();
	}
} 


function loginIDEM() {
	jQ("#loginErrors").text("").hide();
	jQ(".loginMessages").text("").hide();
	var u = jQ("#username").val();
	var p = jQ("#password").val();
	var r = jQ("#rememberMe").is(":checked");
	if (u!="" && p!="" ) {
		jQ(".waitImgLogin").show();
		f_login(u, p, r);
	}
	else {
		jQ("#loginErrors").text(displayMessages['ENTER_USERID_PASSWORD']).show();
	}
	return false;
}

function loginCallback(response, overlayRequired) {
	var curPage = window.location.href;
	if (response == "Login Successful") {
		if (overlayRequired == true || overlayRequired == "true") {
			if (pageIsResponsive(curPage))
				showChgPassPopupResp();
			else
				showChPassPopupRegular();
		}
		else {
			location.href = "/apa/idm/postAuthenticationProcess.jsf";
		}
	}
	else {
		jQ(".waitImgLogin").hide();
		if("function" == typeof(getLoginErrorMessage)){
			response = getLoginErrorMessage();
		}
		jQ("#loginErrors").html("<span><img src='/apa/img/error_resp.png' style='padding-right:7px'></img></span>"+response).show();
		checkAndPushMessageEvent("#loginErrors" ,"Login Error")
	//	displayTopErrorBox(response); future
	}
}

function showChPassPopupRegular(){
	jQ("<div id='overlayBox'></div>").appendTo("body");
	jQ('#overlayBox').load('/apa/idm/changePasswordAndEmail.jsf', function() {
		jQ(".waitImgLogin").hide();
		showOverlayOnly();
	}).focus();
	try {
		jQ(".currPassFld").focus();
	}
	catch (e){}
}

function showChgPassPopupResp(){
//	jQ('#overlayBox_resp').modal('show');
	jQ('#chgPassPopup_resp').load('/apa/idm/changePasswordAndEmailResp.jsf', function() {
		jQ(".waitImgLogin").hide();
		jQ('#overlayBox_resp').modal('show');
	}).focus();
	try {
		jQ(".currPassFld").focus();
	}
	catch (e){}
}

function showChangePasswordConfirmOverlayResp() {
	var show = true;
	if (jQ(".alert").text() != "") show = false;
	if (jQ(".error").text() != "") show = false;
	if  (show) {
		//Changing the message to be displayed
		var arrayValue = jQ(".textToBeDisplayed").text();
	//	jQ("#chgPassPopup_resp").hide();
		jQ('#overlayBox_resp').modal('hide');
		
		jQ("#overlayTitle").text(titleArray[arrayValue]);
		jQ("#overlayDesc").text(descArray[arrayValue]);
//		jQ("#overlayBox").css("top", "35%").css("text-align", "center");
		jQ("#completion_modal").modal('show');
	}
}

function showOverlayOnly() {
	jQ("<div id='overlay'></div>").appendTo("body");
	jQ("#overlay").css("width", jQ(document).width());
	jQ("#overlay").css("height", jQ(document).height());
}

function showChangePasswordConfirmOverlay() {
	var show = true;
	if (jQ(".alert").text() != "") show = false;
	if (jQ(".error").text() != "") show = false;
	if  (show) {
		//Changing the message to be displayed
		var arrayValue = jQ(".textToBeDisplayed").text();
		jQ("#changePassDiv").hide();
		jQ("#passwordEmailOverlay").css("background-color", "#EBF4FB");
		jQ("#overlayTitle").text(titleArray[arrayValue]);
		jQ("#overlayDesc").text(descArray[arrayValue]);
		jQ("#overlayBox").css("top", "35%").css("text-align", "center");
		jQ("#passwordEmailOverlay").show().focus();
	}
}

function checkForDashesInUserId() {
	var userId = jQ("#username").val();
	var len = userId.length;
	var noDashStr = userId.replace(/-/g, "");
	var isWhole_re = /^\s*\d+\s*$/;

	if (String(noDashStr).search (isWhole_re) != -1) { // The input value is number only
		if (noDashStr.length != len) {
			jQ(".userIdDashErrDiv").show();
		}
		else {
			jQ(".userIdDashErrDiv").hide();
		}
	}
	else {
		jQ(".userIdDashErrDiv").hide();
		}
	}

titleArray = new Array();
titleArray["Email"] = displayMessages['EMAIL_CHANGE_SUCCESS'];
titleArray["Password"] = displayMessages['PASSWORD_CHANGE_SUCCESS'];
titleArray["EmailPassword"] = displayMessages['PASSWORD_EMAIL_UPDATED'];

descArray = new Array();
descArray["Email"] = displayMessages['EMAIL_UPDATED'];
descArray["Password"] = displayMessages['PASSWORD_UPDATED'];
descArray["EmailPassword"] = displayMessages['PASSWORD_CHANGED'];

/***************************************************************************************/

function f_login(u, p, rememberMe) {
	jQ(".f_username").val(u);
	jQ(".f_password").val(p);
	jQ(".f_rememberMe").attr("checked", rememberMe);
	jQ(".f_submit").click();
}

function f_postLogin(overlayRequired) {
	var errors = jQ(".f_alert").text();
	if (errors != null) {
		if (errors.match("Welcome,") != null) errors = null;
	}
	if (errors == "" || errors == null) {
		loginCallback("Login Successful", overlayRequired);
	}
	else {
		loginCallback(errors);
	}
}

function f_rememberMe() {
	return jQ('.f_rememberMe').is(':checked');
}

function f_getUsername() {
	var userName = jQ('.f_username').val();
	if(userName==''){
		userName =readCookie('user_name');
	    if(userName!=''){
	    	jQ('.f_username').val(userName);
	    }
	}
	return userName;
}

