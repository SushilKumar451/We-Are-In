// import React, { useState } from "react";
// import BTable from "react-bootstrap/Table";
// import {
//     useTable,
//     useGlobalFilter,
//     usePagination,
//     useRowSelect,
//     useAsyncDebounce
// } from "react-table";
// import TextInput from "../form-group/textinput";
// import ComboInput from "../form-group/comboinput";
// import Button from "../form-group/button";

// const TableSearch = ({ globalFilter, setGlobalFilter }) =>
// {
//     const [ value, setValue ] = useState(globalFilter);
//     const onChange = useAsyncDebounce(
//         value =>
//         {
//             setGlobalFilter(value || undefined);
//         },
//         200
//     );

//     return (
//         <section>
//             <div className = "row align-items-center m-0">
//                 <div className = "col-auto p-0">
//                     <label htmlFor = "tableSearch">Search</label>
//                 </div>
//                 <div className = "col-auto">
//                     <TextInput
//                         hideLabel = { true }
//                         classes = "form-control form-control-sm"
//                         name = "tableSearch"
//                         value = { value || "" }
//                         onChange = {
//                             (e) =>
//                             {
//                                 setValue(e.currentTarget.value);
//                                 onChange(e.currentTarget.value);
//                             }
//                         }
//                     />
//                 </div>
//             </div>
//         </section>
//     );
// }

// const TablePagesSelector = ({
//     nextPage,
//     canNextPage,
//     previousPage,
//     canPreviousPage,
//     pageIndex
// }) =>
// {
//     return (
//         <section>
//             <div className = "btn-group" role = "group" aria-label = "Table Pagination">
//                 <Button
//                     classes = "btn btn-sm btn-light"
//                     onClick = { e => previousPage() }
//                     disabled = { !canPreviousPage }
//                 >Previous</Button>
//                 <Button
//                     classes = "btn btn-sm btn-primary"
//                 >{ pageIndex + 1 }</Button>
//                 <Button
//                     classes = "btn btn-sm btn-light"
//                     onClick = { e => nextPage() }
//                     disabled = { !canNextPage }
//                 >Next</Button>
//             </div>
//         </section>
//     );
// }

// const RowsCounterInfo = ({
//     pageSize,
//     pageIndex,
//     rows
// }) =>
// {
//     const from = (pageSize * pageIndex) + 1;
//     const to = (pageSize * (pageIndex + 1)) > rows.length ? rows.length : (pageSize * (pageIndex + 1));

//     return (
//         <h6>
//             <i>{ `Showing ${from} to ${to} of ${rows.length} entries.` }</i>
//         </h6>
//     );
// }

// const PageSizeSelector = ({ pageSize, setPageSize }) =>
// {
//     return (
//         <div className = "row align-items-center justify-content-end">
//             <div className = "col-auto p-0">Show</div>
//             <div className = "col-auto">
//                 <ComboInput
//                     name = "pageSize"
//                     comboBoxOptions = {
//                         [
//                             { text: 10, value: 10 },
//                             { text: 20, value: 20 },
//                             { text: 25, value: 25 },
//                             { text: 30, value: 30 },
//                             { text: 40, value: 40 },
//                             { text: 50, value: 50 }
//                         ]
//                     }
//                     value = { pageSize || "" }
//                     onChange = { e => setPageSize(e.currentTarget.value) }
//                     hideLabel = { true }
//                     formGrpClasses = "m-0"
//                 />
//             </div>
//             <div className = "col-auto p-0">entries.</div>
//         </div>
//     );
// }

// const DataTable = (props) =>
// {
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         rows,
//         page,
//         prepareRow,
//         globalFilter,
//         setGlobalFilter,
//         canNextPage,
//         canPreviousPage,
//         nextPage,
//         previousPage,
//         gotoPage,
//         setPageSize,
//         pageOptions,
//         pageCount,
//         state: { pageIndex, pageSize }
//     } = useTable(
//         {
//             data: props.data,
//             columns: props.columns
//         },
//         useGlobalFilter,
//         usePagination,
//         useRowSelect
//     );

//     return (
//         <section>
//             {
//                 props.includeTableSearch ?
//                     <div className = "row m-0">
//                         <div className = "col-6 p-0">
//                             <TableSearch
//                                 globalFilter = { globalFilter }
//                                 setGlobalFilter = { setGlobalFilter }
//                             />
//                         </div>
//                         <div className = "col-6 text-right">
//                             {
//                                 props.includePagination ?
//                                     <PageSizeSelector
//                                         {
//                                             ...{
//                                                 pageSize,
//                                                 setPageSize
//                                             }
//                                         }
//                                     />
//                                 :
//                                     null
//                             }

//                         </div>
//                     </div>
//                 :
//                     null
//             }
//             <div>
//                 <BTable striped bordered hover size = "md" { ...getTableProps() }>
//                     <thead>
//                         {
//                             headerGroups.map(
//                                 headerGroup =>
//                                 {
//                                     return <tr { ...headerGroup.getHeaderGroupProps() }>
//                                         {
//                                             headerGroup.headers.map(
//                                                 header => {
//                                                     return <th { ...header.getHeaderProps() }>
//                                                         { header.render("Header") }
//                                                     </th>
//                                                 }
//                                             )
//                                         }
//                                     </tr>
//                                 }
//                             )
//                         }
//                     </thead>
//                     <tbody { ...getTableBodyProps() }>
//                         {
//                             page.map(
//                                 row =>
//                                 {
//                                     prepareRow(row);
//                                     return <tr { ...row.getRowProps() }>
//                                         {
//                                             row.cells.map(
//                                                 cell => {
//                                                     return <td { ...cell.getCellProps() }>
//                                                         { cell.render("Cell") }
//                                                     </td>
//                                                 }
//                                             )
//                                         }
//                                     </tr>
//                                 }
//                             )
//                         }
//                     </tbody>
//                 </BTable>
//             </div>
//             {
//                 props.includePagination ?
//                     <div className = "row m-0">
//                         <div className = "col-6">
//                             <RowsCounterInfo
//                                 {
//                                     ...{
//                                         pageSize,
//                                         pageIndex,
//                                         rows
//                                     }
//                                 }
//                             />
//                         </div>
//                         <div className = "col-6 text-right">
//                             <TablePagesSelector
//                                 {
//                                     ...{
//                                         nextPage,
//                                         previousPage,
//                                         canNextPage,
//                                         canPreviousPage,
//                                         pageIndex
//                                     }
//                                 }
//                             />
//                         </div>
//                     </div>
//                 :
//                     null
//             }
//         </section>
//     );
// }

// export default DataTable;
