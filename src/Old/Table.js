import React from 'react'
import TableItem from './TableItem'
import PropTypes from 'prop-types'

const Table = ({ tableData, className , headers, showHeaders }) => {
    return (
            <table className={className}>
                <tbody>
                    {showHeaders && headers.length > 0 && 
                        <tr>
                        {headers.map((header, index) => (
                            header.columnName && <th key={index}>{header.columnName}</th>
                        ))}
                        </tr>}

                    {tableData.map((tableItem, index) => (
                        <tr>
                        <TableItem key={index} headers={headers} tableItem={tableItem}/>
                        </tr>
                ))}
            </tbody>
            </table>
    )
    
}

Table.defaultProps = {
    className: '',
    headers:[],
    showHeaders:true
}

Table.propTypes = {
    className: PropTypes.string,
    headers: PropTypes.array,
    showHeaders: PropTypes.bool
}

export default Table