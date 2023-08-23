import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportTeacherSpacious.css";
import { exportToCSV } from "../exportToExcelUtils.js";
import flatten from 'flat'
import { pipe, groupBy, prop, map } from 'ramda';
import { Button } from 'semantic-ui-react';


export default function ReportTeacherSum({ props }) {//
    //מקבל את כל הדיווחחים של המורה הזאת לתקופה מסויימת
    const location = useLocation();
    const navigate = useNavigate();
    let { reports, searchFrom: fromDate, searchTo: toDate, year, month, } = location.state


    const printRef = React.useRef();
    useEffect(() => {

        // handleDownloadPdf();
    }, [])

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);

        var imgData = canvas.toDataURL("image/jpeg", 0.9);
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
    )
    const sumByField = (field, arr) => {
        let sum = 0;
        arr.forEach(item => {
            sum += +item[field]
        });
        return sum.toFixed(2);
    }
    const countField = (field, arr, ) => {
        let sum = 0;
        arr.forEach(item => { sum++ });
        return sum;
    }
    const groupByDateGetGroupsCnt = (dateField, arr, ) => {

        let result = arr.reduce((a, c) => (a[c[dateField]] = (a[c[dateField]] || 0) + 1, a), Object.create(null));
        return Math.floor(Object.keys(result).length);

    }
    let a = consolidate(arr)
    let b = []
    for (let teacherTz in a) {
        let courses = []
        for (let courseId in a[teacherTz])
            courses.push({
                reports: [...a[teacherTz][courseId]],
                totalNumHours: sumByField('numHours', a[teacherTz][courseId]),
                totalDays: groupByDateGetGroupsCnt('date', a[teacherTz][courseId]),//.......group by date
                totalFrontalDays: groupByDateGetGroupsCnt('date', a[teacherTz][courseId].filter(u => u.type == "פרונטלי")),///.......group by date


            })
        b.push({ ...a[teacherTz][0], courses: courses, totalNumOfCourses: courses.length, totalNumHours: sumByField('totalNumHours', courses), totalFrontalDays: sumByField('totalFrontalDays', courses), totalDays: sumByField('totalDays', courses) })
    }
    b.sort((a, b) => {
        if (a.courses[0].reports[0].teacherName.split(" ").filter(item => item != "")[0] >= b.courses[0].reports[0].teacherName.split(" ").filter(item => item != "")[0])
            return 1;
        return -1;
    });
    const exportToExcel = () => {

        if (b.length) {
            let rep = b.map(item => {
                let teacherName = item.courses[0].reports[0].teacherName;
                let tz = item.courses[0].reports[0].tz;
                let workerNum = item.courses[0].reports[0].workerNum;
                let totalFrontalDays = item.totalFrontalDays;
                let totalDays = item.totalDays;
                let totalHours = item.totalNumHours;
                let numCourses = item.courses.length;
                return {
                    teacherName, tz, workerNum, totalHours, totalDays, totalFrontalDays, numCourses

                }
            })

            //לסנן עמודות לא רלוונטיות ולשלוח כפרמטר שמות לעמודות
            exportToCSV(rep, fromDate && toDate ? `סכום שעות למורה לתאריכים ${fromDate.$d.toLocaleDateString()}-${toDate.$d.toLocaleDateString()}: ` : `סכום שעות למורה -${year}-${month}`, [['שם מורה', "תז", "מספר עובד", "מספר שעות", "מספר ימי נוכחות", "מספר ימים פרונטליים", "מספר קורסים בהם לימדה"]],
                [
                    { wch: 15 },
                    { wch: 15 }

                ])

        }
    }

    return (
        <div className="all">
            <Button type="button" onClick={handleDownloadPdf}>
                pdf
            </Button> <Button type="button" onClick={exportToExcel}>
                Excel
            </Button>


            <div className="print-area" ref={printRef}>
                <h1>דוח סיכום שעות לפי מורה</h1>
                {fromDate && toDate ? <h2 className="date-desc">לתאריכים {fromDate.$d.toLocaleDateString()}-{toDate.$d.toLocaleDateString()}</h2> :
                    <h2 className="date-desc">לחודש {month}-{year}</h2>}


                {/* <h1>
                                <b>{index + 1}</b>.
                                {item.courses[0].reports[0].teacherName}
                                {item.courses[0].reports[0].tz}
                                {item.courses[0].reports[0].workerNum}

                            </h1> */}
                <table>
                    <tr className="table-header">
                        <th>#</th>
                        <th>שם מורה</th>
                        <th>מספר זהות</th>
                        <th>מספר עובד</th>
                        <th>מספר שעות</th>
                        <th>מספר ימי נוכחות</th>
                        {/*<th>מספר ימים פרונטליים</th>*/}
                        <th>מספר קורסים בהם לימדה</th>
                    </tr>
                    {b.map((item, index) => {
                        return <tr key={index} className="depth2 ">
                            <td>{index + 1}</td>
                            <td>   {item.courses[0].reports[0].teacherName}</td>
                            <td>   {item.courses[0].reports[0].tz}     </td>
                            <td>   {item.courses[0].reports[0].workerNum}</td>                                     <td> {item.totalNumHours}</td>
                            <td>  {Number(item.totalDays).toFixed(0)}</td>
                            {/*  <td>  {Number(item.totalFrontalDays).toFixed(0)}</td>*/}
                            <td>  {item.courses.length}</td>
                        </tr>
                    })}
                </table>
            </div>

        </div>


    );


}