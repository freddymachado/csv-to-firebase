XLSX = require('xlsx');
var constants = require('./constants');

const d = new Date();
let month = d.getMonth();
const folderName = '../resources/'+constants.MONTHS[month];

//----------begin merdeb convertion
const merdeb = XLSX.readFile('../resources/Detalle_de_cuenta_01050614000614308607.xlsx');

// read the worksheet
const savingsAccount = merdeb.Sheets["Cuenta de Ahorro"];

//depure savingsAccount data
delete_rows(savingsAccount, 0,8);

//convert to csv
XLSX.writeFile(merdeb, folderName+'/merdeb.csv', { bookType: "csv" });

//-----------begin tpago convertion
const tpago = XLSX.readFile('../resources/Detalle_Tpago.xlsx');

// read the worksheet
const tpagoPage = tpago.Sheets["Tpago"];

//depure tpagoPage data
delete_rows(tpagoPage, 0,3);

//convert to csv
XLSX.writeFile(tpago, folderName+'/tpago.csv', { bookType: "csv" });


//---------------begin panamdeb convertion
const panamdeb = XLSX.readFile('../resources/Mercantil Banco, Sistema de Banca por Internet.xlsx');

// read the worksheet
const panamDebAccount = panamdeb.Sheets["Sheet1"];

//depure panamDebAccount data
delete_rows(panamDebAccount, 0,1);

//convert to csv
XLSX.writeFile(panamdeb, folderName+'/panamdeb.csv', { bookType: "csv" });


//---------------begin cestaticket convertion

const cestaticket = XLSX.readFile(folderName+'/cestaticket.xlsx');

depure_bonus(cestaticket, 0);
        
//convert to csv
XLSX.writeFile(cestaticket, folderName+'/cestaticket.csv', { bookType: "csv" });


//----------------begin ticketplus convertion

const ticketplus = XLSX.readFile(folderName+'/ticketplus.xlsx');

depure_bonus(ticketplus, 0);
        
//convert to csv
XLSX.writeFile(ticketplus, folderName+'/ticketplus.csv', { bookType: "csv" });

//----------------begin panamcred convertion

//delete a specific row
function ec(r, c){
    return XLSX.utils.encode_cell({r:r,c:c});
}
function delete_row(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for(var R = row_index; R < variable.e.r; ++R){
        for(var C = variable.s.c; C <= variable.e.c; ++C){
            ws[ec(R,C)] = ws[ec(R+1,C)];
        }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
}
function row_to_column(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R,C+1)] = ws[ec(R+1,C)];
    delete_row(ws, row_index+1);
    console.log('finish row_to_column');
}
function add_header(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R,C+1)] = ws[ec(R+3,C)];
    ws[ec(R,C+2)] = ws[ec(R+7,C+1)]; 
    var cellValue = ws[XLSX.utils.encode_cell({c: C, r: R})] ? ws[XLSX.utils.encode_cell({c: C, r: R})].v : '';
    console.log(ws);
    var cellValue = ws[XLSX.utils.encode_cell({c: C+2, r: R})] ? ws[XLSX.utils.encode_cell({c: C+1, r: R})].v : 'null';
    console.log(cellValue);
       
    console.log('finish add_header');
}
function delete_rows(ws, row_index,final_index){
    for (var i = row_index;i<final_index;i++){
        delete_row(ws, row_index);
    }
}
function move_type(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"]);
    var R = row_index;
    var C = variable.s.c;
  
    // Get cell value with error handling
    var cellValue = ws[XLSX.utils.encode_cell({c: C, r: R})] ? ws[XLSX.utils.encode_cell({c: C, r: R})].v : '';
    console.log(cellValue);
  
    // Check if cell value exists in constants.TRX_TYPE (consider loose equality)
    if (cellValue && cellValue.trim() in constants.TRX_TYPE) {
      if (cellValue.trim() === 'DEBITO') {
        row_to_column(ws, row_index);
        delete_row(ws, row_index);
      } else {
        row_to_column(ws, row_index);
      }
    } else {
      // Handle empty or non-existent cell (optional: log error or delete row)
      console.warn(`Cell(${R}, ${C}) is empty or not found.`);
      // delete_row(ws, row_index); // Optional: Delete row if desired
    }
  }
function move_amount(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R,C+1)] = ws[ec(R+1,C)];
    if(ws[ec(R+1,C+1)]='Bs. -'){
        ws[ec(R,C+2)] = ws[ec(R+1,C+2)];
    }else{
        ws[ec(R,C+2)] = ws[ec(R+1,C+2)];
    }
    delete_row(ws, row_index+1);
    console.log('finish move_amount');
}
function depure_bonus(ws,row_index){     
    // read the worksheet
    const bonus = ws.Sheets["Sheet1"];
    var variable = XLSX.utils.decode_range(bonus["!ref"])
    var R = row_index

    //for(var R = row_index; R < variable.e.r; ++R){
        
        //depure bonus data
        delete_rows(bonus, R,11);
        
        add_header(bonus,R);
        
        //depure bonus header
        delete_rows(bonus,R+1,8);
        
        //move reference
        row_to_column(bonus,R+2);
        
        //move description
        row_to_column(bonus,R+2);
        
        //move type
        move_type(bonus,R+2);
        
        //move status & amount
        move_amount(bonus,R+2);
    //}    
}