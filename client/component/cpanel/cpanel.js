define.component('component.Cpanel', function (component, require, Util, Lang, jQuery) {

  var Route = require('core.route.Route');
  var Util = require('core.util.Util');
  var jQuery = require('lib.jQuery');

  var MsgBox = require('component.common.MsgBox');

  // cpanel template
  component.tmpl = 'cpanel';

  component.initData = function () {
    var Role = require('enum.Role');

    if (Role.isAdministrator(this.authentication.accountRole)) {
      // get profile for administrator

      var profile = {
        displayName: Lang.get('administrator')
      };

      this.data.attr({
        profile: profile
      });
    } else {
      // get profile for other roles

      var ProfileProxy = require('proxy.Profile');
      ProfileProxy.getSimpleProfile({}, this.proxy(getSimpleProfileDone));
    }

    function getSimpleProfileDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var profile = serviceResponse.getData();
      profile.displayName = Lang.get('displayName', {
        firstName: profile.firstName,
        lastName: profile.lastName
      });

      this.data.attr({
        profile: profile
      });
    }
  };

  component.initView = function (view) {
    this.element.html(view);
  };

  component.ready = function () {
    this.static.cpanelElement = this.element;
    this.static.formContainer = this.element.find('#forms');
    this.static.bindRoute();

    this.element.on('visible', this.proxy(initNavigationBar));

    this.element.find('#expander').click(toggleNavigator);
    this.element.find('#expander #navigator li').click(function () {
      var elm = jQuery(this);
      elm.parent().parent().parent().find('#location').text(elm.text());
    });

    jQuery(document).mousedown(function (event) {
      var elm = jQuery(event.target);

      if (elm.closest('#expander').size() == 0 && jQuery('#expander').hasClass('active')) {
        toggleNavigator();
      }
    });

    function toggleNavigator() {
      //      var elm = jQuery('#expander');
      //      elm.find('#navigator').slideToggle(100);
      //      elm.toggleClass('active');
      //
      //      return;

      var $form = jQuery('#forms');
      var $panel = jQuery('#navigation-panel');

      var top = 150;
      if ($panel.is(':visible')) {
        top = -top;
      }

      $panel.slideToggle(100, function () {
        $form.css('top', ($form.position().top + top) + 'px');

        jQuery(window).trigger('resize');
      });
    }

    function initNavigationBar() {
      var $panel = jQuery('#navigation-panel');

      var $tab = $panel.find('#navigation-tab');

      $tab.jqxTabs({
        animationType: 'fade',
        position: 'bottom'
      });

      setTimeout(function () {
        jQuery('#expander').click();
      }, 100);
    }

    Route.ready();
    this.static.mapRoute();
  };

  component.static.formUrlMaps = [];

  component.static.addFormUrlMap = function (urlMap) {
    this.static.formUrlMaps.push(urlMap);
  };

  component.static.bindRoute = function () {
    Route.onChange = this.proxy(this.static.mapRoute);
  };

  component.static.mapRoute = function () {
    var formUrlMaps = this.static.formUrlMaps;

    for (var i = 0, len = formUrlMaps.length; i < len; i++) {
      var formUrlMap = formUrlMaps[i];

      if (Route.attr('route') == formUrlMap.url) {
        var isMatched = true;

        if (formUrlMap.data) {
          var keys = Util.Object.keys(formUrlMap.data);

          for (var j = 0, lenKeys = keys.length; j < lenKeys; j++) {
            var key = keys[j];

            if (formUrlMap.data[key] != Route.attr(key)) {
              isMatched = false;
              break;
            }
          }
        }

        if (isMatched) {
          this.static.switchForm(formUrlMap.formId);
          //this.static.updateNavigator();

          return;
        }
      }
    }

    var Role = require('enum.Role');

    Route.removeAttr('action');
    Route.removeAttr('id');

    if (Role.isStudentOrParent(component.authentication.accountRole)) {
      Route.attr({
        module: 'notification'
      });
    } else if (Role.isTeacher(component.authentication.accountRole)) {
      Route.attr({
        module: 'manage-course'
      });
    } else if (Role.isAdministrator(component.authentication.accountRole)) {
      Route.attr({
        module: 'manage-account'
      });
    } else {
      Route.attr({
        module: 'news'
      });
    }
  };

  component.static.switchForm = function (formId) {

    var activeFormId = this.static.activeFormId;

    if (!formId || activeFormId == formId) return;

    this.static.activeFormId = formId;

    var Form = require(formId);

    var activeForm;
    var activeFormParams;
    var skipRefresh = false;

    if (activeFormId) {
      var ActiveForm = require(activeFormId);
      var activeForm = ActiveForm.formInstance;

      activeFormParams = activeForm.formParams;
      skipRefresh = activeForm.skipRefresh;
    }

    if (!Form.isDialog && activeForm) {
      activeForm.hideForm();
    }

    var formParams = Route.attr();

    Util.Object.extend(formParams, activeFormParams);

    if (!Form.formInstance) {
      // this form is auto displayed when created
      Form.formInstance = new Form(this.static.formContainer, {
        formParams: formParams
      });

      //      Form.newInstance(this.static.formContainer, {
      //        on: {
      //          ready: function () {
      //            this.showForm(formData);
      //          }
      //        }
      //      });
    } else {
      Form.formInstance.showForm(formParams, skipRefresh);
    }
  };

  component.static.updateNavigator = function () {
    var module = Route.attr('module');
    var moduleName = '';

    this.static.cpanelElement.find('#navigator a').each(function () {
      var a = jQuery(this);

      if (a.attr('href') && a.attr('href').substr(2, module.length) == module) {
        moduleName = a.text();
        return false;
      }
    });

    this.static.cpanelElement.find('#location').text(moduleName);
  };

  component.logout = function () {
    var AuthenticationProxy = require('proxy.Authentication');

    AuthenticationProxy.logout({}, this.proxy(logoutDone));

    function logoutDone(serviceResponse) {
      //if (serviceResponse.hasError()) return;

      jQuery.removeCookie('accessToken');

      window.location.href = window.location.origin;
    }
  };

  component.events['#button-logout click'] = function (element, event) {
    MsgBox.confirm(Lang.get('authentication.logout.confirm'), this.proxy(this.logout));
  };

});
