/*params = {
    orientation : landscape | portrait,     (default=portrait)
 }
*/

const downloadPDF =  ({ html, file, orientation, style }) => {
    return getBinaryDataForPDF({ html, orientation, style }).then(buffer => {
      return getResponseHeader({ data: buffer, file });
    });
  };
  
  const getBinaryDataForPDF = ({ html, orientation, style }) => {
    return new Promise((resolve, reject) => {
      try {
        orientation = orientation || (style && style.orientation) || "portrait";
        let format = (style && style.format) || "A4";
        let footer = (style && style.footer) || { height: "10mm" };
        let header = (style && style.header) || { height: "10mm" };
  
        var options = {
          orientation,
          format,
          footer,
          header
        };
        var pdf = require("html-pdf");
        pdf.create(html, options).toBuffer(function(err, buffer) {
          if (err) {
            reject(err);
            return;
          }
          resolve(buffer);
        });
      } catch (err) {
        reject(err);
      }
    });
  };
  
  const getResponseHeader = ({ file: fileName, data: binaryData, type = "PDF" }) => {
    const downloadOptions = {
      _download: true
    };
    fileName = fileName || type;
    if (fileName.indexOf(".pdf") < 0) {
      fileName += ".pdf";
    }
    const response = {
      _headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; Filename="${fileName}"`
      },
      _fileName: fileName,
      _data: binaryData,
      ...downloadOptions
    };
    return response;
  };

  module.exports = downloadPDF;
  