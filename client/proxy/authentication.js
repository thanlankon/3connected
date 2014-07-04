define.proxy('proxy.Authentication', function (proxy, require) {

  proxy.login = 'POST api/authentication/login';

  proxy.logout = 'GET api/authentication/logout';

});
