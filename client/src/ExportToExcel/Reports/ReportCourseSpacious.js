// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import "./ReportTeacherSpacious.css";
import flatten from "flat";

// import flatten from 'flat'


import { pipe, groupBy, prop, map, pluck, sum } from 'ramda';

export default function ReportCourseSpacious(props) {//
    //מקבל את כל הדיווחחים של המורה הזאת לתקופה מסויימת
   // const location = useLocation();
    //const navigate = useNavigate();
    // let { reports, searchFrom: fromDate, searchTo: toDate, year, month, } = location.state
    let { reports, searchFrom: fromDate, searchTo: toDate, year, month, } = props.data



    // const printRef = React.useRef();
    // useEffect(() => {

    //   //  handleDownloadPdf();
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

    //     pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save('print.pdf');
    //     navigate(-1);

    // };

    // var flatten = require('flat')

    let arr = reports.map(item => flatten(item))
    // arr=arr.flat()

    const consolidate = pipe(
        groupBy(prop('courseId._id')),
        map(groupBy(prop('teacherId.tz'))),
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
    const countField = (field, arr, ) => {
        let sum = 0;
        arr.forEach(item => { sum++ });
        return sum;
    }

    let a = consolidate(arr)
    let b = []
    for (let courseId in a) {
        let teachers = []
        for (let teacherTz in a[courseId])
            teachers.push({
                reports: [...a[courseId][teacherTz]],
                totalNumHours: sumByField('numHours', a[courseId][teacherTz]),
                totalFrontalDays: sumByField('numHours', a[courseId][teacherTz].filter(u => u.type == "frontal"))

            })
        b.push({ ...a[courseId][0], teachers: teachers, totalNumOfTeachers: teachers.length, totalNumHours: sumByField('totalNumHours', teachers), totalFrontalDays: sumByField('totalFrontalDays', teachers) })
    }




    return (
        <div className="all">
         {/*    <button type="button" onClick={handleDownloadPdf}>
                Download as PDF
    </button>*/}


            <div className="print-area">
                <h1>דוח שעות הוראה למרצה לפי קורס</h1>
                {fromDate && toDate ? <h2 className="date-desc">לתאריכים {fromDate.$d.toLocaleDateString()}-{toDate.$d.toLocaleDateString()}</h2> :
                    <h2 className="date-desc">לחודש {month}-{year}</h2>}
                <ul>
                    {b.map((item, index) => {
                        return <li key={index}><div className="depth1" >
                            <h1>    <b>{index + 1}</b>. {item.teachers[0].reports[0].courseName}</h1>
                            <table>
                                <tr className="table-header">
                                    <th>#</th>
                                    <th>שם מורה</th>
                                    <th>מספר שעות</th>
                                    <th>מספר ימי נוכחות</th>
                                    <th>מספר שעות פרונטליות</th>
                                </tr>
                                {item.teachers.map((it, ind) => {

                                    return <tr key={ind} className="depth2">
                                        <td>    {ind + 1}</td>
                                        <td>{it.reports[0].teacherName}</td>
                                        <td> {it.totalNumHours}</td>
                                        <td>  {it.totalFrontalDays}</td>
                                        <td>  {it.totalFrontalHours}</td>
                                    </tr>
                                })}
                                <tr className="depth2 total">
                                    <td></td>
                                    <td>סה"כ</td>
                                    <td> {item.totalNumHours}</td>
                                    <td>  {item.totalFrontalDays}</td>
                                    <td>  {item.totalFrontalHours}</td>
                                </tr>
                            </table>  </div></li>
                    })}</ul>
            </div>

        </div >
    );


}