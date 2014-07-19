define.form('component.form.student-course.CourseGrade', function (form, require, Util, Lang) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'course',
      action: 'grade',
    }
  };

  form.tmpl = 'form.student-course.grade';

  form.formType = form.FormType.Form.LIST;

  form.ServiceProxy = {
    proxy: require('proxy.student.CourseOfStudent'),
    method: 'getCourseGrade',
    entityMap: 'CourseGradeEntityMap'
  };

  form.exportConfig = require('export.student.CourseGrade');

  form.refreshData = function (params) {
    var courseId = params.id;

    this.grid.setParams('courseId', courseId);

    var CourseProxy = require('proxy.Course');

    CourseProxy.findOne({
      courseId: courseId
    }, this.proxy(findOneDone));

    function findOneDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var course = serviceResponse.getData();

      this.data.attr(course);
    }
  }

  // grid config
  form.gridConfig = function () {

    var gridColumns = [{
      text: Lang.get('gradeCategory.gradeCategoryName'),
      dataField: 'gradeCategoryName',
      cellsRenderer: function (row, columnField, value) {
        if (!row.gradeCategoryCode) {
          return row.gradeCategoryName;
        }

        return Lang.get('gradeCategory.nameAndCode', {
          gradeCategoryCode: row.gradeCategoryCode,
          gradeCategoryName: row.gradeCategoryName
        });
      }
    }, {
      text: Lang.get('gradeCategory.weight'),
      dataField: 'weight',
    }, {
      text: Lang.get('grade.value'),
      dataField: 'value'
    }];

    var gridConfig = {
      columns: gridColumns,
      singleSelection: true,
      filterable: false,
      sortable: false,
      pageable: false,

      events: {
        processData: this.proxy(this.processData)
      }
    };

    return gridConfig;

  };

  form.processData = function (data, originalData) {
    var totalGrade = 0;
    var totalWeight = 0;

    var isCompleted = true;

    for (var i = 0, len = data.length; i < len; i++) {
      var grade = data[i];

      if (grade.value === 0 || grade.value) {
        totalWeight += grade.weight;

        totalGrade += grade.value * grade.weight;
      } else {
        isCompleted = false;
      }
    }

    var averageGrade = totalGrade / totalWeight;

    var totalText = isCompleted ? Lang.get('grade.averageGrade') : Lang.get('grade.accumulationGrade');

    var aggregateItem = {
      gradeCategoryName: '<span class="average-grade">' + Lang.get('grade.averageGrade') + '</span>',
      value: '<span class="average-grade">' + averageGrade.toFixed(2) + '</span>',
    }

    data.push(aggregateItem);

    originalData.items = data;
    originalData.total = data.length;
  };

});
