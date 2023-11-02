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
        if (a.teacherId ?.lastName > b.teacherId ?.lastName) return 1;
        return -1;

    }
    )
    const printRef = React.useRef();
    const exportToExcel = () => {

        if (reports.length) {
            let rep = reports.map((item, index) => {
                let { tz, teacherName, workerNum, courseName, symbol, numHours, directorName, fromTime, toTime, date, type,comment } = item;
                return {
                    tz, teacherName, workerNum, courseName, symbol, date, fromTime, toTime, numHours, type, directorName,comment

                }
            })

            //לסנן עמודות לא רלוונטיות ולשלוח כפרמטר שמות לעמודות
            exportToCSV(rep, fromDate && toDate ? `סכום שעות  לתאריכים ${fromDate.$d.toLocaleDateString()}-${toDate.$d.toLocaleDateString()}: ` :
                `דווח שעות לחודש -${year}-${month}`,
                [['תז', "שם מורה", "מספר עובד", "שם קורס", "סמל קורס", "תאריך", "משעה", "עד שעה", "שעות", "סוג", "שם רכזת","הערות"]],
                 [
                    { wch: 9},
                    { wch: 17 },
                    { wch: 8 },
                    { wch: 20 },
                    { wch: 8 },
                    { wch: 10 },
                    { wch: 7 },
                    { wch: 7 },
                    { wch: 6 },
                    { wch: 10 },
                    { wch: 15 },
                    { wch: 15 },
                ]
            )
        }
    }
    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);

        var imgData = canvas.toDataURL("image/jpeg", 0.3);
        var imgWidth = 210;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jsPDF('p', 'mm');
        var position = 0;

        doc.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'jpeg', 0, position, imgWidth, imgHeight, undefined, "FAST");
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
                        <th>סמל קורס </th>
                        <th>שעות</th>
                        <th>תאריך</th>
                        <th>משעה</th>
                        <th>עד שעה</th>
                        {/* <th>נסיעות</th> */}
                        <th>סוג</th>
                        <th>שם רכזת</th>
                        <th>הערות</th>

                    </tr>
                    {reports.map((item, index) => {
                        return <tr key={index}>
                            <td className="flex1">{index + 1}</td>
                            <td className="flex4">{item.tz}</td>
                            <td className="flex5">{item.teacherName}</td>

                            <td className="flex3">{item.workerNum}</td>

                            <td className="flex5">{item.courseName}</td>
                            <td className="flex2">{item.symbol}</td>

                            <td className="flex2">{item.numHours}</td>

                            <td className="flex4">{item.date ? item.date.toLocaleDateString() : ""}</td>
                            <td className="flex2">{item.fromTime}</td>
                            <td className="flex2">{item.toTime}</td>
                            {/* <td>{item.travel ? item.travel : 0}</td> */}
                            <td className="flex4">{ item.type}</td>
                            <td className="flex5">{item.directorName}</td>
                            <td className="flex5">{item.comment}</td>
                        </tr>
                    })}
                </table></div>
        </div>
    );


}