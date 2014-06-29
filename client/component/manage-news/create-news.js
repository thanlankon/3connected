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
    this.element.on('visible', this.proxy(this.initEditor));
  };

  form.initEditor = function () {
    if (this.isEditorInitialized) {
      return;
    } else {
      this.isEditorInitialized = true;
    }

    jQuery(window).resize(this.proxy(this.resizeEditor));

    this.element.find('#news-editor').ckeditor(this.proxy(this.resizeEditor));
  };

  form.resizeEditor = function () {
    var ckeditor = this.element.find('#news-editor').ckeditorGet();
    var ckeditorWrapper = this.element.find('.news-editor-wrapper td');

    var editorHeight = ckeditorWrapper.height();

    ckeditor.resize('100%', editorHeight - 10);
  };

});
