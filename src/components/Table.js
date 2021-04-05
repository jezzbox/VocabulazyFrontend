import { useTable } from 'react-table'

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const Table = ({ columns, data }) => {

  const tableInstance = useTable({ columns, data })

  const {

    getTableProps,

    getTableBodyProps,

    headerGroups,

    rows,

    prepareRow,

  } = tableInstance



  return (
    <MaUTable {...getTableProps()}>

      <TableHead>

        {// Loop over the header rows

          headerGroups.map(headerGroup => (

            // Apply the header row props

            <TableRow {...headerGroup.getHeaderGroupProps()}>

              {// Loop over the headers in each row

                headerGroup.headers.map(column => (

                  // Apply the header cell props

                  <TableCell {...column.getHeaderProps()}>

                    {// Render the header

                      column.render('Header')}

                  </TableCell>

                ))}

            </TableRow>

          ))}

      </TableHead>

      {/* Apply the table body props */}

      <TableBody {...getTableBodyProps()}>

        {// Loop over the table rows

          rows.map(row => {

            // Prepare the row for display

            prepareRow(row)

            return (

              // Apply the row props

              <TableRow {...row.getRowProps()}>

                {// Loop over the rows cells

                  row.cells.map(cell => {

                    // Apply the cell props

                    return (

                      <TableCell {...cell.getCellProps()}>

                        {// Render the cell contents

                          cell.render('Cell')}

                      </TableCell>

                    )

                  })}

              </TableRow>

            )

          })}

      </TableBody>

    </MaUTable>
  )
}

export default Table



