/*
 * System          : 3connected
 * Component       : List subjects component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.form.manage-subject.ListSubject', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subject
  form.urlMap = {
    url: ':module',
    data: {
      module: 'manage-subject'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-subject.list-subject';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Subject');

  // the config used for exporting grid data
  form.exportConfig = require('export.Subject');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('subject.subjectId'),
      dataField: 'subjectId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('subject.subjectCode'),
      dataField: 'subjectCode',
    }, {
      text: Lang.get('subject.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('subject.numberOfCredits'),
      dataField: 'numberOfCredits',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

});
