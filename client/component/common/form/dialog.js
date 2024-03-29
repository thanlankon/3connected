define.component('component.Dialog', function (component, require, Util, Lang) {

  var jQuery = require('lib.jQuery');
  var Util = require('core.util.Util');
  var Validator = require('core.validator.Validator');
  var MsgBox = require('component.common.MsgBox');

  //  component.singleton = true;

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
      var combobox = jQuery(this).data('ComboBoxComponent');

      if (combobox) {
        combobox.refreshData();
      }
    });

    if (
      this.formType == this.FormType.DIALOG ||
      this.formType == this.FormType.Dialog.CREATE ||
      this.formType == this.FormType.Dialog.VALIDATION
    ) {
      this.initData(params);

      // reset bound attributes
      var boundAttributes = this.data.attr('boundAttributes');
      if (boundAttributes) {
        for (var i = 0, len = boundAttributes.length; i < len; i++) {
          this.data.attr(boundAttributes[i], null);
        }
      }

      if (this.clearData) {
        this.clearData();
      }

      this.element.jqxWindow('open');

      return;
    }

    if ((this.formType == this.FormType.Dialog.EDIT || this.formType == this.FormType.Dialog.VIEW) && this.ServiceProxy) {
      var id = params.id || this.data.attr('params.id');

      var findOptions = {};
      findOptions[this.ServiceProxy.entityId] = id;

      this.ServiceProxy.findOne(findOptions, this.proxy(findOneDone));

      return;
    };

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var entity = serviceResponse.getData();

      entity.originalData = Util.Object.clone(entity);

      this.data.attr(entity);

      if (this.reloadData) {
        this.reloadData();
      }

      this.element.jqxWindow('open');
    }

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

    if (this.formType == this.FormType.Dialog.CREATE) {
      footerElement.find('.ok').addClass('create');
    } else if (this.formType == this.FormType.Dialog.EDIT) {
      footerElement.find('.ok').addClass('edit');
    }

    //    this.initProxy();

    // setup dialog
    this.initDialogComponents();
  };

  component.initDialogComponents = function () {

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

      if (this.initDialog) {
        this.initDialog();
      }

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

    if (this.formType == this.FormType.Dialog.CREATE) {
      rules = rules.create;
    } else if (this.formType == this.FormType.Dialog.EDIT) {
      rules = rules.update;
    } else {
      // skip validate for other types of form
      if (this.formType != this.FormType.Dialog.VALIDATION) {
        return {
          isValid: true
        };
      }
    }

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

      var message = Lang.get(validate.message, validate.messageData);

      var parentElement = this.element.find('.content [data-attribute="' + validate.attribute + '"]').parent();

      if (parentElement.size()) {
        // visible attribute

        var errorElement = jQuery('<span />').addClass('error');

        errorElement.text(message);

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
      } else {
        // hidden attribute

        MsgBox.alert({
          text: message,
          icon: 'warning'
        });
      }
    }
  };

  component.submitData = function () {
    var formData = this.data;
    var entity = formData.attr();

    var skipSubmitAttributes = ['originalData', 'boundAttributes', 'componentSettings', 'componentElements'];

    Util.Collection.each(entity, function (value, key) {
      if (value == null) {
        skipSubmitAttributes.push(key);
      }
    });

    entity = Util.Object.omit(entity, skipSubmitAttributes);

    var omitAttributes = [];
    Util.Collection.each(entity, function (value, key) {
      if (formData.attr('componentSettings.' + key + '.skipDataSubmission')) {
        omitAttributes.push(key);
      }
    });

    entity = Util.Object.omit(entity, omitAttributes);

    if (this.formType == this.FormType.Dialog.CREATE) {
      this.ServiceProxy.create(entity, this.proxy(createDone));
    } else if (this.formType == this.FormType.Dialog.EDIT) {
      this.ServiceProxy.update(entity, this.proxy(updateDone));
    } else {
      if (this.submitDialogData) {
        this.submitDialogData(entity);
      }
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

  component.events['[data-component-role=cancel-button] click'] = function () {
    this.element.jqxWindow('close');
  };

  component.events['[data-component-role=submit-button] click'] = function () {
    this.submitForm();
  };

});
