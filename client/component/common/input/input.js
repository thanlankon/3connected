define.component('component.common.Input', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var dataAttribute = options.dataAttribute;
    var componentAttributes = options.componentAttributes;

    var isPasswordInput = componentAttributes.passwordInput;
    var upperCase = componentAttributes.upperCase;

    componentAttributes = Util.Object.omit(componentAttributes, ['passwordInput', 'upperCase']);

    var input = jQuery('<input />')
      .attr('data-attribute', dataAttribute)
      .attr('data-component-role', 'input')
      .appendTo(element.parent());

    element.remove();

    if (!componentData.attr('componentElements')) componentData.attr('componentElements', {});
    componentData.attr('componentElements.' + dataAttribute, input);

    // update bound attributes
    var boundAttributes = componentData.attr('boundAttributes') || [];
    if (boundAttributes.indexOf(dataAttribute) == -1) {
      boundAttributes.push(dataAttribute);
      componentData.attr({
        boundAttributes: boundAttributes
      });
    }

    var inputOptions = {
      width: '100%',
      height: '30px'
    };

    inputOptions = Util.Object.extend(inputOptions, componentAttributes);

    if (isPasswordInput) {
      input.attr('type', 'password');

      input.jqxInput(inputOptions);
    } else {
      input.jqxInput(inputOptions);
    }

    var trackingChange = {
      input: false,
      data: false
    };

    if (upperCase) {
      input.css('text-transform', 'uppercase');
    }

    // tracking changes of input
    input.on('change', function () {
      if (trackingChange.data) return;

      var val = input.val();

      if (upperCase) {
        val = val.toUpperCase();
      }

      trackingChange.input = true;
      componentData.attr(dataAttribute, val.trim());
      trackingChange.input = false;
    });

    // tracking changes of data
    componentData.bind('change', function (ev, attr, how, newVal, oldVal) {
      if (trackingChange.input) return;

      if (attr == dataAttribute) {
        trackingChange.data = true;
        input.val(newVal);
        trackingChange.data = false;
      }
    });

  };

});
