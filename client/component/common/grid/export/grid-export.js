define('component.export.grid.GridExport', function (module, require) {

  module.exports = {
    exportToExcel: exportToExcel
  };

  function getGridData(grid) {
    grid = grid.element;

    var gridColumns = grid.jqxGrid('columns').records;

    var gridData = {
      fields: [],
      items: []
    }

    for (var i = 1, len = gridColumns.length; i < len; i++) {
      var column = gridColumns[i];

      if (column.hidden) continue;

      gridData.fields.push({
        name: column.datafield,
        text: column.text
      });
    }

    var gridRows = grid.jqxGrid('getdisplayrows');

    var Moment = require('lib.Moment');
    var Gender = require('enum.Gender');
    var Lang = require('core.lang.Lang');

    for (var i = 0, len = gridRows.length; i < len; i++) {
      var row = gridRows[i];

      var item = {};

      for (var j = 0, fieldLen = gridData.fields.length; j < fieldLen; j++) {
        var fieldName = gridData.fields[j].name;
        var fieldValue = row[fieldName];

        // for datetime
        if (['dateOfBirth'].indexOf(fieldName) != -1) {
          fieldValue = Moment(fieldValue).format('DD/MM/YYYY');
        }
        // for gender
        else if (['gender'].indexOf(fieldName) != -1) {
          switch (fieldValue) {
          case Gender.UNKNOWN:
            fieldValue = Lang.get('gender.unknown');
            break;
          case Gender.MALE:
            fieldValue = Lang.get('gender.male');
            break;
          case Gender.FEMALE:
            fieldValue = Lang.get('gender.female');
            break;
          }
        }

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
        row.push({
          value: item[headerFields[j]]
        });
      }

      exportData.push(row);
    }

    sheet.setData(exportData);

    var exportColumns = [];
    for (i = 0; i < headerLen; i++) {
      exportColumns.push({
        width: exportConfig.columns[headerFields[i]].width
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
    var Moment = require('lib.Moment');

    return Moment().format('[' + fileName + '] - YYYY-MM-DD HH[h]mm[m]ss[s][.xlsx]');
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
