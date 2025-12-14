module.exports = Object.freeze({
    MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    TRX_TYPE: ['COMPRA', 'RECARGA', 'REVERSO', 'DEBITO', 'DEBITO AJUSTE'],
    ANOTHER_CONSTANT: 'another value'
});



function ec(r, c) {
    return XLSX.utils.encode_cell({ r: r, c: c });
}
function delete_row(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for (var R = row_index; R < variable.e.r; ++R) {
        for (var C = variable.s.c; C <= variable.e.c; ++C) {
            ws[ec(R, C)] = ws[ec(R + 1, C)];
        }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
}
function row_to_column(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R, C + 1)] = ws[ec(R + 1, C)];
    delete_row(ws, row_index + 1);
    console.log('finish row_to_column');
}
function add_header(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R, C + 1)] = 'Transacción';
    ws[ec(R, C + 2)] = 'Afiliado';
    ws[ec(R, C + 3)] = 'Movimiento';
    ws[ec(R, C + 4)] = 'Tipo';
    ws[ec(R, C + 5)] = 'Monto';
    console.log('finish add_header');
}
function delete_rows(ws, row_index, final_index) {
    for (var i = row_index; i < final_index; i++) {
        delete_row(ws, row_index);
    }
}
function move_type(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"]);
    var R = row_index;
    var C = variable.s.c;

    // Get cell value with error handling
    var cellValue = ws[XLSX.utils.encode_cell({ c: C, r: R })] ? ws[XLSX.utils.encode_cell({ c: C, r: R })].v : '';
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
function move_amount(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R, C + 1)] = ws[ec(R + 1, C)];
    if (ws[ec(R + 1, C + 1)] = 'Bs. -') {
        ws[ec(R, C + 2)] = ws[ec(R + 1, C + 2)];
    } else {
        ws[ec(R, C + 2)] = ws[ec(R + 1, C + 2)];
    }
    delete_row(ws, row_index + 1);
    console.log('finish move_amount');
}
function depure_bonus(ws, row_index) {
    // read the worksheet
    const bonus = ws.Sheets["Sheet1"];
    var variable = XLSX.utils.decode_range(bonus["!ref"])


    for (var R = row_index; R < variable.e.r; ++R) {

        //depure bonus data
        delete_rows(bonus, R, 11);

        add_header(bonus, R);

        //depure bonus header
        delete_rows(bonus, R + 1, 7);

        //move reference
        row_to_column(bonus, R + 2);

        //move description
        row_to_column(bonus, R + 2);

        //move type
        //move_type(bonus,R+2);

        //move status & amount
        move_amount(bonus, R + 2);
    }
}