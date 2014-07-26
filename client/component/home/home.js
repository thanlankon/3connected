define.form('component.form.home.Home', function (form, require, Util, Lang) {

  var Role = require('enum.Role');

  if (form.authentication) {

    form.urlMap = {
      url: ':module',
      data: {
        module: 'home'
      }
    };

    if (Role.isStudentOrParent(form.authentication.accountRole)) {
      form.base = 'component.form.notification.NotificationExplorer';
    } else {
      form.base = 'component.form.manage-news.NewsExplorer';
    }

  }

});
