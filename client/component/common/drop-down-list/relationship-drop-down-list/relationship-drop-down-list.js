define.component('component.common.RelationshipDropDownList', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var Relationship = require('enum.Relationship');

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var relationshipDropDownList = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'relationshipDropDownList')
      .appendTo(element.parent());

    element.remove();

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var relationshipData = [
      {
        value: Relationship.UNKNOWN,
        text: Lang.get('relationship.unknown'),
      }, {
        value: Relationship.OTHER,
        text: Lang.get('relationship.other'),
      }, {
        value: Relationship.FATHER,
        text: Lang.get('relationship.father'),
      }, {
        value: Relationship.MOTHER,
        text: Lang.get('relationship.mother'),
      }, {
        value: Relationship.GRAND_FATHER,
        text: Lang.get('relationship.grandFather'),
      }, {
        value: Relationship.GRAND_MOTHER,
        text: Lang.get('relationship.grandMother'),
      }, {
        value: Relationship.GODPARENT,
        text: Lang.get('relationship.godParent')
      }
    ];

    var source = {
      localData: relationshipData,

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

    var relationshipDropDownListOptions = {
      source: dataAdapter,
      displayMember: 'text',
      valueMember: 'value',

      width: '100%',
      height: '30px',
      autoDropDownHeight: true
    };

    var trackingChange = {
      relationshipDropDownList: false,
      data: false
    }

    relationshipDropDownListOptions = Util.Object.extend(relationshipDropDownListOptions, componentAttributes);

    relationshipDropDownList.jqxDropDownList(relationshipDropDownListOptions);

    // tracking changes of relationshipDropDownList
    relationshipDropDownList.on('select', function (event) {

      if (trackingChange.data || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      trackingChange.relationshipDropDownList = true;

      componentData.attr(dataAttribute, item.value);

      trackingChange.relationshipDropDownList = false;

    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {

      if (attr == dataAttribute && !trackingChange.relationshipDropDownList) {

        trackingChange.data = true;

        // unselect current selected item
        var selectedItem = relationshipDropDownList.jqxDropDownList('getSelectedItem');
        if (selectedItem) {
          relationshipDropDownList.jqxDropDownList('unselectItem', selectedItem);
        }

        var item = relationshipDropDownList.jqxDropDownList('getItemByValue', newVal);
        relationshipDropDownList.jqxDropDownList('selectItem', item);

        trackingChange.data = false;
      }

    });

  };

});
