define.form('component.form.manage-newsCategory.ListNewsCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-news-category
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-news-category'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-newsCategory.list-newsCategory';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.NewsCategory');

  // the config used for exporting grid data
  form.exportConfig = require('export.NewsCategory');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('newsCategory.newsCategoryId'),
      dataField: 'newsCategoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 150,
    }, {
      text: Lang.get('newsCategory.newsCategoryName'),
      dataField: 'newsCategoryName',
    }, {
      text: Lang.get('newsCategory.parentCategoryId'),
      dataField: 'parentCategoryId',
    }, {
      text: Lang.get('newsCategory.parentCategoryName'),
      dataField: 'parentCategoryName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
