define.form('component.dialog.notification.NotifyNews', function (form, require, Util, Lang, jQuery) {

  form.urlMap = {
    url: ':module/:action/:id',
    data: {
      module: 'notification',
      action: 'notify-news'
    }
  };

  form.tmpl = 'dialog.notification.notify-news';

  form.formType = form.FormType.DIALOG;

  form.selectedUsers = {};

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

  form.initData = function (params) {

    var componentSettings = {
      selectType: {
        localDataAttribute: 'selectTypes',
        combobox: {
          valueMember: 'id',
          displayMember: 'text'
        }
      }
    };

    this.newsId = params.id;

    this.data.attr({
      selectTypes: this.getSelectTypes(),

      componentSettings: componentSettings
    });

  };

  form.initDialog = function () {

    this.listOfUsers = this.element.find('#list-users');
    this.listOfSelectedUsers = this.element.find('#list-selected-users');

    this.listOfUsers.jqxListBox({
      source: this.buildUsersSource(),
      width: '100%',
      height: '210px',
      displayMember: 'text',
      valueMember: 'uniqueId',
      checkboxes: true
    });

    this.listOfSelectedUsers.jqxListBox({
      source: this.buildSelectedUsersSource(),
      width: '100%',
      height: '338px',
      displayMember: 'text',
      valueMember: 'itemId',
      checkboxes: true
    });

    this.element.find('#button-add-users').click(this.proxy(this.addUsers));
    this.element.find('#button-remove-users').click(this.proxy(this.removeUsers));

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

  form.refreshListOfSelectedUsers = function () {
    this.listOfSelectedUsers.jqxListBox({
      source: this.buildSelectedUsersSource()
    });
  };

  form.buildUsersSource = function (selectType, items) {
    var sourceData = [];

    items = items || [];

    switch (selectType) {
    case 'all:students,parents':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allStudentsAndParents')
      };

      sourceData.push(item);

      break;
    case 'all:students':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allStudents')
      };

      sourceData.push(item);

      break;
    case 'all:parents':
      var item = {
        uniqueId: Util.uniqueId(),
        type: selectType,
        text: Lang.get('notification.selectType.allParents')
      };

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

        sourceData.push(item);
      }

      break;
    }

    this.users = {};
    for (var i = 0, len = sourceData.length; i < len; i++) {
      this.users[sourceData[i].uniqueId] = sourceData[i];
    }

    var source = {
      localData: sourceData,
      dataType: 'array',
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  }

  form.buildSelectedUsersSource = function () {
    var sourceData = [];

    Util.Collection.each(this.selectedUsers, function (user) {
      var item = {
        itemId: user.id,
        text: user.text
      };

      sourceData.push(item);
    });

    var source = {
      localData: sourceData,
      dataType: 'array',
    };

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    return dataAdapter;
  }

  form.addUsers = function () {
    var items = this.listOfUsers.jqxListBox('getItems');

    for (var i = 0, len = items.length; i < len; i++) {
      if (!items[i].checked) continue;

      var item = this.users[items[i].value];

      var itemId = item.type + '[' + (item.id || '') + ']';

      this.selectedUsers[itemId] = {
        id: itemId,
        text: item.text
      };
    }

    this.refreshListOfSelectedUsers();
  }

  form.removeUsers = function () {
    var items = this.listOfSelectedUsers.jqxListBox('getItems');

    var selectedItemIds = [];

    for (var i = 0, len = items.length; i < len; i++) {
      if (!items[i].checked) continue;

      selectedItemIds.push(items[i].value);
    }

    this.selectedUsers = Util.Object.omit(this.selectedUsers, selectedItemIds);

    this.refreshListOfSelectedUsers();
  }

  form.submitDialogData = function () {
    var selectedUserIds = Util.Object.keys(this.selectedUsers);

    var NotificationProxy = require('proxy.Notification');
    NotificationProxy.notifyNews({
      newsId: this.newsId,
      userIds: selectedUserIds
    }, this.proxy(notifyNewsDone));

    function notifyNewsDone(serviceResponse) {
      if (serviceResponse.hasError()) return;

      this.hideForm();
    }
  };

});
