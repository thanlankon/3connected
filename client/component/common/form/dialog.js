define.component('component.Dialog', function (component, require, Util, Lang) {

  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var Validator = require('core.validator.Validator');

  component.singleton = true;

  component.defaultSize = {
    height: '90%',
    width: '90%',
    maxHeight: '90%',
    maxWidth: '90%',
  };

  component.showForm = function (params) {
    this.element.find('.content .error').remove();

    this.resizeComponents();

    if (this.refreshData) {
      this.refreshData(params)
    }
  };

  component.refreshData = function (params) {
    // refresh comboboxes source
    this.element.find('[data-component-role=combobox]').each(function () {
      var combobox = $(this).data('ComboBoxComponent');

      if (combobox) {
        combobox.refreshData();
      }
    });

    if (this.formType == this.FormType.Dialog.CREATE) {
      this.initData();

      this.element.jqxWindow('open');

      return;
    }

    if (this.formType == this.FormType.Dialog.EDIT && this.ServiceProxy) {
      var id = params.id;

      var findOptions = {};
      findOptions[this.ServiceProxy.entityId] = id;

      this.ServiceProxy.findOne(findOptions, this.proxy(findOneDone));

      function findOneDone(serviceResponse) {
        if (serviceResponse.hasError()) return;

        var entity = serviceResponse.getData();

        entity.originalData = Util.Object.clone(entity);

        this.data.attr(entity);

        this.element.jqxWindow('open');
      }
    };
  };

  component.hideForm = function () {
    if (this.element.jqxWindow('isOpen')) {
      this.element.jqxWindow('close');
    }
  };

  component.initView = function (view) {
    var tmplElement = jQuery('<div />').append(view);

    var dialogElement = jQuery('<div />').addClass('dialog');

    var bodyElement = jQuery('<div />').addClass('body');
    var topElement = jQuery('<div />').addClass('top');
    var panelElement = jQuery('<div />').addClass('panel');

    var headerElement = tmplElement.find('.header');
    var contentElement = tmplElement.find('.content');
    var footerElement = tmplElement.find('.footer');

    panelElement.append(contentElement);
    topElement.append(panelElement);
    bodyElement.append(topElement).append(footerElement);

    dialogElement.append(headerElement, bodyElement);

    this.element.append(dialogElement);

    this.element = dialogElement;

    var sizeElement = tmplElement.find('.dialog-size');

    if (sizeElement.size()) {
      this.size = Util.Object.extend(this.size || {}, sizeElement.data());
    }

    //    this.initProxy();

    // setup dialog
    this.initDialog();
  };

  component.initDialog = function () {

    this.size = Util.Object.extend(this.defaultSize, this.size);

    this.element.jqxWindow({
      maxWidth: this.size.maxWidth,
      maxHeight: this.size.maxHeight,

      isModal: true,
      modalOpacity: 0.8,

      draggable: false,
      resizable: false,

      autoOpen: false,

      //      okButton: this.element.find('#buttonOk'),
      //      cancelButton: this.element.find('#buttonCancel'),

      initContent: this.proxy(initContent)
    });

    this.element.on('close', function () {
      window.history.back();
    });

    function initContent() {
      this.element.find('.panel').jqxPanel({
        sizeMode: 'fixed',
        autoUpdate: true,
        scrollBarSize: 5
      });

      this.on();
    }
  };

  component.resizeDialog = function () {

    this.element.jqxWindow({
      width: this.size.width,
      height: this.size.height,
      position: 'center'
    });

    this.element.find('.panel').jqxPanel({
      width: '0px',
      height: '0px',
    }).jqxPanel({
      width: '100%',
      height: '100%',
    });

    this.resizeComponents();
  };

  component.resizeComponents = function () {
    //    console.log(this.element.find('.content [data-component-role=combobox]').size());
    //
    //    this.element.find('.content [data-component-role=combobox]')
    //      .jqxComboBox({
    //        width: '0px'
    //      })
    //      .jqxComboBox({
    //        width: '100%'
    //      });
  };

  component.validateData = function () {
    var data = this.data;
    var rules = this.validateRules;

    var validate = Validator.validate(data, rules);

    return validate;
  };

  component.submitForm = function () {
    var validate = this.validateData();

    // remove all available error messages
    this.element.find('.content .error').remove();

    this.resizeComponents();

    if (validate.isValid) {
      // submit data to server
      if (this.beforeSubmitData) {
        this.beforeSubmitData(function (commit) {
          if (commit) this.submitData();
        });
      } else {
        this.submitData();
      }
    } else {
      // show validate error

      var errorElement = jQuery('<span />').addClass('error');

      errorElement.text(Lang.get(validate.message));

      var parentElement = this.element.find('.content [data-attribute="' + validate.attribute + '"]').parent().parent();

      parentElement.find('.error').remove();

      parentElement.append(errorElement);

      this.element.find('.panel').jqxPanel('scrollTo', 0, parentElement.position().top - 30);

      this.resizeComponents();

      errorElement.on('click', this.proxy(function () {
        errorElement.fadeOut(100, this.proxy(function () {
          errorElement.remove();

          this.resizeComponents();
        }));
      }));
    }
  };

  component.submitData = function () {
    var entity = this.data.attr();

    entity = Util.Object.omit(entity, ['originalData', 'componentSettings']);

    if (this.formType == this.FormType.Dialog.CREATE) {
      this.ServiceProxy.create(entity, this.proxy(createDone));
    } else if (
      this.formType == this.FormType.Dialog.VIEW ||
      this.formType == this.FormType.Dialog.EDIT
    ) {
      this.ServiceProxy.update(entity, this.proxy(updateDone));
    }

    function createDone(serviceResponse) {
      if (!serviceResponse.hasError()) {
        this.refreshData();
      }
    }

    function updateDone(serviceResponse) {
      if (!serviceResponse.hasError()) {
        this.hideForm();
      }
    }
  };

  component.events['{window} resize'] = function (element, event) {
    this.resizeDialog();
  };

  component.events['[data-role=cancel-button] click'] = function () {
    this.element.jqxWindow('close');
  };

  component.events['[data-role=submit-button] click'] = function () {
    this.submitForm();
  };

});
