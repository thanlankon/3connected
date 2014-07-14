define.component('component.common.Checkbox', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var isPasswordInput = componentAttributes.passwordInput;

    componentAttributes = Util.Object.omit(componentAttributes, ['passwordInput']);

    var checkbox = jQuery('<div />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'checkbox')
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

    var trackingChange = {
      checkbox: false,
      data: false
    };

    var checkboxOptions = {
      width: '13px',
      height: '13px',
      hasThreeStates: false,
      checked: componentData.attr(dataAttribute) || false
    };

    checkboxOptions = Util.Object.extend(checkboxOptions, componentAttributes);

    console.log(checkboxOptions);

    checkbox.jqxCheckBox(checkboxOptions);

    // tracking changes of input
    checkbox.on('change', function (event) {
      if (trackingChange.data || !event || !event.args) return;

      var checked = event.args.checked;

      trackingChange.checkbox = true;
      componentData.attr(dataAttribute, checked);
      trackingChange.checkbox = false;
    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {
      if (attr == dataAttribute && !trackingChange.checkbox) {

        trackingChange.checkbox = true;
        checkbox.jqxCheckBox({
          checked: newVal
        });
        trackingChange.checkbox = false;
      }
    });

  };

});
