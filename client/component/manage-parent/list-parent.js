/*
 * System          : 3connected
 * Component       : List parents component
 * Creator         : UayLU
 * Created date    : 2014/01/07
 */
define.form('component.form.manage-parent.Listparent', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-subjectVersion
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-student',
      action: 'parent'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-parent.list-parent';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.Parent');

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('parent.parentId'),
      dataField: 'parentId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('parent.firstName'),
      dataField: 'firstName',
    }, {
      text: Lang.get('parent.lastName'),
      dataField: 'lastName',
    }, {
      text: Lang.get('parent.relationship'),
      dataField: 'relationship',

      width: '150px'
    }, {
      text: Lang.get('parent.gender'),
      dataField: 'gender',

      width: '150px'
    }, {
      text: Lang.get('parent.dateOfBirth'),
      dataField: 'dateOfBirth',

      width: '150px'
    }, {
      text: Lang.get('parent.address'),
      dataField: 'address',
    }, {
      text: Lang.get('parent.email'),
      dataField: 'email',

      width: '200px'
    }, {
      text: Lang.get('parent.phoneNumber'),
      dataField: 'phoneNumber',

      width: '180px'
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };

  form.refreshData = function (data) {

    var studentId = data.id;

    this.setFormParam('studentId', studentId);

    this.grid.setFilterConditions('studentId', studentId);

    var StudentProxy = require('proxy.Student');

    StudentProxy.findOne({
      studentId: studentId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var student = serviceResponse.getData();

      this.data.attr({
        student: student
      });
    }
  }

});
