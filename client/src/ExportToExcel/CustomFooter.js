import{TablePagination}from "@mui/material";
const CustomFooter=() =>{
   // const { state, apiRef, options } = useGridSlotComponentProps();
    return (
        <TablePagination
        //    count={state.pagination.rowCount}
        //    page={state.pagination.page}
         //   onPageChange={(event, value) => apiRef.current.setPage(value)}
           // rowsPerPage={options.pageSize}
            rowsPerPageOptions={[]}
        />
    );
}
export default CustomFooter;