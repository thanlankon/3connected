define.form('component.form.manage-news.NewsDetail', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'news',
      action: 'detail'
    }
  };

  form.tmpl = 'form.manage-news.news-detail';

  form.formType = form.FormType.FORM;

  form.initForm = function () {
    this.panelNewsContent = this.element.find('#news-content');
    this.panelNewsContent.jqxPanel({
      width: '100%',
      height: '100%',
      sizeMode: 'fixed',
      autoUpdate: true,
      scrollBarSize: 12
    });
  };

  form.refreshData = function (params) {
    var newsId = params.id;

    var Route = require('core.route.Route');

    var editFormUrl = Route.url({
      module: 'news',
      action: 'edit',
      id: newsId
    });

    // update edit button url
    this.element.find('#button-edit-news').attr('href', editFormUrl);

    this.refreshNews(newsId);
  };

  form.refreshNews = function (newsId) {
    if (!newsId) {
      this.panelNewsContent.jqxPanel('clearContent');
      return;
    }

    var NewsProxy = require('proxy.News');

    NewsProxy.findOne({
      newsId: newsId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var newsData = serviceResponse.getData();

      var attachments = newsData.attachments;
      for (var i = 0, len = attachments.length; i < len; i++) {
        attachments[i].size = Util.File.sizeText(attachments[i].size);
      }

      this.panelNewsContent.jqxPanel('clearContent');
      this.panelNewsContent.jqxPanel('append', newsData.content);

      this.data.attr(newsData);

      this.on();
    }
  };

  form.events['#button-download-attachment click'] = function (element, event) {
    if (!this.attachmentId) return;

//    var NewsProxy = require('proxy.News');
//
//    NewsProxy.downloadAttachment({
//      attachmentId: this.attachmentId
//    }, function () {});

    window.location.href = '/api/attachment/download?attachmentId=' + this.attachmentId;
  };

  form.events['.attachment click'] = function (element, event) {
    if (element.hasClass('selected')) return;

    this.element.find('.attachment.selected').removeClass('selected');

    element.addClass('selected');

    var attachmentId = element.data('attachment-id');
    this.attachmentId = attachmentId;
  };

});
