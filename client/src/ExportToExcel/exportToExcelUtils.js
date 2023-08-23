import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';



export const exportToCSV = (csvData, fileName, heading, colWidth) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(csvData);
    if (colWidth)
        ws['!cols'] = colWidth;
    const wb = {
        Sheets: { 'data': ws }, SheetNames: ['data'], Workbook: {
            Views: [
                { RTL: true }
            ]
        }
    };
    // let heading = [['FirstName', 'Last Name', 'Email']];
    XLSX.utils.sheet_add_aoa(ws, heading);
    XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A2', skipHeader: true });

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
}