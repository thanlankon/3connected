define.form('component.dialog.manage-course.ImportGrade', function (form, require, Util, Lang, jQuery) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'manage-course',
      action: 'import-grade'
    }
  };

  form.tmpl = 'dialog.manage-course.import-grade';

  form.formType = form.FormType.Dialog.VIEW;

  form.ServiceProxy = require('proxy.Course');

  form.reloadData = function (params) {
    var courseId = this.data.attr('courseId');
    var subjectVersionId = this.data.attr('subjectVersionId');

    this.courseId = courseId;

    var filters = [{
      field: 'subjectVersionId',
      value: subjectVersionId
    }];

    var GradeCategoryProxy = require('proxy.GradeCategory');
    GradeCategoryProxy.findAll({
      filters: filters
    }, this.proxy(findGradeCategoryDone));

    function findGradeCategoryDone(serviceResponse) {
      if (serviceResponse.hasError()) {
        this.hideForm()
        return;
      }

      var serviceData = serviceResponse.getData();

      var gradeCategories = [];

      for (var i = 0, len = serviceData.items.length; i < len; i++) {
        var item = serviceData.items[i];

        var gradeCategory = {
          gradeCategoryId: item.gradeCategoryId,
          gradeCategoryCode: item.gradeCategoryCode,
          gradeCategoryName: item.gradeCategoryName,

          bindToAttribute: 'gradeCategories.' + i + '.bindToColumn'
        }

        gradeCategories.push(gradeCategory);
      }

      this.data.attr({
        gradeCategories: gradeCategories
      });
    }
  };

  form.initDialog = function () {
    this.inputImportFile = this.element.find('#input-import-file');

    this.inputImportFile.change(this.proxy(this.updateFileImport));

    this.element.find('#button-browse-import-file').click(this.proxy(function () {
      this.inputImportFile.click();
    }));
  }

  form.updateFileImport = function (event) {
    var files = event.target.files;
    var importFile = files.item(0);

    if (!importFile) return;

    var Xlsx = require('lib.Xlsx');
    var MsgBox = require('component.common.MsgBox');

    this.data.attr('importFileName', importFile.name);

    var reader = new FileReader();

    reader.onload = this.proxy(function (event) {
      var fileData = event.target.result;

      try {
        var workbook = Xlsx.read(fileData, {
          type: 'binary'
        });

        this.Workbook = workbook;
      } catch (exception) {
        this.Workbook = null;

        MsgBox.alert({
          text: Lang.get('grade.import.importFileInvalid'),
          icon: 'warning'
        });
      }

    });

    reader.readAsBinaryString(importFile);
  }

  form.submitDialogData = function () {
    if (!this.courseId) return;

    var Xlsx = require('lib.Xlsx');
    var MsgBox = require('component.common.MsgBox');

    var workbook = this.Workbook;

    if (!workbook) {
      MsgBox.alert({
        text: Lang.get('grade.import.importFileRequired'),
        icon: 'warning'
      });

      return;
    }

    var studentColumn = this.data.attr('studentColumn');

    if (!studentColumn) {
      MsgBox.alert({
        text: Lang.get('grade.import.studentColumnRequired'),
        icon: 'warning'
      });

      return;
    }

    var textStartRow = this.data.attr('startRow');
    textStartRow = (textStartRow || '').trim();

    var startRow = ~~textStartRow;
    if (textStartRow !== '' && (startRow != textStartRow || startRow < 1)) {
      MsgBox.alert({
        text: Lang.get('grade.import.startRowInvalid'),
        icon: 'warning'
      });

      return;
    }

    var gradeCategories = this.data.attr('gradeCategories');

    var columnMap = {};

    for (var i = 0, len = gradeCategories.length; i < len; i++) {
      var gradeCategory = gradeCategories[i];

      if (!gradeCategory.bindToColumn) continue;

      columnMap[gradeCategory.bindToColumn] = {
        gradeCategoryId: gradeCategory.gradeCategoryId,
        gradeCategoryCode: gradeCategory.gradeCategoryCode,
      };
    }

    var sheet = workbook.Sheets[workbook.SheetNames[0]];
    var ref = sheet['!ref'];

    if (!ref) {
      MsgBox.alert({
        text: Lang.get('grade.import.noDataFound'),
        icon: 'warning'
      });

      return;
    }

    var regex = /^([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)$/;

    ref = regex.exec(ref);

    var columnStart = ref[1].charCodeAt(0);
    var columnEnd = ref[3].charCodeAt(0);
    var rowStart = Math.max(ref[2], startRow);
    var rowEnd = +ref[4];

    var gradeMaps = {};

    for (var i = rowStart; i <= rowEnd; i++) {
      var studentCell = sheet[studentColumn + i];

      if (!studentCell) continue;

      var studentCode = studentCell.v;
      studentCode = (studentCode || '').trim();

      if (studentCode == '') continue;

      gradeMaps[i] = {
        studentCode: studentCode,
        grades: []
      }

      for (var j = columnStart; j <= columnEnd; j++) {
        var columnChar = String.fromCharCode(j);

        if (columnChar === studentColumn || !columnMap[columnChar]) continue;

        var cellChar = columnChar + i;
        var value = sheet[cellChar];

        if (!value) continue;

        value = parseFloat(value.v);

        if (isNaN(value) || value < 0 || value > 10) {
          MsgBox.alert({
            text: Lang.get('grade.import.invalidValueAt', {
              cell: cellChar
            }),
            icon: 'warning'
          });

          return;
        }

        var grade = {
          gradeCategoryId: columnMap[columnChar].gradeCategoryId,
          gradeCategoryCode: columnMap[columnChar].gradeCategoryCode,
          value: value
        }

        gradeMaps[i].grades.push(grade);
      }
    }

    var grades = {};

    Util.Collection.each(gradeMaps, function (gradeMap) {
      grades[gradeMap.studentCode] = gradeMap.grades;
    });

    var gradeData = {
      courseId: this.courseId,
      grades: grades
    };

    var GradeProxy = require('proxy.Grade');

    GradeProxy.importGrade(gradeData, this.proxy(importGradeDone));

    function importGradeDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var importGradeData = serviceResponse.getData();
      console.log('Import done', importGradeData);
    }

  };

});
