define.component('component.Cpanel', function (component, require) {

  var Route = require('core.route.Route');
  var Util = require('core.util.Util');
  var jQuery = require('lib.jQuery');

  // singleton
  //  component.singleton = true;

  // cpanel template
  component.tmpl = 'cpanel';

  component.initData = function () {
    this.data.attr({
      user: {
        username: 'TrongND'
      }
    });
  };

  component.initView = function (view) {
    this.element.html(view);
  };

  component.ready = function () {
    this.static.cpanelElement = this.element;
    this.static.formContainer = this.element.find('#forms');
    this.static.bindRoute();

    this.element.find('#expander').click(toggleNavigator);
    this.element.find('#expander #navigator li').click(function () {
      var $this = $(this);
      $this.parent().parent().parent().find('#location').text($this.text());
    });

    function toggleNavigator() {
      var $this = $(this);
      $this.find('#navigator').slideToggle(100);
      $this.toggleClass('active');
    }

    Route.ready();
  };

  component.static.formUrlMaps = [];

  component.static.addFormUrlMap = function (urlMap) {
    this.static.formUrlMaps.push(urlMap);
  };

  component.static.bindRoute = function () {
    Route.bind('change', this.proxy(this.static.mapRoute));
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
          this.static.updateNavigator();

          break;
        }
      }
    }
  };

  component.static.switchForm = function (formId) {

    var activeFormId = this.static.activeFormId;

    if (!formId || activeFormId == formId) return;

    this.static.activeFormId = formId;

    var Form = require(formId);

    if (!Form.isDialog) {
      if (activeFormId) {
        var ActiveForm = require(activeFormId);
        var activeForm = ActiveForm.formInstance;

        activeForm.hideForm();
      }
    }

    var formData = Route.attr();

    if (!Form.formInstance) {
      // this form is auto displayed when created
      Form.formInstance = new Form(this.static.formContainer);

      //      Form.newInstance(this.static.formContainer, {
      //        on: {
      //          ready: function () {
      //            this.showForm(formData);
      //          }
      //        }
      //      });
    } else {
      Form.formInstance.showForm(formData);
    }
  };

  component.static.updateNavigator = function () {
    var module = Route.attr('module');
    var moduleName = '';

    this.static.cpanelElement.find('#navigator a').each(function () {
      var a = $(this);

      if (a.attr('href') && a.attr('href').substr(2, module.length) == module) {
        moduleName = a.text();
        return false;
      }
    });

    this.static.cpanelElement.find('#location').text(moduleName);
  };

});