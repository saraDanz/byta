import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter } from 'semantic-ui-react';

// function createData(name, calories, fat, carbs, protein) {
//     return { name, calories, fat, carbs, protein };
// }

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const ss = React.forwardRef((props, ref) => {
    return (<div ref={ref}>My cool content here!</div>
    );
});
const PrintFormat = React.forwardRef((props, ref) => {
    return (
        <>

            <TableContainer component={Paper} ref={ref} className="print-tbl" >
                <Table sx={{ textAlign: "right" }} aria-label="simple table">
                    <TableHead>
                        <TableRow>

                            <TableCell> </TableCell>
                            {props.columns.map((item, index) => { return <TableCell key={index} align="right">{item.headerName}&nbsp;</TableCell> })}

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((row, ind) => {
                            return <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{(ind + 1)}</TableCell> {
                                    props.columns.map((col, index) => 
                                                      {if(typeof (row[col.field]) != "object" ||!row[col.field])return <TableCell key={index}>{row[col.field]}</TableCell> else 
                                                       return <TableCell key={index}>{row[col.field].toLocaleDateString()}</TableCell>})
                                }


                            </TableRow>
                        })}
                    </TableBody>
                    <TableFooter>
                        <div id="pageFooter">Page </div>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>);
});
export default PrintFormat;
