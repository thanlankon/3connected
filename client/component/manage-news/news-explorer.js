define.form('component.form.manage-news.NewsExplorer', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module',
    data: {
      module: 'news'
    }
  };

  form.tmpl = 'form.manage-news.news-explorer';

  form.formType = form.FormType.FORM;

  form.refreshData = function () {
    var NewsCategoryProxy = require('proxy.NewsCategory');

    NewsCategoryProxy.findAll({}, this.proxy(findAllDone));

    function findAllDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var categories = serviceResponse.getData();

      this.newsServiceProxy = null;
      this.refreshTreeCategories(categories.items);
    }
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
    this.element.find('#splitter-vertical').jqxSplitter({
      orientation: 'vertical',
      splitBarSize: 3,
      width: '100%',
      height: '100%',
      panels: [{
        size: 200
      }]
    });

    this.element.find('#splitter-horizontal').jqxSplitter({
      orientation: 'horizontal',
      splitBarSize: 3,
      width: '100%',
      height: '100%',
      panels: [{
        size: '80%',
        collapsible: false
      }]
    });

    this.treeCategories = this.element.find('#tree-categories');
    this.treeCategories.jqxTree({
      source: null,
      width: '100%',
      height: '100%',
      easing: '',
      animationShowDuration: 0,
      animationHideDuration: 0
    });

    this.treeCategories.on('select', this.proxy(function (event) {
      var args = event.args;

      var item = this.treeCategories.jqxTree('getItem', args.element);
      var value = item.value;

      this.refreshNewsList(value);
    }));

    this.panelNewsContent = this.element.find('#news-content');
    this.panelNewsContent.jqxPanel({
      width: '100%',
      height: '100%',
      sizeMode: 'fixed',
      autoUpdate: true,
      scrollBarSize: 12
    });

    this.newsServiceProxy = require('proxy.News');

    var GridComponent = require('component.common.Grid');
    this.gridNews = new GridComponent(this.element.find('#grid-news'), {
      ServiceProxy: this.newsServiceProxy,
      grid: this.getGridConfig().gridNews,
      events: {
        singleSelect: this.proxy(this.refreshNews)
      }
    });

  };

  form.refreshNews = function (newsId, row) {
    if (!newsId) {
      this.panelNewsContent.jqxPanel('clearContent');
      return;
    }

    var NewsProxy = require('proxy.News');

    NewsProxy.findOne({
      newsId: row.newsId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var newsData = serviceResponse.getData();

      this.panelNewsContent.jqxPanel('clearContent');
      this.panelNewsContent.jqxPanel('append', newsData.content);
    }
  };

  form.gridConfig = function () {
    var gridNewsColumns = [{
      text: Lang.get('news.title'),
      dataField: 'title',

      filterType: 'textbox'
    }, {
      text: Lang.get('news.author'),
      dataField: 'author',

      filterType: 'textbox',

      width: 200
    }, {
      text: Lang.get('news.createdTime'),
      dataField: 'createdTime',

      filterType: 'textbox',

      width: 130
    }];

    var gridConfig = {
      gridNews: {
        singleSelection: true,
        pageable: false,
        columns: gridNewsColumns
      }
    };

    return gridConfig;
  };

  form.refreshNewsList = function (categoryId) {
    var ServiceProxy;

    if (categoryId) {
      ServiceProxy = require('proxy.CategoryOfNews');
    } else {
      ServiceProxy = require('proxy.News');
    }

    if (this.newsServiceProxy !== ServiceProxy) {
      this.newsServiceProxy = ServiceProxy;

      this.gridNews.setFilterConditions('newsCategoryId', categoryId, true);
      this.gridNews.setServiceProxy(this.newsServiceProxy);
    } else {
      this.gridNews.setFilterConditions('newsCategoryId', categoryId);
    }

    this.refreshNews();
  };

  form.refreshTreeCategories = function (categories) {
    var categorySource = this.buildCategorySource(categories);

    this.treeCategories.jqxTree({
      source: categorySource
    });

    var items = this.treeCategories.jqxTree('getItems');
    this.treeCategories.jqxTree('selectItem', items[0]);

    this.treeCategories.jqxTree('expandAll');
  };

  form.buildCategorySource = function (categories) {
    var sourceData = [{
      newsCategoryId: null,
      parentCategoryId: '',
      newsCategoryName: Lang.get('news.allCatetories')
    }].concat(categories);

    var source = {
      dataType: 'json',
      dataFields: [{
        name: 'newsCategoryId'
      }, {
        name: 'parentCategoryId'
      }, {
        name: 'newsCategoryName'
      }],
      id: 'newsCategoryId',
      localData: sourceData
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    dataAdapter.dataBind();

    var records = dataAdapter.getRecordsHierarchy('newsCategoryId', 'parentCategoryId', 'items', [{
      name: 'newsCategoryName',
      map: 'label'
    }, {
      name: 'newsCategoryId',
      map: 'value'
    }]);

    return records;
  };

});
