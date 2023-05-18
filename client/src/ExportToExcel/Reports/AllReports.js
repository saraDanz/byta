import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AllReports.css";
import { Button } from 'semantic-ui-react';
import { exportToCSV } from "../exportToExcelUtils.js";


export default function AllReports({ props }) {//spacious
    //מקבל את כל הדיווחחים של המורה הזאת לתקופה מסויימת
    const location = useLocation()
    let { reports, searchFrom: fromDate, searchTo: toDate, year, month } = location.state
    const navigate = useNavigate();

    reports.sort((a, b) => {
        if (a.teacherId?.lastName > b.teacherId?.lastName) return 1;
        return -1;

    }
    )
    const printRef = React.useRef();
    const exportToExcel = () => {

        if (reports.length) {
            let rep = reports.map((item, index) => {
                let { tz, teacherName, workerNum, courseName, symbol, numHours, directorName, fromTime, toTime, date, type } = item;
                return {
                    tz, teacherName, workerNum, courseName, symbol, date, fromTime, toTime, numHours, type: type == "distance" ? "למידה מרחוק" : type == "frontal" ? "פרונטלי" : "", directorName

                }
            })

            //לסנן עמודות לא רלוונטיות ולשלוח כפרמטר שמות לעמודות
            exportToCSV(rep, fromDate && toDate ? `סכום שעות  לתאריכים ${fromDate.$d.toLocaleDateString()}-${toDate.$d.toLocaleDateString()}: ` :
                `דווח שעות לחודש -${year}-${month}`,
                [['שם מורה', "תז", "מספר עובד", "שם קורס", "סמל קורס", "תאריך", "משעה", "עד שעה", "מספר שעות", "סוג", "שם רכזת"]])
        }
    }
    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);

        var imgData = canvas.toDataURL('image/png');
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        // -----------


        /*  const element = printRef.current;
          const canvas = await html2canvas(element);
          const data = canvas.toDataURL('image/png');
  
          const pdf = new jsPDF();
          const imgProperties = pdf.getImageProperties(data);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight =
              (imgProperties.height * pdfWidth) / imgProperties.width;
  
          pdf.addImage(data, 'JPEG', 0, 0, pdfWidth, pdfHeight);*/
        doc.save('print.pdf');
        navigate(-1);

    };




    return (
        <div>
            <Button type="button" onClick={handleDownloadPdf}>
                pdf
            </Button> <Button type="button" onClick={exportToExcel}>
                Excel
            </Button>


            <div className="print-area" ref={printRef}>

                <h1>דוח  שעות </h1>
                {fromDate && toDate ? <h2 className="date-desc">לתאריכים {fromDate.$d.toLocaleDateString()}-{toDate.$d.toLocaleDateString()}</h2> :
                    <h2 className="date-desc">לחודש {month}-{year}</h2>}
                <table>

                    <tr>
                        <th>#</th>
                        <th>תז</th>
                        <th>שם</th>
                        <th>מספר עובד</th>
                        <th>שם קורס</th>
                        <th>סמל קורס קורס</th>
                        <th>מספר שעות</th>
                        <th>תאריך</th>
                        <th>משעה</th>
                        <th>עד שעה</th>
                        {/* <th>נסיעות</th> */}
                        <th>סוג</th>
                        <th>שם רכזת</th>

                    </tr>
                    {reports.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.tz}</td>
                            <td>{item.teacherName}</td>

                            <td>{item.workerNum}</td>

                            <td>{item.courseName}</td>
                            <td>{item.symbol}</td>

                            <td>{item.numHours}</td>

                            <td>{item.date ? item.date.toLocaleDateString() : ""}</td>
                            <td>{item.fromTime}</td>
                            <td>{item.toTime}</td>
                            {/* <td>{item.travel ? item.travel : 0}</td> */}
                            <td>{item.type == "distance" ? "למידה מרחוק" : item.type == "frontal" ? "פרונטלי" : ""}</td>
                            <td>{item.directorName}</td>
                        </tr>
                    })}
                </table></div>
        </div>
    );


}