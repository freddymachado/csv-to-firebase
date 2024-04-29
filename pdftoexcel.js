const pdf2excel = require('pdf-to-excel');

try { 
    
    pdf2excel.genXlsx('../resources/cestaticket.pdf', '../resources/cestaticket.xlsx'); 
    pdf2excel.genXlsx('../resources/ticketplus.pdf', '../resources/ticketplus.xlsx'); 
    pdf2excel.genXlsx('../resources/panamcred.pdf', '../resources/panamcred.xlsx'); 
} catch (err) { 
    console.error(err); 
}