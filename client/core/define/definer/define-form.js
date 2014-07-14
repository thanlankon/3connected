define.form = function (id, definer) {

  define.component(id, function (component, require, Util, Lang, jQuery) {

    var Route = require('core.route.Route');
    var CpanelComponent = require('component.Cpanel');

    component.FormType = {
      FORM: 1,
      DIALOG: 2,
      Form: {
        LIST: 11
      },
      Dialog: {
        VIEW: 21,
        CREATE: 22,
        EDIT: 23,
        VALIDATION: 24
      }
    };

    definer(component, require, Util, Lang, jQuery);

    if (component.formType == component.FormType.FORM || component.formType == component.FormType.Form.LIST) {
      component.base = 'component.Form';

      component.isDialog = component.static.isDialog = false;
    } else {
      component.base = 'component.Dialog';

      component.isDialog = component.static.isDialog = true;
    }

    component.setFormParam = function (key, value) {
      if (!this.formParams) {
        this.formParams = {};
      }

      if (value === null) {
        this.formParams = Util.Object.omit(this.formParams, key);
      } else {
        this.formParams[key] = value;
      }
    };

    // require proxy
    //    if (component.proxyMap) {
    //      component.initProxy = function () {
    //        this.ServiceProxy = require(this.proxyMap.proxy);
    //      }
    //    }

    if (!component.urlMap) return;

    component.urlMap = [].concat(component.urlMap);

    for (var i = 0, len = component.urlMap.length; i < len; i++) {
      var formUrlMap = {
        url: component.urlMap[i].url,
        data: component.urlMap[i].data,
        formId: id
      };

      Route.define(formUrlMap.url);

      CpanelComponent.addFormUrlMap(formUrlMap);
    }

  });

};
