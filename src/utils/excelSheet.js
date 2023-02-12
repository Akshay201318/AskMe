


const resolveJsonLabel = (key, value, newLabel) => {
    for (var v in value) {
      if (v != "_id") {
        const newKey = `${key}-${v}`;
        const newValue = `${key}.${v}`;
        newLabel[newKey] = newValue;
      }
    }
    return newLabel;
  };

const resolveLabel = label => {
    let newLabel = {};
    for (var l in label) {
      const value = label[l];
      if (isJSONObject(value)) {
        resolveJsonLabel(l, value, newLabel);
      } else {
        newLabel[l] = label[l];
      }
    }
    return newLabel;
  };

  const getFormattedHeader = fields => {
    var headers = [];
    for (var key in fields) {
      headers.push(key);
    }
    return headers;
  };

  const getFormattedData = (data, label, timezoneOffset) => {
    let formattedData = {};
    for (let l in label) {
      const value = label[l];
      const key = value == 1 ? l : value;
      let resolvedValue = resolveValue(data, key);
      if (Array.isArray(resolvedValue) && resolvedValue.length) {
        resolvedValue = resolvedValue[0]; // if array then give only first value,
      }
      if (resolvedValue) {
        if (timezoneOffset && resolvedValue instanceof Date) {
          let valueMoment = moment(resolvedValue);
          let serverTimezoneOffset = valueMoment.utcOffset();
          let timezoneOffsetDiff = -Number(timezoneOffset) - serverTimezoneOffset;
          valueMoment.utcOffset(serverTimezoneOffset - timezoneOffsetDiff, true);
          resolvedValue = valueMoment.toDate();
        }
        formattedData[key] = resolvedValue;
      } else {
        formattedData[key] = null;
      }
    }
    return reFormatValuesToArray(formattedData);
  };
  
  const reFormatValuesToArray = data => {
    const reFormattedValues = [];
    for (const d in data) {
      reFormattedValues.push(data[d]);
    }
    return reFormattedValues;
  };

  const downloadFromExcelJs = ({ sheets, file, headerStyle }) => {
    let Excel = require("exceljs");
    let workbook = new Excel.Workbook();
  
    let workSheet = workbook.addWorksheet("workSheet");
    workSheet.addRows(sheets);
    if (headerStyle) {
      addColumnFormatting(headerStyle, workSheet);
    }
    addCellFormatting(sheets, workSheet);
    return workbook.xlsx.writeBuffer().then(result => {
      return getResponseHeader({ data: result, file });
    });
  };
  
  const downloadFromNodeXlsx = ({ sheets, file, headerStyle, options = {} }) => {
    var xlsx = require("../../node-xlsx-0.4.0/index");
  
    let { formattingRequired } = options;
    if (formattingRequired && headerStyle) {
      addColumnFormattingForNodeXlsx(headerStyle, sheets);
    }
    var buffer = xlsx.build({
      worksheets: [
        {
          name: "workSheet",
          data: sheets
        }
      ]
    });
  
    return getResponseHeader({ file, data: buffer });
  };
  
  const getResponseHeader = ({ file: fileName, type = "Excel", data: binaryData }) => {
    const downloadOptions = {
      _download: true
    };
    fileName = fileName || type;
    if (fileName.indexOf(".") < 0) {
      fileName += ".xlsx";
    }
    const response = {
      _headers: {
        "Content-Type": "application/vnd.openxmlformats",
        "Content-Disposition": `attachment; Filename="${fileName}"`
      },
      _fileName: fileName,
      _data: binaryData,
      ...downloadOptions
    };
    return response;
  };
  
  const addCellFormatting = (data, worksheet) => {
    data.forEach((row, rowIndex) => {
      const worksheetRow = worksheet.getRow(rowIndex + 1);
      row.forEach((cell, colIndex) => {
        if (cell && isJSONObject(cell)) {
          const worksheetCell = worksheetRow.getCell(colIndex + 1);
          modifyWorksheet(worksheetCell, cell, worksheet);
        } else {
          worksheetRow.getCell(colIndex + 1).value = cell;
        }
      });
    });
  };
  
  const modifyWorksheet = (worksheetData, originalData, worksheet) => {
    for (let key in originalData) {
      if (key === "bold") {
        worksheetData.font = { bold: true };
      } else if (key === "fontColor") {
        worksheetData.font = worksheetData.font || {};
        worksheetData.font.color = { argb: originalData.fontColor };
      } else if (key === "alignment") {
        worksheetData.alignment = originalData.alignment;
      } else if (key === "mergeCells") {
        worksheet.mergeCells(originalData.mergeCells);
      } else if (key === "numFmt") {
        worksheetData.numFmt = originalData.numFmt;
      } else if (key === "font") {
        worksheetData.font = originalData.font;
      }
    }
    worksheetData.value = originalData.value;
  };
  
  const addColumnFormatting = (headerStyle, workSheet) => {
    for (let style of headerStyle) {
      for (let key in style) {
        if (key === "width") {
          workSheet.getColumn(style.colNumber).width = style[key];
        } else if (key === "font") {
          workSheet.getColumn(style.colNumber).font = style[key];
        }
      }
    }
  };
  
  const addColumnFormattingForNodeXlsx = (headerStyle, sheets) => {
    for (let style of headerStyle) {
      for (let key in style) {
        if (key === "formatCode" || key === "bold") {
          let colNumber = style.colNumber;
          for (let i = 0; i < sheets.length; i++) {
            let value = sheets[i][colNumber - 1];
            let isJSON = !(value instanceof Date) && typeof value === "object";
            sheets[i][colNumber - 1] = isJSON ? { [key]: style[key], ...value } : { [key]: style[key], value: value };
          }
        }
      }
    }
  };
  
  export const getColumnMappingFromFieldInfo = ({ model, query, column: columns }) => {
    const { _fieldInfo: fieldInfo } = model;
    // console.log("!!!!!!!columns>>>>>>", columns, fieldInfo)
    if (columns) {
      return getMapping(columns, fieldInfo);
    } else {
      // get fields from query
      let { _fields: columns } = query;
      return getMapping(columns, fieldInfo, true);
    }
  };
  
  //create mapping for export excel as per fieldInfo
  const getMapping = (columns, fieldInfo, isQueryFields) => {
    const mapping = {};
    for (const key in columns) {
      if (key === "_id" && isQueryFields) {
        continue;
      }
      const value = columns[key];
      if (typeof value === "string") {
        mapping[key] = value;
      } else if (fieldInfo && fieldInfo.hasOwnProperty(key)) {
        // if key is present in fieldInfo
        const label = fieldInfo[key].label || key;
        mapping[label] = key;
        let displayField = fieldInfo[key].display;
        if (displayField) {
          //if displayField present in fieldInfo, then create dotted field from that
          //only first value of json will be considered
          for (const k in displayField) {
            if (k !== "_id") {
              mapping[label] = `${key}.${k}`;
              break;
            }
          }
        }
      } else {
        if (isJSONObject(value)) {
          for (const k in value) {
            if (k !== "_id") {
              mapping[k] = key;
              break;
            }
          }
        } else {
          //if display field in not present, then fieldInfo key will be considered
          mapping[key] = key;
        }
      }
    }
    return mapping;
  };

  const getWorkSheetToExport = ({ data, label, file, headerStyle, options = {} }) => {
    let { timezoneOffset } = options;
    var sheets = [];
    const header = getFormattedHeader(label);
    sheets.push(header);
    if (Array.isArray(data)) {
      data.forEach(d => {
        const rowData = getFormattedData(d, label, timezoneOffset);
        sheets.push(rowData);
      });
    } else {
      const rowData = getFormattedData(data, label, timezoneOffset);
      sheets.push(rowData);
    }
    return downloadExcel({ sheets, file, headerStyle, options: { formattingRequired: true, ...options } });
  };

export const ExcelSheet = ({ data, column, file, headerStyle, options }) => {
    if (!data) {
      return;
    }
    let label = resolveLabel(column);
    return await getWorkSheetToExport({ data, label, file, headerStyle, options });
  };