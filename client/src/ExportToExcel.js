import React, { useState } from "react";
import "./ExportToExcel.css";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from "axios";
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

import { BASE_URL } from "./VARIABLES";
import { getCurrentViewMonthAndYear } from "./Utils";
export default function ExportToExcel() {
    let d = getCurrentViewMonthAndYear();
    let [year, setYear] = useState(d.year);
    let [month, setMonth] = useState(d.month);


    const getData = () => {
        // let year = 2022;
        // let month = 4;
        axios.get(`${BASE_URL}reports/byYearAndMonth/${year}/${month}`).then(res => {
            console.log(res);
            try {
                let reports = res.data.map(item => {
                    let { courseId, teacherId, fromTime, toTime, date, reportDate, ...x } = item;
                    fromTime = new Date(fromTime);
                    toTime = new Date(toTime);
                    date=new Date(date)
                    return {
                        ...x, teacherFirstName: teacherId.firstName,
                        teacherlastName: teacherId.lastName,
                        courseName: courseId.name,
                        directorFirstName: courseId.directorId.firstName,
                        directorLastName: courseId.directorId.lastName,
                        fromTime: fromTime && (fromTime.getHours() + ":" + fromTime.getMinutes()) || "00:00",
                        toTime: toTime && (toTime.getHours() + ":" + toTime.getMinutes()) || "00:00",
                        date: date.toLocaleDateString()
                    }
                });
                exportToCSV(reports, `report-${year}-${month}`)
            }
            catch (er) {
                console.log(er)
                alert("שגיאה בשמירת הקובץ")
            }

        }).catch(err => {
            console.log(err);
            alert("שגיאה בקבלת הדווחים לחודש זה")
        })
    }


    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    let da = new Date().getFullYear();
    return <div className="excel">
        <form>

            <label>שנה</label>
            <select onChange={(e) => { setYear(e.target.value) }}>
                {[...Array(20)].map((item, index) => { return <option key={index}>{index + da - 19}</option> })}
            </select>
            <label>חודש</label>

            <select onChange={(e) => { setMonth(e.target.value) }}>
                {[...Array(12)].map((item, index) => { return <option key={index}>{index + 1}</option> })}
            </select>
            <button type="button" onClick={getData}>
                הורדה לקובץ אקסל
      </button>

        </form>
    </div>;
}