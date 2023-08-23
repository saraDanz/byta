import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportInformation.css";
// import { exportToCSV } from "../exportToExcelUtils.js";
// import { exportToCSV } from "../exportToExcelUtils.js";


// import flatten from 'flat'


// import { pipe, groupBy, prop, map, pluck, sum } from 'ramda';
import { Button } from 'semantic-ui-react';

export default function ReportInformation({ props }) {//
    //מקבל את כל הדיווחחים של המורה הזאת לתקופה מסויימת
    const location = useLocation();
    const navigate = useNavigate();
    let { data, title, headers ,fields} = location.state


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
        // -----------


        doc.save(title);
        navigate(-1);

    };






    return (
        <div className="all">
            <Button type="button" onClick={handleDownloadPdf}>
                PDF
            </Button>


            <div className="print-area-information" ref={printRef}>
                <h1>{title}</h1>



                <table>
                    <tr className="table-header">
                        <th>#</th>
                        {headers.map((item, index) => <th key={index}>{item}</th>)}
                    </tr>
                    {data.map((item, index) => {
                        return <tr key={index} className="depth2 ">
                            <td key="0">{index + 1}</td>
                            {fields.map((field, ind) => {return <td key={ind+1}>{item[field]}</td> })}
                        </tr>
                    })}
                </table>  </div>

        </div>


    );


}