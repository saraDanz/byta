import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Button from '@mui/material/Button';
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportTeacherSpacious.css";
import { exportToCSV } from "../exportToExcelUtils.js";


import flatten from 'flat'


import { pipe, groupBy, prop, map, pluck, sum } from 'ramda';

export default function ReportTeacherSpacious({ props }) {//
    //מקבל את כל הדיווחחים של המורה הזאת לתקופה מסויימת
    const location = useLocation();
    const navigate = useNavigate();
    let { reports, searchFrom: fromDate, searchTo: toDate, year, month, } = location.state


    const printRef = React.useRef();
    // useEffect(() => {

    //      handleDownloadPdf();
    // }, [])

    // const handleDownloadPdf = async () => {

    //     const element = printRef.current;
    //     const canvas = await html2canvas(element);
    //     const data = canvas.toDataURL('image/png');

    //     const pdf = new jsPDF();
    //     const imgProperties = pdf.getImageProperties(data);
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight =
    //         (imgProperties.height * pdfWidth) / imgProperties.width;

    //     pdf.addImage(data, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save('print.pdf');
    //     navigate(-1);

    // };
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


    reports = reports.map(item => flatten(item))
    let arr = reports;
    // arr = arr.map(item => flatten(item))
    // arr=arr.flat()

    const consolidate = pipe(
        groupBy(prop('teacherId.tz')),
        map(groupBy(prop('courseId._id'))),
        // map(map(pluck('numHours'))),
        // map(map(sum))
    )
    const sumByField = (field, arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum += +item[field]
        });
        return sum.toFixed(2);
    }
    const countField = (field, arr,) => {
        let sum = 0;
        arr.forEach(item => { sum++ });
        return sum;
    }

    // let a = consolidate(arr)
    // let b = []
    // for (let teacherTz in a) {
    //     let courses = []
    //     for (let courseId in a[teacherTz])
    //         courses.push({
    //             reports: [...a[teacherTz][courseId]],
    //             totalNumHours: sumByField('numHours', a[teacherTz][courseId]),
    //             totalFrontalDays: a[teacherTz][courseId].filter(u => u.type == "frontal").length,


    //         })
    //     b.push({ ...a[teacherTz][0], courses: courses, totalNumOfCourses: courses.length, totalNumHours: sumByField('totalNumHours', courses), totalFrontalDays: sumByField('totalFrontalDays', courses) })
    // }
    const groupByDateGetGroupsCnt = (dateField, arr,) => {

        let result = arr.reduce((a, c) => (a[c[dateField]] = (a[c[dateField]] || 0) + 1, a), Object.create(null));
        return Math.floor(Object.keys(result).length);

    }
    const exportToExcel = () => {

        if (b.length) {
            let rep = [];
            b.forEach((item, index) => {
                let teacherName = item.courses[0].reports[0].teacherName;
                let tz = item.courses[0].reports[0].tz;
                let workerNum = item.courses[0].reports[0].workerNum;
                item.courses.forEach(it => {
                    const { symbol, courseName, directorName, totalNumHours } = it;
                    rep.push({ teacherName, tz, workerNum, courseName, symbol, totalNumHours, directorName });
                })

            })


            //לסנן עמודות לא רלוונטיות ולשלוח כפרמטר שמות לעמודות
            exportToCSV(rep, fromDate && toDate ? `סכום שעות לקורס לפי מורה לתאריכים ${fromDate.$d.toLocaleDateString()}-${toDate.$d.toLocaleDateString()}: ` :
                `  סכום שעות לקורס לפי מורה -${year}-${month}`,
                [['שם מורה', "תז", "מספר עובד",  "שם קורס", "סמל קורס", "מספר שעות", "שם רכזת"]])
        }
    }

    let a = consolidate(arr)
    let b = []
    for (let teacherTz in a) {
        let courses = []
        for (let courseId in a[teacherTz])
            courses.push({
                symbol: a[teacherTz][courseId][0].symbol,
                courseName: a[teacherTz][courseId][0].courseName,
                directorName: a[teacherTz][courseId][0].directorName,
                reports: [...a[teacherTz][courseId]],
                totalNumHours: sumByField('numHours', a[teacherTz][courseId]),
                totalDays: groupByDateGetGroupsCnt('date', a[teacherTz][courseId]),//.......group by date
               totalFrontalDays: groupByDateGetGroupsCnt('date', a[teacherTz][courseId].filter(u => u.type == "frontal")),///.......group by date
                totalFrontalHours: sumByField('numHours', a[teacherTz][courseId].filter(u => u.type == "frontal")),


            })
        b.push({ ...a[teacherTz][0], courses: courses, totalNumOfCourses: courses.length, totalNumHours: sumByField('totalNumHours', courses), 
        totalFrontalDays: sumByField('totalFrontalDays', courses), 
       totalDays: sumByField('totalDays', courses),
         totalFrontalHours: sumByField('totalFrontalHours', courses)
         })
    }
    b.sort((a, b) => {
        if (a.courses[0].reports[0].teacherName.split(" ").filter(item => item != "")[1] >= b.courses[0].reports[0].teacherName.split(" ").filter(item => item != "")[1])
            return 1;
        return -1;
    });
    return (
        <div className="all">
            <Button onClick={handleDownloadPdf}>
                pdf
            </Button> <Button onClick={exportToExcel}>
                Excel
            </Button>


            <div className="print-area" ref={printRef}>
                <h1>דוח שעות הוראה למרצה לפי קורס</h1>
                {fromDate && toDate ? <h2 className="date-desc">לתאריכים {fromDate.$d.toLocaleDateString()}-{toDate.$d.toLocaleDateString()}</h2> :
                    <h2 className="date-desc">לחודש {month}-{year}</h2>}
                <ul>
                    {b.map((item, index) => {
                        return <li key={index}><div className="depth1" >
                            <h2>
                                <span>   <b>{index + 1}</b>.</span>
                                <span> מורה: {item.courses[0].reports[0].teacherName} </span>


                                <span>  ת.ז:  {item.courses[0].reports[0].tz} </span>


                                <span>    מספר עובד: {item.courses[0].reports[0].workerNum}</span>

                            </h2>
                            <table>
                                <tr className="table-header">
                                    <th>#</th>
                                    <th>שם הקורס</th>
                                    <th>סמל קורס</th>
                                    <th>מספר שעות</th>
                                    {/* <th>מספר ימי נוכחות</th> */}
                                    <th>מספר שעות פרונטליות</th>
                                    <th>שם רכזת</th>
                                </tr>
                                {item.courses.map((it, ind) => {

                                    return <tr key={ind} className="depth2">
                                        <td>    {ind + 1}</td>
                                        <td>{it.reports[0].courseName}</td>
                                        <td>{it.reports[0]["courseId.symbol"]}</td>

                                        <td> {it.totalNumHours}</td>
                                        {/* <td>  {it.totalFrontalDays}</td> */}
                                        <td>  {it.totalFrontalHours}</td>
                                        <td>{it.reports[0]["directorName"]}</td>

                                    </tr>
                                })}
                                <tr className="depth2 total">
                                    <td></td>
                                    <td></td>
                                    <td>סה"כ</td>
                                    <td>  שעות:{item.totalNumHours}</td>
                                    <td> שעות פרונטליות: {item.totalFrontalHours}</td>
                                    <td> ימי נוכחות: {item.totalFrontalDays}</td>

                                </tr>
                            </table>  </div></li>
                    })}</ul>
            </div>

        </div>
    );


}