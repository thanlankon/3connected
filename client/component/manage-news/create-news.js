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

  form.attachmentInfo = {};
  form.attachmentData = {};

  form.initData = function () {

    var componentSettings = {
      categoryIds: {
        ServiceProxy: require('proxy.NewsCategory'),
        combobox: {
          valueMember: 'newsCategoryId',
          displayMember: 'newsCategoryName'
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
    this.listBoxAttachment = this.element.find('#attachments');
    this.listBoxAttachment.jqxListBox({
      source: this.buildAttachmentSource(),

      selectedIndex: 0,
      valueMember: 'attachmentUid',
      width: '100%',
      height: '100px',
      itemHeight: 47,

      renderer: this.proxy(function (index, label, value) {
        var fileInfo = this.attachmentInfo[value];

        var html = '\
          <div> \
          <table class="attachment-item"> \
            <tr> \
              <td class="icon" rowspan="2"></td> \
              <td class="name" colspan="2"></td> \
            </tr> \
            <tr> \
              <td class="extension"></td> \
              <td class="size"></td> \
            </tr> \
          </table> \
          </div> \
        ';

        html = jQuery(html);

        var fileSize = '(' + Util.File.sizeText(fileInfo.size) + ')';
        var fileExtension = '.' + fileInfo.extension;

        html.find('.icon').addClass(fileInfo.extension);
        html.find('.name').text(fileInfo.name);
        html.find('.extension').text(fileExtension);
        html.find('.size').text(fileSize);

        return html.html();
      })
    });

    // init editor
    this.editor = this.element.find('#news-editor');
    this.editor.ckeditor(this.proxy(this.resizeFormComponents));

    // resize components when window resized
    jQuery(window).resize(this.proxy(this.resizeFormComponents));

    // handle for add - remove attachments
    this.element.find('#button-add-attachments').click(this.proxy(this.addAttachments));
    this.element.find('#button-remove-attachments').click(this.proxy(this.removeAttachments));

    // handle for save
    this.element.find('#button-save').click(this.proxy(this.saveNews));

    // handle for attachments selected
    this.inputAttachments = this.element.find('#input-attachments');
    this.inputAttachments.change(this.proxy(this.updateSelectedAttachments));
  };

  form.resizeFormComponents = function () {
    this.resizeEditor();
    this.resizeAttachmentListBox();
  };

  form.resizeEditor = function () {
    var ckeditor = this.editor.ckeditorGet();
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

  form.refreshAttachmentList = function () {
    this.listBoxAttachment.jqxListBox({
      source: this.buildAttachmentSource()
    });
  };

  form.buildAttachmentSource = function () {
    var attachmentInfo = this.attachmentInfo;

    var sourceData = [];

    Util.Collection.each(attachmentInfo, function (fileInfo, attachmentUid) {
      var item = {
        attachmentUid: attachmentUid
      };

      sourceData.push(item);
    });

    var source = {
      localData: sourceData,
      dataType: 'array'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    return dataAdapter;
  };

  form.buildAttachmentData = function () {
    var attachmentInfo = this.attachmentInfo;
    var attachmentData = this.attachmentData;

    var attachments = [];

    Util.Collection.each(attachmentInfo, function (fileInfo, attachmentUid) {
      var attachment = {
        name: fileInfo.name,
        size: fileInfo.size,
        extension: fileInfo.extension,

        data: attachmentData[attachmentUid]
      };

      attachments.push(attachment);
    });

    return attachments;
  };

  form.saveNews = function () {
    var newsContent = this.editor.val();
    var attachments = this.buildAttachmentData();

    this.data.attr('content', newsContent);
    this.data.attr('attachments', attachments);

    var validate = this.validateData();

    if (!validate.isValid) {
      var MsgBox = require('component.common.MsgBox');

      var message = Lang.get(validate.message, validate.messageData);
      MsgBox.alert(message);

      return;
    }

    var data = Util.Object.pick(this.data.attr(), ['title', 'content', 'categoryIds', 'attachments']);

    var NewsProxy = require('proxy.News');
    NewsProxy.create(data, this.proxy(createNewsDone));

    function createNewsDone(serviceResonse) {
      console.log(serviceResonse.getData());
    }
  };

  form.validateData = function () {
    var Validator = require('core.validator.Validator');
    var data = this.data;
    var rules = require('validator.rule.News').create;

    var validate = Validator.validate(data, rules);

    return validate;
  };

  form.addAttachments = function () {
    this.inputAttachments[0].files = null;
    this.inputAttachments.click();
  };

  form.removeAttachments = function () {
    var selectedItem = this.listBoxAttachment.jqxListBox('getSelectedItem');

    if (!selectedItem) return;

    var attachmentUid = selectedItem.value;

    this.attachmentInfo = Util.Object.omit(this.attachmentInfo, [attachmentUid]);
    this.attachmentData = Util.Object.omit(this.attachmentData, [attachmentUid]);

    console.log(this.attachmentData);

    this.refreshAttachmentList();
  };

  form.updateSelectedAttachments = function () {
    var files = this.inputAttachments[0].files;

    for (var i = 0, len = files.length; i < len; i++) {
      this.addLocalAttachment(files[i]);
    }
  };

  form.addLocalAttachment = function (file) {
    var reader = new FileReader();

    var fileInfo = {
      name: Util.File.fileName(file.name),
      size: file.size,
      extension: Util.File.fileExtension(file.name)
    }

    reader.onloadend = this.proxy(function () {
      var fileData = reader.result;

      // get base64 data
      fileData = Util.File.getBase64Data(fileData);

      var attachmentUid = new Date().valueOf();

      this.attachmentInfo[attachmentUid] = fileInfo;
      this.attachmentData[attachmentUid] = fileData;

      this.refreshAttachmentList();
    });

    reader.readAsDataURL(file);
  };

});
