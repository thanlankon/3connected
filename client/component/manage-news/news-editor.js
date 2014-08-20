define.form('component.form.manage-news.Editor', function (form, require, Util, Lang) {

  form.urlMap = [{
    url: ':module/:action',
    data: {
      module: 'news',
      action: 'create'
    }
  }, {
    url: ':module/:action/:id',
    data: {
      module: 'news',
      action: 'edit'
    }
  }];

  form.tmpl = 'form.manage-news.news-editor';

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

  form.loadNews = function (newsId) {
    var NewsProxy = require('proxy.News');

    NewsProxy.findOne({
      newsId: newsId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var newsData = serviceResponse.getData();

      var categoryIds = [];
      for (var i = 0, len = newsData.categories.length; i < len; i++) {
        var category = newsData.categories[i];
        categoryIds.push(category.newsCategoryId);
      }

      this.attachmentInfo = {};
      this.attachmentData = {};

      for (var i = 0, len = newsData.attachments.length; i < len; i++) {
        var attachment = newsData.attachments[i];

        var attachmentUid = this.attachmentUid();

        var fileInfo = {
          name: attachment.name,
          size: attachment.size,
          extension: attachment.extension,
          isCreated: true
        };

        this.attachmentInfo[attachmentUid] = fileInfo;
        this.attachmentData[attachmentUid] = null;
      }

      this.data.attr({
        title: newsData.title,
        categoryIds: categoryIds
      });

      this.refreshAttachmentList();

      NewsProxy.getContent({
        newsId: newsData.newsId
      }, this.proxy(getContentDone), {
        server: newsData.serverId
      });

      this.serverId = newsData.serverId;

      this.on();
    }

    function getContentDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var content = serviceResponse.getData();

      this.editor.val(content);
      this.data.attr({
        content: content
      });
    }
  };

  form.refreshData = function (params) {
    this.newsId = params.id;

    if (!this.isFormInitialized) {
      return;
    };

    console.log('params', params);

    if (params.action == 'edit') {
      // load news for edit
      this.data.attr({
        newsId: this.newsId
      });

      this.loadNews(params.id);

      this.isEditNews = true;
    } else {
      // clear form for create
      this.editor.val('');

      this.data.attr({
        title: null,
        content: null,
        categoryIds: null
      });

      this.data.attr({
        categoryIds: []
      });

      this.data.removeAttr('newsId');

      this.attachmentInfo = {};
      this.attachmentData = {};

      this.refreshAttachmentList();

      this.isEditNews = false;
    }
  };

  form.initForm = function () {
    this.element.on('visible', this.proxy(this.initFormComponents));
  };

  form.initFormComponents = function () {
    if (this.isFormInitialized) return;

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
      height: '200px',
      itemHeight: 47,

      renderer: this.proxy(function (index, label, value) {
        var fileInfo = this.attachmentInfo[value];

        if (!fileInfo) return '';

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
    //jQuery(window).resize(this.proxy(this.resizeFormComponents));

    // handle for add - remove attachments
    this.element.find('#button-add-attachments').click(this.proxy(this.addAttachments));
    this.element.find('#button-remove-attachments').click(this.proxy(this.removeAttachments));

    // handle for save
    this.element.find('#button-save').click(this.proxy(this.saveNews));

    // handle for attachments selected
    this.inputAttachments = this.element.find('#input-attachments');
    this.inputAttachments.change(this.proxy(this.updateSelectedAttachments));

    // mark form initialized
    this.isFormInitialized = true;

    if (this.newsId) {
      this.refreshData({
        module: 'news',
        action: 'edit',
        id: this.newsId
      });
    }
  };

  form.resizeFormComponents = function () {
    this.resizeEditor();
    //this.resizeAttachmentListBox();
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
    var source = this.buildAttachmentSource();

    this.listBoxAttachment.jqxListBox({
      source: source
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

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

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
      MsgBox.alert({
        text: message,
        icon: 'warning'
      });

      return;
    }

    var data = Util.Object.pick(this.data.attr(), ['title', 'content', 'categoryIds', 'attachments']);

    var NewsProxy = require('proxy.News');

    if (this.isEditNews) {
      data.newsId = this.newsId;

      NewsProxy.update(data, this.proxy(updateNewsDone), {
        server: this.serverId
      });
    } else {
      NewsProxy.create(data, this.proxy(createNewsDone));
    }

    function createNewsDone(serviceResonse) {
      if (serviceResonse.hasError()) return;

      var newsData = serviceResonse.getData();
      var newsId = newsData.newsId;

      var Route = require('core.route.Route');

      Route.attr({
        module: 'news',
        action: 'detail',
        id: newsId
      });
    }

    function updateNewsDone(serviceResonse) {
      if (serviceResonse.hasError()) return;

      console.log('update done');
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

      var attachmentUid = this.attachmentUid();

      this.attachmentInfo[attachmentUid] = fileInfo;
      this.attachmentData[attachmentUid] = fileData;

      this.refreshAttachmentList();
    });

    reader.readAsDataURL(file);
  };

  form.attachmentUid = function () {
    return Util.uniqueId();
  };

});
