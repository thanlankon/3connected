define.component('component.Login', function (component, require, Util, Lang, jQuery) {

  component.tmpl = 'login';

  component.initView = function (view) {
    this.element.html(view);
  };

  component.login = function () {
    var loginData = Util.Object.pick(this.data.attr(), ['username', 'password', 'role', 'remember']);
    var remember = loginData.remember;

    var AuthenticationProxy = require('proxy.Authentication');

    jQuery.removeCookie('accessToken');

    AuthenticationProxy.login(loginData, this.proxy(loginDone));

    function loginDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var loginData = serviceResponse.getData();
      var accessToken = loginData.accessToken;

      if (remember) {
        jQuery.cookie('accessToken', accessToken, {
          expires: 7
        });
      } else {
        jQuery.cookie('accessToken', accessToken);
      }

      window.location.href = window.location.origin;
    }
  }

  component.events['#button-login click'] = function (element, event) {
    this.login();
  }

});
