define.component('component.common.GradeGrid', function (component, require, Util, Lang, jQuery) {

  // grid columns
  component.getGridColumns = function (gradeCategories) {

    var gridColumns = [{
      text: Lang.get('attendance.student.studentCode'),
      dataField: 'studentCode',
      //      columnGroup: 'student',

      width: '150px',

      filterType: 'textbox',
      editable: false,

      cellClassName: function (row, dataField, value, rowData) {}
    }, {
      text: Lang.get('attendance.student.firstName'),
      dataField: 'firstName',
      //      columnGroup: 'student',

      filterType: 'textbox',
      editable: false,
    }, {
      text: Lang.get('attendance.student.lastName'),
      dataField: 'lastName',
      //      columnGroup: 'student',

      filterType: 'textbox',
      editable: false,
    }];

    if (gradeCategories) {

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

    }

    return gridColumns;

  };

  component.getGridDataFields = function (gradeCategories) {

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

    if (gradeCategories) {
      for (var i = 0, len = gradeCategories.length; i < len; i++) {
        var gradeCategory = gradeCategories[i];

        var field = {
          name: 'gradeCategory.' + gradeCategory.gradeCategoryCode,
          type: 'number'
        };

        gridDataFields.push(field);
      }
    }

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

    var source = this.generateSource(gradeData);
    var columns = this.getGridColumns(gradeData ? gradeData.gradeCategories : undefined);

    console.log(columns);

    this.element.jqxGrid({
      source: source,
      columns: columns,
    });

  };

  component.generateSource = function (gradeData) {
    var sourceData = [];
    var dataFields;

    if (gradeData) {
      var gradeCategories = gradeData.gradeCategories || [];
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
      var originalGrades = {};

      for (var i = 0, studentLen = students.length; i < studentLen; i++) {
        var student = students[i];
        var studentGrade = originalGrades[student.studentId] = {};

        for (var j = 0, gradeCategoryLen = gradeCategories.length; j < gradeCategoryLen; j++) {
          var gradeCategory = gradeCategories[j];

          studentGrade[gradeCategory.gradeCategoryCode] = {
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
          gradeCategoryId: grade.gradeCategoryId,
          value: grade.value
        };
      };

      console.log(originalGrades);

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

        console.log(item);

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
  };

  component.getGradeData = function () {

  };

});
