import * as XLSX from 'xlsx';

class Sheet {
  constructor() {}

  toMaskXLSX(workSheet: XLSX.WorkSheet, columns: Array<number|string> , format: string): XLSX.WorkSheet {
    columns.forEach(column => {
      if ( typeof column === 'string' ) {
        column = XLSX.utils.decode_col(column); // decode_col converts Excel col name to an integer for col #
      }

      /* get worksheet range */
      const range = XLSX.utils.decode_range(workSheet['!ref']);
      for (let row = range.s.r + 1; row <= range.e.r; ++row) {
        /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
        const ref = XLSX.utils.encode_cell({r: row, c: column});
        /* if the particular row did not contain data for the column, the cell will not be generated */
        if (!workSheet[ref]) { continue; }
        /* assign the `.t` type: b Boolean, n Number, e error, s String, d Date*/
        // workSheet[ref].t = 'd';
        /* `.t == "n"` for number cells */
        if (workSheet[ref].t !== 'n') { continue; }
        /* assign the `.z` number format */
        workSheet[ref].z = format;
      }
    });
    return workSheet;
  }
}

const sheet = new Sheet();

export { sheet };
