define.form('component.form.manage-class.ListClass', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-class
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-class'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-class.list-class';

  // the form type is Form.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Class');

  // the config used for exporting grid data
  form.exportConfig = require('export.Class');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
        text: Lang.get('class.classId'),
        dataField: 'classId',

        cellsAlign: 'right',
        filterType: 'textbox',

        width: 150,
        hidden: false
      },
      {
        text: Lang.get('class.className'),
        dataField: 'className',
      },
      {
        text: Lang.get('class.batchName'),
        dataField: 'batchName',
      },
      {
        text: Lang.get('major.majorName'),
        dataField: 'majorName',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
