define.form('component.dialog.manage-student.ImportStudent', function (form, require, Util, Lang, jQuery) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'manage-student',
      action: 'import-student'
    }
  };

  form.tmpl = 'dialog.manage-student.import-student';

  form.formType = form.FormType.DIALOG;

  form.initData = function () {

    var columns = [{
      name: 'studentCode',
      text: Lang.get('student.studentCode')
    }, {
      name: 'firstName',
      text: Lang.get('student.firstName')
    }, {
      name: 'lastName',
      text: Lang.get('student.lastName')
    }, {
      name: 'gender',
      text: Lang.get('student.gender')
    }, {
      name: 'dateOfBirth',
      text: Lang.get('student.dateOfBirth')
    }, {
      name: 'address',
      text: Lang.get('student.address')
    }, {
      name: 'email',
      text: Lang.get('student.email')
    }];

    this.data.attr({
      columns: columns
    });

  }

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
    var MsgBox = require('component.common.MsgBox');
    var Gender = require('enum.Gender');

    var columns = this.data.columns.attr();

    var columnBind = {};

    for (var i = 0, len = columns.length; i < len; i++) {
      columnBind[columns[i].name] = (columns[i].bindToColumn || '').trim();
    }

    if (!columnBind.studentCode) {
      MsgBox.alert({
        text: Lang.get('student.import.studentCode.required'),
        icon: 'warning'
      });

      return;
    }

    if (!columnBind.firstName) {
      MsgBox.alert({
        text: Lang.get('student.import.firstName.required'),
        icon: 'warning'
      });

      return;
    }

    if (!columnBind.lastName) {
      MsgBox.alert({
        text: Lang.get('student.import.lastName.required'),
        icon: 'warning'
      });

      return;
    }

    if (!columnBind.gender) {
      MsgBox.alert({
        text: Lang.get('student.import.gender.required'),
        icon: 'warning'
      });

      return;
    }

    if (!columnBind.dateOfBirth) {
      MsgBox.alert({
        text: Lang.get('student.import.dateOfBirth.required'),
        icon: 'warning'
      });

      return;
    }

    var workbook = this.Workbook;

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

    var columnMap = {};
    columnMap[columnBind.studentCode] = 'studentCode';
    columnMap[columnBind.firstName] = 'firstName';
    columnMap[columnBind.lastName] = 'lastName';
    columnMap[columnBind.gender] = 'gender';
    columnMap[columnBind.dateOfBirth] = 'dateOfBirth';

    if (columnBind.address) {
      columnMap[columnBind.address] = 'address';
    }
    if (columnBind.email) {
      columnMap[columnBind.email] = 'email';
    }

    var studentColumn = columnBind.studentCode;

    var studentMaps = {};

    for (var i = rowStart; i <= rowEnd; i++) {
      var studentCell = sheet[studentColumn + i];

      if (!studentCell) continue;

      var studentCode = studentCell.v;
      studentCode = (studentCode || '').trim();

      if (studentCode == '') continue;

      studentMaps[i] = {
        studentCode: studentCode
      }

      for (var j = columnStart; j <= columnEnd; j++) {
        var columnChar = String.fromCharCode(j);

        if (columnChar === studentColumn || !columnMap[columnChar]) continue;

        var cellChar = columnChar + i;
        var value = sheet[cellChar];

        if (!value) continue;

        if (columnMap[columnChar] === 'gender') {
          value = (value.v || '').trim();

          if (value.toUpperCase() === 'MALE') {
            value = Gender.MALE;
          } else if (value.toUpperCase() === 'FEMALE') {
            value = Gender.FEMALE;
          } else {
            value = Gender.UNKNOWN;
          }
        } else {
          value = value.v;
        }

        studentMaps[i][columnMap[columnChar]] = value;
      }
    }

    var students = [];

    Util.Collection.each(studentMaps, function (student) {
      students.push(student);
    });

    var StudentProxy = require('proxy.Student');

    StudentProxy.importStudent({
      students: students
    }, this.proxy(importStudentDone));

    function importStudentDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var importStudentData = serviceResponse.getData();
      console.log('Import done', importStudentData);
    }

  };

});
