import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

export default function PrintFormat({ data, columns }) {
    return (
        <TableContainer component={Paper} className='print-tbl'>
            <Table sx={{}} aria-label="simple table">
                <TableHead>
                    <TableRow>


                        {columns.map((item, index) => { <TableCell key={index} align="right">{item}&nbsp;</TableCell> })}

                    </TableRow>
                </TableHead>
                <TableBody>
                  
                </TableBody>
            </Table>
        </TableContainer>
    );
}