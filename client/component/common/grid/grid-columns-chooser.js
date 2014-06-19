define.component('component.common.GridColumnsChooser', function (component, require, Util, Lang, jQuery) {

  component.initComponent = function (element, options) {

    var componentData = options.componentData;
    var form = componentData.attr('form');

    var grid = options.componentAttributes.grid;

    var gridConfig = form.getGridConfig();

    var columns;
    if (grid) {
      columns = gridConfig[grid].columns;
    } else {
      grid = 'grid';
      columns = gridConfig.columns;
    }
    this.columns = columns;

    var dropDownList = this.dropDownList = jQuery('<div />')
      .attr('data-component-role', 'grid-columns-choooser')
      .data('GridColumnsChooser', this)
      .appendTo(element);

    var sourceData = [];
    for (var i = 0, len = columns.length; i < len; i++) {
      sourceData.push({
        columnName: columns[i].dataField,
        columnText: columns[i].text
      });
    }

    var source = {
      localData: sourceData,
      id: 'columnName',
      dataType: 'json',
      dataFields: [{
        name: 'columnName'
      }, {
        name: 'columnText'
      }]
    };

    var dataAdaper = new jQuery.jqx.dataAdapter(source);

    var dropDownListOptions = {
      source: dataAdaper,
      displayMember: 'columnText',
      valueMember: 'columnName',
      checkboxes: true,

      width: '150px',
      height: '22px',
      enableBrowserBoundsDetection: true
    };

    //    if (sourceData.length > 2) {
    //      dropDownListOptions.dropDownHeight = '200px';
    //    } else {
    //      dropDownListOptions.autoDropDownHeight = true;
    //    }

    dropDownListOptions.autoDropDownHeight = true;

    dropDownList.jqxDropDownList(dropDownListOptions);

    // tracking changes of dropdownlist
    dropDownList.on('checkChange', function (event) {
      if (!form[grid] || !event || !event.args || !event.args.item) return;

      var item = event.args.item;

      if (item.checked) {
        form[grid].showColumn(item.value);
      } else {
        form[grid].hideColumn(item.value);
      }
    });

  };

  component.updateSelectedColumns = function () {
    for (var i = 0, len = this.columns.length; i < len; i++) {
      if (!this.columns[i].hidden) {
        this.dropDownList.jqxDropDownList('checkIndex', i);
      }
    }
  }

});
