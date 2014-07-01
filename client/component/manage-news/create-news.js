define.form('component.form.manage-news.CreateNews', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-news',
      action: 'create'
    }
  };

  //  form.ServiceProxy = require('proxy.News');

  form.tmpl = 'form.manage-news.create-news';

  form.formType = form.FormType.FORM;

  form.initData = function () {

    var componentSettings = {
      categoryIds: {
        localDataAttribute: 'categories',
        combobox: {
          valueMember: 'categoryId',
          displayMember: 'categoryName'
        }
      }
    };

    this.data.attr({
      componentSettings: componentSettings
    });

  };

  form.initForm = function () {
    this.element.on('visible', this.proxy(this.initFormComponents));
  };

  form.initFormComponents = function () {
    if (this.isFormInitialized) {
      return;
    } else {
      this.isFormInitialized = true;
    }

    // init splitter
    this.element.find('#splitter').jqxSplitter({
      width: '100%',
      height: '100%',
      panels: [{
        size: 300
      }]
    }).on('resize', function (event) {});

    // init attachments listbox
    this.element.find('#attachments').jqxListBox({
      source: this.buildAttachmentSource(),
      width: '100%',
      height: '100px'
    });

    // init editor
    this.element.find('#news-editor').ckeditor(this.proxy(this.resizeFormComponents));

    // resize components when window resized
    jQuery(window).resize(this.proxy(this.resizeFormComponents));

    this.element.find('#button-add-attachments').click(this.proxy(this.addAttachments));

    this.inputAttachments = this.element.find('#input-attachments');
    this.inputAttachments.change(this.proxy(this.updateSelectedAttachments));
  };

  form.resizeFormComponents = function () {
    this.resizeEditor();
    this.resizeAttachmentListBox();
  };

  form.resizeEditor = function () {
    var ckeditor = this.element.find('#news-editor').ckeditorGet();
    var ckeditorWrapper = this.element.find('.news-editor-wrapper');

    var editorHeight = ckeditorWrapper.height();

    ckeditor.resize('100%', editorHeight - 10);
  };

  form.resizeAttachmentListBox = function () {
    var attachmentListBox = this.element.find('#attachments');

    var newsInfoWrapper = this.element.find('.news-info');

    var listBoxHeight = newsInfoWrapper.height() - attachmentListBox.offset().top + 60;

    attachmentListBox.jqxListBox({
      height: listBoxHeight
    });
  };

  form.buildAttachmentSource = function () {
    var source = [
      {
        html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='https://cdn2.iconfinder.com/data/icons/ledicons/page_white_excel.png'/><span style='float: left; font-size: 13px; font-family: Arial;'>jqxNumberInput</span></div>",
        title: 'jqxNumberInput'
      },
      {
        html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='https://cdn3.iconfinder.com/data/icons/fugue/icon_shadowless/document-word-text.png'/><span style='float: left; font-size: 13px; font-family: Arial;'>jqxNumberInput</span></div>",
        title: 'jqxNumberInput'
      },
      {
        html: "<div style='height: 20px; float: left;'><img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='https://cdn4.iconfinder.com/data/icons/48-bubbles/48/12.File-16.png'/><span style='float: left; font-size: 13px; font-family: Arial;'>jqxNumberInput</span></div>",
        title: 'jqxNumberInput'
      }
    ];

    return source;
  };

  form.addAttachments = function () {
    this.inputAttachments.click();
  };

  form.updateSelectedAttachments = function() {
    var inputAttachments = this.inputAttachments[0];

    console.log(inputAttachments.files);
  };

});
