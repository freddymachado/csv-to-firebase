const pdf2excel = require('pdf-to-excel');
const fs = require('node:fs');
var constants = require('./constants');
//get month
const d = new Date();
let month = d.getMonth();
const folderName = '../resources/'+constants.MONTHS[month];

//convert xls to pdf
try { 
    //if folder does not exist
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    //if it exists, save xls files there
    //TODO:rename pdf files with expected from servers
    //TODO:after finish database update, move this files to its folder
    pdf2excel.genXlsx('../resources/cestaticket.pdf', folderName+'/cestaticket.xlsx'); 
    pdf2excel.genXlsx('../resources/ticketplus.pdf', folderName+'/ticketplus.xlsx'); 
    pdf2excel.genXlsx('../resources/panamcred.pdf', folderName+'/panamcred.xlsx'); 
} catch (err) { 
    console.error(err); 
}