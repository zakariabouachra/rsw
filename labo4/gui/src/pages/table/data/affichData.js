import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
  } from '@mui/material';
  
  const DataShow = ({ data, dbcolumns }) => {
    return (
      <div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {dbcolumns.map((column, index) => (
                  <TableCell key={index}>{column.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {dbcolumns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {row[column.name] === 1e+27 || row[column.name] === "" ? "nan" : row[column.name]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };
  
  export default DataShow;
  