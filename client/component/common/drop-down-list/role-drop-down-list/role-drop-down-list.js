define.component('component.common.RoleDropDownList', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var Role = require('enum.Role');

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var roleDropDownList = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'roleDropDownList')
      .appendTo(element.parent());

    var staffOnly = componentAttributes.staffOnly;

    componentAttributes = Util.Object.omit(componentAttributes, ['staffOnly']);

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var roleData = [];

    var adminRoleData = [
      {
        value: Role.ADMINISTRATOR,
        text: Lang.get('role.administrator')
      }
    ];

    var studentRoleData = [
      {
        value: Role.STUDENT,
        text: Lang.get('role.student')
      }, {
        value: Role.PARENT,
        text: Lang.get('role.parent')
      }
    ];

    var staffRoleData = [
      {
        value: Role.EDUCATOR,
        text: Lang.get('role.educator')
      }, {
        value: Role.EXAMINATOR,
        text: Lang.get('role.examinator')
      }, {
        value: Role.NEWS_MANAGER,
        text: Lang.get('role.newsManager')
      }, {
        value: Role.TEACHER,
        text: Lang.get('role.teacher')
      }
    ];

    if (staffOnly) {
      roleData = roleData.concat(staffRoleData);
    } else {
      roleData = roleData
        .concat(adminRoleData)
        .concat(studentRoleData)
        .concat(staffRoleData);
    }

    var source = {
      localData: roleData,

      dataFields: [
        {
          name: 'value',
          typy: 'number'
        },
        {
          name: 'text',
          typy: 'string'
        }
      ]
    }

    var dataAdapter = new jQuery.jqx.dataAdapter(source);

    var roleDropDownListOptions = {
      source: dataAdapter,
      displayMember: 'text',
      valueMember: 'value',

      width: '100%',
      height: '30px',
      autoDropDownHeight: true
    };

    var trackingChange = {
      roleDropDownList: false,
      data: false
    }

    roleDropDownListOptions = Util.Object.extend(roleDropDownListOptions, componentAttributes);

    roleDropDownList.jqxDropDownList(roleDropDownListOptions);

    // tracking changes of roleDropDownList
    roleDropDownList.on('select', function (event) {

      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.roleDropDownList = true;

      componentData.attr(dataAttribute, item.value);

      trackingChange.roleDropDownList = false;

    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.roleDropDownList) {

        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = roleDropDownList.jqxDropDownList('getSelectedItem');
        if (selectedItem) {
          roleDropDownList.jqxDropDownList('unselectItem', selectedItem);
        }

        var item = roleDropDownList.jqxDropDownList('getItemByValue', newVal);
        roleDropDownList.jqxDropDownList('selectItem', item);

        trackingChange.data = false;
      }

    });

  };

});
