define('component.export.grid.GridExport', function (module, require) {

  module.exports = {
    exportToExcel: exportToExcel
  };

  function getGridData(grid) {
    var jQuery = require('lib.jQuery');
    var Underscore = require('lib.Underscore');

    var trimmer = jQuery('<div />');

    var originalGridColumns = grid.gridColumns;

    grid = grid.element;

    var startIndex = grid.jqxGrid('selectionmode') === 'checkbox' ? 1 : 0;

    var gridColumns = grid.jqxGrid('columns').records;

    var gridData = {
      fields: [],
      items: []
    };

    for (var i = startIndex, len = gridColumns.length; i < len; i++) {
      var column = gridColumns[i];

      if (column.hidden) continue;

      var columnConfig = Underscore.findWhere(originalGridColumns, {
        dataField: column.datafield
      });

      var renderer = columnConfig && columnConfig.originalRenderer ? columnConfig.originalRenderer : undefined;

      gridData.fields.push({
        name: column.datafield,
        text: column.text,
        renderer: renderer
      });
    }

    var gridRows = grid.jqxGrid('getdisplayrows');

    var ConvertUtil = require('core.util.ConvertUtil');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      if (!row) continue;

      var item = {};

      for (var j = 0, fieldLen = gridData.fields.length; j < fieldLen; j++) {
        var fieldName = gridData.fields[j].name;
        var renderer = gridData.fields[j].renderer;
        var fieldValue = row[fieldName];

        console.log(renderer, fieldName, fieldValue);

        // for datetime
        if (['dateOfBirth'].indexOf(fieldName) != -1) {
          // fieldValue = ConvertUtil.DateTime.formatDate(fieldValue);
          fieldValue = fieldValue;
        }
        // for gender
        else if (['gender'].indexOf(fieldName) != -1) {
          fieldValue = ConvertUtil.Gender.toString(fieldValue);
        }
        // for column has custom renderer
        else if (renderer) {
          fieldValue = renderer(row, fieldName, fieldValue);
        }

        if (fieldValue == null || fieldValue == undefined) {
          fieldValue = '';
        } else {
          fieldValue = '' + fieldValue;
        }

        // trim html
        fieldValue = trimmer.html(fieldValue).text();

        item[fieldName] = fieldValue;
      }

      gridData.items.push(item);
    }

    return gridData;
  }

  function exportToExcel(grid, exportConfig) {
    var ExcelBuilder = require('lib.ExcelBuilder');
    var Util = require('core.util.Util');

    var gridData = getGridData(grid);

    var workBook = ExcelBuilder.createWorkbook();

    var sheet = workBook.createWorksheet({
      name: exportConfig.sheetName
    });

    var styleSheet = workBook.getStyleSheet();

    // header style
    var styleHeader = styleSheet.createFormat({
      font: {
        bold: true,
        color: '2b579a'
      }
    });

    var header = [];
    var headerFields = [];

    for (var i = 0, len = gridData.fields.length; i < len; i++) {
      var columnConfig = exportConfig.columns[gridData.fields[i].name];

      if (!columnConfig || columnConfig.skip) continue;

      header.push({
        value: gridData.fields[i].text,
        metadata: {
          style: styleHeader.id
        }
      });

      headerFields.push(gridData.fields[i].name);
    };

    var exportData = [header];

    var headerLen = headerFields.length;

    for (i = 0, len = gridData.items.length; i < len; i++) {
      var item = gridData.items[i];
      var row = [];

      for (j = 0; j < headerLen; j++) {
        var columnConfig = exportConfig.columns[headerFields[j]];

        if (!columnConfig || columnConfig.skip) continue;

        row.push({
          value: item[headerFields[j]]
        });
      }

      exportData.push(row);
    }

    sheet.setData(exportData);

    var exportColumns = [];
    for (i = 0; i < headerLen; i++) {
      var columnConfig = exportConfig.columns[headerFields[i]];

      if (!columnConfig || columnConfig.skip) continue;

      exportColumns.push({
        width: columnConfig.width
      });
    }

    sheet.setColumns(exportColumns);

    workBook.addWorksheet(sheet);

    var workBookData = ExcelBuilder.createFile(workBook);

    exportToExcelFile(workBookData, exportConfig);
  }

  function exportToExcelFile(data, exportConfig) {

    var FileSaver = require('lib.FileSaver');

    var mimeXlsx = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    var blob = base64toBlob(data, mimeXlsx);

    FileSaver.saveAs(blob, getFileName(exportConfig.fileName));
  }

  function getFileName(fileName) {
    var ConvertUtil = require('core.util.ConvertUtil');

    return ConvertUtil.Export.getExportFileName(fileName);
  }

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';

    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, {
      type: contentType
    });
  }

});
