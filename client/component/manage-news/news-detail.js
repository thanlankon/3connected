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
    // this.element.find('#button-edit-news').attr('href', editFormUrl);

    this.data.attr({
      editUrl: editFormUrl
    });

    this.refreshNews(newsId);
  };

  form.deleteNews = function () {
    var newsTitle = this.data.attr('title');
    var newsId = this.data.attr('newsId');

    var MsgBox = require('component.common.MsgBox');

    MsgBox.confirm(Lang.get('news.delete.confirm', {
      title: newsTitle
    }), this.proxy(function () {
      var NewsProxy = require('proxy.News');

      NewsProxy.destroy({
        newsId: newsId
      }, this.proxy(destroyNewsDone), {
        server: this.serverId
      });
    }));

    function destroyNewsDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var Route = require('core.route.Route');
      Route.removeAttr('action');
      Route.removeAttr('id');
      Route.attr({
        module: 'news'
      });
    }
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

      this.data.removeAttr('categories');
      this.data.removeAttr('attachments');
      this.data.attr(newsData);

      var Role = require('enum.Role');
      var isNewsEditable = Role.isStaff(this.authentication.accountRole);
      isNewsEditable = (isNewsEditable && this.authentication.userInformationId == newsData.authorId);

      this.data.attr({
        isNewsEditable: isNewsEditable
      });

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

      this.panelNewsContent.jqxPanel('append', content);
    }
  };

  form.events['#button-delete-news click'] = function (element, event) {
    event.preventDefault();

    this.deleteNews();
  }

  form.events['#button-download-attachment click'] = function (element, event) {
    if (!this.attachmentId) return;

    //    var NewsProxy = require('proxy.News');
    //
    //    NewsProxy.downloadAttachment({
    //      attachmentId: this.attachmentId
    //    }, function () {});

    var Server = require('constant.Server');
    if (Server.enableProxy) {
      window.location.href = '/api/attachment/download?attachmentId=' + this.attachmentId + '&serverId=' + this.serverId;
    } else {
      window.location.href = Server[this.serverId] + '/api/attachment/download?attachmentId=' + this.attachmentId;
    }
  };

  form.events['.attachment click'] = function (element, event) {
    if (element.hasClass('selected')) return;

    this.element.find('.attachment.selected').removeClass('selected');

    element.addClass('selected');

    var attachmentId = element.data('attachment-id');
    this.attachmentId = attachmentId;
  };

});
