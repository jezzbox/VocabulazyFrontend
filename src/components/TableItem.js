
const TableItem = ({ tableItem, headers }) => {

    return (
            headers.map((header, index) => (
                        <td key={index}>{tableItem[header.objectProperty]}</td>
                        ))
    )
}
export default TableItem