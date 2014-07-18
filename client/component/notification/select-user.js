define.form('component.dialog.notification.SelectUser', function (form, require, Util, Lang, jQuery) {

  form.urlMap = {
    url: ':module/:action',
    data: {
      module: 'notification',
      action: 'select-user'
    }
  };

  form.tmpl = 'dialog.notification.select-user';

  form.formType = form.FormType.DIALOG;

  form.skipRefresh = true;

  form.getSelectTypes = function () {

    var selectTypes = [{
      id: 'all:students,parents',
      text: Lang.get('notification.selectType.allStudentsAndParents')
    }, {
      id: 'all:students',
      text: Lang.get('notification.selectType.allStudents')
    }, {
      id: 'all:parents',
      text: Lang.get('notification.selectType.allParents')
    }, {
      id: 'class:students,parents',
      text: Lang.get('notification.selectType.classStudentsAndParents')
    }, {
      id: 'class:students',
      text: Lang.get('notification.selectType.classStudents')
    }, {
      id: 'class:parents',
      text: Lang.get('notification.selectType.classParents')
    }, {
      id: 'course:students,parents',
      text: Lang.get('notification.selectType.courseStudentsAndParents')
    }, {
      id: 'course:students',
      text: Lang.get('notification.selectType.courseStudents')
    }, {
      id: 'course:parents',
      text: Lang.get('notification.selectType.courseParents')
    }, {
      id: 'specific:students,parents',
      text: Lang.get('notification.selectType.specificStudentsAndParents')
    }, {
      id: 'specific:students',
      text: Lang.get('notification.selectType.specificStudents')
    }, {
      id: 'specific:parents',
      text: Lang.get('notification.selectType.specificParents')
    }];

    return selectTypes;

  };

  form.initData = function () {

    var componentSettings = {
      selectType: {
        localDataAttribute: 'selectTypes',
        combobox: {
          valueMember: 'id',
          displayMember: 'text'
        }
      }
    };

    this.data.attr({
      selectTypes: this.getSelectTypes(),

      componentSettings: componentSettings
    });

  };

  form.initDialog = function () {

    this.listOfUsers = this.element.find('#list-users');

    this.listOfUsers.jqxListBox({
      source: this.buildUsersSource('all:students,parents'),
      width: '100%',
      height: '210px',
      displayMember: 'text',
      valueMember: 'uniqueId',
      checkboxes: true
    });

    this.data.bind('change', this.proxy(this.findUsers));
    this.findUsers();
  };

  form.findUsers = function (event, attr, how, newVal, oldVal) {
    var selectType = this.data.attr('selectType');
    var filter = (this.data.attr('filter') || '').trim();

    this.data.componentElements.filter.jqxInput({
      disabled: !selectType || ['all:students,parents', 'all:students', 'all:parents'].indexOf(selectType) !== -1
    });

    switch (selectType) {
    case 'class:students,parents':
    case 'class:students':
    case 'class:parents':
      var data = {
        filters: [{
          field: 'className',
          value: filter
        }]
      };

      var ClassProxy = require('proxy.Class');
      ClassProxy.findAll(data, this.proxy(findClassDone));

      break;
    case 'course:students,parents':
    case 'course:students':
    case 'course:parents':
      var data = {
        filters: [{
          field: 'courseName',
          value: filter
        }]
      };

      var CourseProxy = require('proxy.Course');
      CourseProxy.findAll(data, this.proxy(findCourseDone));

      break;
    case 'specific:students,parents':
    case 'specific:students':
    case 'specific:parents':
      if (filter) {
        var data = {
          filters: [{
            field: 'studentCode',
            value: filter
          }]
        };

        var StudentProxy = require('proxy.Student');
        StudentProxy.findAll(data, this.proxy(findStudentDone));
      } else {
        this.refreshListOfUsers(selectType);
      }

      break;
    default:
      this.refreshListOfUsers(selectType);

      break;
    }

    function findClassDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var items = serviceResponse.getData().items;
      this.refreshListOfUsers(selectType, items);
    }

    function findCourseDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var items = serviceResponse.getData().items;
      this.refreshListOfUsers(selectType, items);
    }

    function findStudentDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      var items = serviceResponse.getData().items;
      this.refreshListOfUsers(selectType, items);
    }
  };

  form.refreshListOfUsers = function (selectType, items) {
    this.listOfUsers.jqxListBox({
      source: this.buildUsersSource(selectType, items)
    });

    if (['all:students,parents', 'all:students', 'all:parents'].indexOf(selectType) !== -1) {
      this.listOfUsers.jqxListBox('checkAll');
    }
  };

  form.buildUsersSource = function (selectType, items) {
    var sourceData = [];
    this.sourceData = {};

    items = items || [];

    switch (selectType) {
    case 'all:students,parents':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allStudentsAndParents')
      };

      this.sourceData[item.uniqueId] = item;
      sourceData.push(item);

      break;
    case 'all:students':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allStudents')
      };

      this.sourceData[item.uniqueId] = item;
      sourceData.push(item);

      break;
    case 'all:parents':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allParents')
      };

      this.sourceData[item.uniqueId] = item;
      sourceData.push(item);

      break;
    case 'class:students,parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].classId,
          type: selectType,
          text: Lang.get('notification.selectItem.classStudentsAndParents', {
            className: items[i].className
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'class:students':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].classId,
          type: selectType,
          text: Lang.get('notification.selectItem.classStudents', {
            className: items[i].className
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'class:parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].classId,
          type: selectType,
          text: Lang.get('notification.selectItem.classParents', {
            className: items[i].className
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'course:students,parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].courseId,
          type: selectType,
          text: Lang.get('notification.selectItem.courseStudentsAndParents', {
            courseName: items[i].courseName,
            termName: items[i].term.termName
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'course:students':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].courseId,
          type: selectType,
          text: Lang.get('notification.selectItem.courseStudents', {
            courseName: items[i].courseName,
            termName: items[i].term.termName
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'course:parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].courseId,
          type: selectType,
          text: Lang.get('notification.selectItem.courseParents', {
            courseName: items[i].courseName,
            termName: items[i].term.termName
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'specific:students,parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].studentId,
          type: selectType,
          text: Lang.get('notification.selectItem.specificStudentsAndParents', {
            firstName: items[i].firstName,
            lastName: items[i].lastName,
            studentCode: items[i].studentCode,
            className: (items[i].class && items[i].class.className) || Lang.get('notification.selectItem.noClass')
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'specific:students':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].studentId,
          type: selectType,
          text: Lang.get('notification.selectItem.specificStudents', {
            firstName: items[i].firstName,
            lastName: items[i].lastName,
            studentCode: items[i].studentCode,
            className: (items[i].class && items[i].class.className) || Lang.get('notification.selectItem.noClass')
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    case 'specific:parents':
      for (var i = 0, len = items.length; i < len; i++) {
        var item = {
          uniqueId: Util.uniqueId(),
          id: items[i].studentId,
          type: selectType,
          text: Lang.get('notification.selectItem.specificParents', {
            firstName: items[i].firstName,
            lastName: items[i].lastName,
            studentCode: items[i].studentCode,
            className: (items[i].class && items[i].class.className) || Lang.get('notification.selectItem.noClass')
          })
        };

        this.sourceData[item.uniqueId] = item;
        sourceData.push(item);
      }

      break;
    }

    var source = {
      localData: sourceData,
      dataType: 'array',
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  }

  form.submitDialogData = function () {
    var items = this.listOfUsers.jqxListBox('getItems');

    var selectedItems = [];

    for (var i = 0, len = items.length; i < len; i++) {
      if (!items[i].checked) continue;

      var item = this.sourceData[items[i].value];

      var itemId = item.type + '[' + (item.id || '') + ']';

      var selectedItem = {
        id: itemId,
        text: item.label
      }

      selectedItems.push(item);
    }

    this.setFormParam('selectedItems', selectedItems);

    console.log(selectedItems);

    //    this.hideForm();
  };

});
