/*
 * System          : 3connected
 * Component       : List subject versions component
 * Creator         : VyBD
 * Created date    : 2014/16/06
 */
define.form('component.form.manage-subjectVersion.ListSubjectVersion', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subjectVersion
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject',
      action: 'version'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-subjectVersion.list-subjectVersion';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.SubjectVersion');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('subjectVersion.subjectVersionId'),
      dataField: 'subjectVersionId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('subject.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('subjectVersion.description'),
      dataField: 'description',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

  form.refreshData = function (data) {

    var subjectId = data.id;

    this.setFormParam('subjectId', subjectId);

    this.grid.setFilterConditions('subjectId', subjectId);

    var SubjectProxy = require('proxy.Subject');

    SubjectProxy.findOne({
      subjectId: subjectId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var subject = serviceResponse.getData();

      this.data.attr({
        subject: subject
      });
    }
  }

});
