define.component('component.common.GradeGrid', function (component, require, Util, Lang, jQuery) {

  component.gradeCalculation = {};

  // grid columns
  component.getGridColumns = function () {

    var gradeCategories = this.gradeCategories || [];

    var gridColumns = [{
      text: Lang.get('grade.student.studentCode'),
      dataField: 'studentCode',
      //      columnGroup: 'student',

      width: '150px',

      filterType: 'textbox',
      editable: false,

      cellClassName: function (row, dataField, value, rowData) {}
    }, {
      text: Lang.get('grade.student.firstName'),
      dataField: 'firstName',
      //      columnGroup: 'student',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('grade.student.lastName'),
      dataField: 'lastName',
      //      columnGroup: 'student',

      filterType: 'textbox',
      editable: false,
    }];

    for (var i = 0, len = gradeCategories.length; i < len; i++) {
      var gradeCategory = gradeCategories[i];

      var column = {
        text: Lang.get('grade.nameCode', {
          name: gradeCategory.gradeCategoryName,
          code: gradeCategory.gradeCategoryCode
        }),
        dataField: 'gradeCategory.' + gradeCategory.gradeCategoryCode,
        //          columnGroup: 'grade',

        filterType: 'textbox',
        editable: true,

        type: 'number',

        validation: function (cell, value) {
          if (value != null && (value < 0 || value > 10)) {
            return {
              result: false,
              message: "Quantity should be in the 0-10 interval"
            };
          }

          return true;
        }
      };

      gridColumns.push(column);
    }

    gridColumns.push({
      text: Lang.get('grade.averageGrade'),
      filterType: 'textbox',
      editable: false,
      dataField: 'averageGrade',

      cellsRenderer: this.proxy(function (rowIndex, columnField, value, defaultHtml, columnProperties) {
        var GradeConstant = require('constant.Grade');
        var GradeStatus = require('enum.GradeStatus');

        var totalGrade = 0;
        var totalWeight = 0;
        var gradeStatus;

        var rowData = this.element.jqxGrid('getrowdata', rowIndex);

        for (var i = 0, len = gradeCategories.length; i < len; i++) {
          var gradeCategory = gradeCategories[i];
          var grade = rowData['gradeCategory.' + gradeCategory.gradeCategoryCode];
          var weight = gradeCategory.weight;
          var minimunGrade = gradeCategory.minimunGrade;

          if (grade == null) {
            if (gradeStatus === undefined) {
              gradeStatus = GradeStatus.UNFINISHED;
            }
          } else {
            totalGrade += grade * weight;
            totalWeight += weight;

            if (grade < minimunGrade && gradeStatus === undefined) {
              gradeStatus = GradeStatus.FAIL;
            }
          }
        }

        var averageGrade = totalGrade / totalWeight;
        if (isNaN(averageGrade)) {
          averageGrade = null;
        }

        if (gradeStatus === undefined) {
          if (averageGrade >= GradeConstant.PASS_GRADE) {
            gradeStatus = GradeStatus.PASS;
          } else if (totalWeight == 0) {
            gradeStatus = GradeStatus.UNFINISHED;
          } else {
            gradeStatus = GradeStatus.FAIL;
          }
        }

        this.gradeCalculation[rowIndex] = {
          gradeStatus: gradeStatus
        }

        var text = (averageGrade !== 0 && !averageGrade) ? '' : averageGrade
        text = '<span class="statistic">' + text + '</span>';

        return defaultCellRenderer(defaultHtml, text);
      })
    }, {
      text: Lang.get('grade.averageGrade'),
      filterType: 'textbox',
      editable: false,
      dataField: 'gradeStatus',

      cellsRenderer: this.proxy(function (rowIndex, columnField, value, defaultHtml, columnProperties) {
        var GradeStatus = require('enum.GradeStatus');

        var gradeCalculation = this.gradeCalculation[rowIndex];

        var text;

        if (gradeCalculation) {
          switch (gradeCalculation.gradeStatus) {
          case GradeStatus.PASS:
            text = Lang.get('grade.status.pass');
            text = '<span class="grade-status grade-status-pass">' + text + '</span>';

            break;
          case GradeStatus.FAIL:
            text = Lang.get('grade.status.fail');
            text = '<span class="grade-status grade-status-fail">' + text + '</span>';

            break;
          case GradeStatus.UNFINISHED:
            text = Lang.get('grade.status.unfinished');
            text = '<span class="grade-status grade-status-unfinished">' + text + '</span>';

            break;
          }
        }

        return defaultCellRenderer(defaultHtml, text);
      })
    });

    return gridColumns;

    function defaultCellRenderer(defaultHtml, text) {
      var elmHtml = jQuery(defaultHtml).html(text);
      var elmWrapper = jQuery('<div />');

      var html = elmWrapper.append(elmHtml).html();

      elmHtml.remove();
      elmWrapper.remove();

      return html;
    }

  };

  component.getGridDataFields = function () {

    var gradeCategories = this.gradeCategories || [];

    var gridDataFields = [{
      name: 'studentId',
      type: 'number'
    }, {
      name: 'studentCode',
      type: 'string'
    }, {
      name: 'firstName',
      type: 'string'
    }, {
      name: 'lastName',
      type: 'string'
    }];

    for (var i = 0, len = gradeCategories.length; i < len; i++) {
      var gradeCategory = gradeCategories[i];

      var field = {
        name: 'gradeCategory.' + gradeCategory.gradeCategoryCode,
        type: 'number'
      };

      gridDataFields.push(field);
    }

    gridDataFields.push({
      name: 'averageGrade',
      type: 'number'
    }, {
      name: 'gradeStatus',
      type: 'string'
    });

    return gridDataFields;
  }

  component.initComponent = function (element, options) {
    var formElement = this.element.closest('.form');

    formElement.on('visible', this.proxy(this.initGrid));
  };

  component.initGrid = function () {

    // check for init grid only once
    if (this.isGridInitialized) {
      return;
    } else {
      this.isGridInitialized = true;
    }

    var source = this.generateSource();
    var columns = this.getGridColumns();

    this.element.addClass('grade-grid');

    this.element.jqxGrid({
      source: source,
      columns: columns,
      columngroups: [{
        text: Lang.get('grade.group.student'),
        align: 'center',
        name: 'student'
        }, {
        text: Lang.get('grade.group.grade'),
        align: 'center',
        name: 'grade'
      }],

      pageable: false,
      sortable: false,
      filterable: true,
      showFilterRow: true,
      editable: true,
      selectionMode: 'multipleCellsAdvanced',

      width: '100%',
      height: '100%',
      scrollbarSize: 12,
      scrollMode: 'logical'
    });

    this.element.jqxGrid('removesort');

  };

  component.refreshData = function (gradeData) {

    this.gradeCategories = gradeData ? gradeData.gradeCategories : undefined;

    var source = this.generateSource(gradeData);
    var columns = this.getGridColumns();

    this.element.jqxGrid({
      source: source,
      columns: columns,
    });

  };

  component.generateSource = function (gradeData) {
    var sourceData = [];
    var dataFields;

    if (gradeData) {
      var gradeCategories = this.gradeCategories || [];

      var students = gradeData.students || [];
      var grades = gradeData.grades || [];

      // generate data fields
      dataFields = this.getGridDataFields(gradeCategories);

      // map of grade category id and code
      var gradeCategoryIdCodeMaps = {};
      for (var i = 0, len = gradeCategories.length; i < len; i++) {
        var gradeCategory = gradeCategories[i];
        gradeCategoryIdCodeMaps[gradeCategory.gradeCategoryId] = gradeCategory.gradeCategoryCode;
      }

      // build original grades
      var originalGrades = this.originalGrades = {};

      for (var i = 0, studentLen = students.length; i < studentLen; i++) {
        var student = students[i];
        var studentGrade = originalGrades[student.studentId] = {};

        for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
          var gradeCategory = gradeCategories[j];

          studentGrade[gradeCategory.gradeCategoryCode] = {
            gradeId: null,
            gradeCategoryId: null,
            value: null
          };
        }
      }

      // update original grade
      for (var i = 0, len = grades.length; i < len; i++) {
        var grade = grades[i];

        var gradeCategoryCode = gradeCategoryIdCodeMaps[grade.gradeCategoryId];

        // skip grade not in the null grade list
        if (
          originalGrades[grade.studentId] === undefined ||
          originalGrades[grade.studentId][gradeCategoryCode] === undefined
        ) continue;

        originalGrades[grade.studentId][gradeCategoryCode] = {
          gradeId: grade.gradeId,
          gradeCategoryId: grade.gradeCategoryId,
          value: grade.value
        };
      };

      // generate source

      for (var i = 0, studentLen = students.length; i < studentLen; i++) {
        var student = students[i];

        var item = {
          studentId: student.studentId,
          studentCode: student.studentCode,
          firstName: student.firstName,
          lastName: student.lastName
        };

        for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
          var gradeCategory = gradeCategories[j];

          var value = originalGrades[student.studentId][gradeCategory.gradeCategoryCode].value;
          item['gradeCategory.' + gradeCategory.gradeCategoryCode] = value;
        };

        sourceData.push(item);
      }
    } else {
      dataFields = this.getGridDataFields();
    }

    // build source
    var source = {
      dataType: 'local',
      localData: sourceData,
      dataFields: dataFields
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  };

  component.setEditable = function (editable) {
    this.isGridEditable = editable;

    this.element.jqxGrid({
      editable: editable,
      selectionMode: 'multipleCellsAdvanced'
    });
  };

  component.getGradeData = function () {

    var gradeData = [];

    var gradeCategories = this.gradeCategories || [];

    if (!gradeCategories.length) return gradeData;

    var gridRows = this.element.jqxGrid('getdisplayrows');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];
      var studentId = row.studentId;
      var originalData = this.originalGrades[studentId];

      // skip empty row
      if (!row || !originalData) continue;

      for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
        var gradeCategory = gradeCategories[j];

        var gradeCategoryCode = gradeCategory.gradeCategoryCode;
        var value = row['gradeCategory.' + gradeCategoryCode];

        // skip unchanged data
        if (originalData && originalData[gradeCategoryCode].value === value) continue;

        var item = {
          gradeId: originalData[gradeCategoryCode].gradeId,
          gradeCategoryId: gradeCategory.gradeCategoryId,
          studentId: studentId,
          value: value
        };

        gradeData.push(item);
      }
    }

    return gradeData;

  };

});
