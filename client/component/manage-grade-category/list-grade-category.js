/*
 * System          : 3connected
 * Component       : Grade category versions component
 * Creator         : UayLU
 * Created date    : 2014/16/06
 */
define.form('component.form.manage-gradeCategory.ListGradeCategory', function (form, require, Util, Lang) {

  // map the form to the url
  // the form is displayed when the url is matched
  // url: #!manage-gradeCategory
  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-subject-version',
      action: 'grade-category'
    }
  };

  // the template that used by the form
  form.tmpl = 'form.manage-gradeCategory.list-gradeCategory';

  // the form type is Dialog.LIST
  form.formType = form.FormType.Form.LIST;

  // the proxy that used by the form
  // proxy.findAll & proxy.destroy methods will be used
  form.ServiceProxy = require('proxy.GradeCategory');
  //  form.ServiceProxy = {
  //    proxy: require('proxy.GradeCategory'),
  //    method: 'getSubjectVersionGradeCaterogy'
  //  };
  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('gradeCategory.gradeCategoryId'),
      dataField: 'gradeCategoryId',

      cellsAlign: 'right',
      filterType: 'textbox',

      width: 100,
    }, {
      text: Lang.get('gradeCategory.subjectName'),
      dataField: 'subjectName',
    }, {
      text: Lang.get('gradeCategory.description'),
      dataField: 'description',
    }, {
      text: Lang.get('gradeCategory.gradeCategoryCode'),
      dataField: 'gradeCategoryCode',
    }, {
      text: Lang.get('gradeCategory.gradeCategoryName'),
      dataField: 'gradeCategoryName',
    }, {
      text: Lang.get('gradeCategory.weight'),
      dataField: 'weight',
    }];

    var gridConfig = {
      columns: gridColumns
    };

    return gridConfig;

  };


  form.refreshData = function (data) {
    var subjectVersionId = data.id;

    this.grid.setFilterConditions('subjectVersionId', subjectVersionId);
    this.setFormParam('subjectVersionId', subjectVersionId);
    var SubjectVersionProxy = require('proxy.SubjectVersion');

    SubjectVersionProxy.findOne({
      subjectVersionId: subjectVersionId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var subjectVersion = serviceResponse.getData();

      this.data.attr({
        subject: subjectVersion.subject,
        version: subjectVersion.description
      });
    }
  }

});
