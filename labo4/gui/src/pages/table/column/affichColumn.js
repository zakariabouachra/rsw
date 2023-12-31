import React, { useState } from 'react';
import {
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import DeleteColumn from './deleteColumn';
import 'assets/css/styles.css';
import EditColumn from './editColumn';


const ColumnShow = ({ dbcolumns , setdbColumns, currentDatabaseName, currentSchemaName, currentTableName, setData}) => {
    const [index, setIndex] = useState(null);
    

    const sortedColumns = [...dbcolumns].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const [openDeleteColumnDialog, setOpenDeleteColumnDialog] = useState(false);
    const [openEditColumnDialog, setOpenEditColumnDialog] = useState(false);

    const handleEditColumn = (index) => {
        setIndex(index);
        setOpenEditColumnDialog(true);
    };

    const handleOpenDeleteColumnDialog = (index) => {
        setIndex(index);
        setOpenDeleteColumnDialog(true);
    };

    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedColumns.map((column, index) => (
                            <TableRow key={index}>
                                <TableCell>{column.name}</TableCell>
                                <TableCell>{column.dataType}</TableCell>
                                <TableCell>
                                    <IconButton className="editbutton" onClick={() => handleEditColumn(index)}>
                                        <EditOutlined /> Edit
                                    </IconButton>
                                    <IconButton className="deletebutton" onClick={() => handleOpenDeleteColumnDialog(index)}>
                                        <DeleteOutlined /> Delete
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <EditColumn
                openEditColumnDialog={openEditColumnDialog}
                setOpenEditColumnDialog={setOpenEditColumnDialog}
                columnData={sortedColumns}
                columnIndexToEdit={index}
                currentDatabaseName={currentDatabaseName}
                currentTableName={currentTableName}
                currentSchemaName={currentSchemaName}
                currentColumnName={sortedColumns[index]}
                setdbColumns={setdbColumns}
                setData={setData}
            />

            <DeleteColumn
                openDeleteColumnDialog={openDeleteColumnDialog}
                setOpenDeleteColumnDialog={setOpenDeleteColumnDialog}
                dbcolumns={sortedColumns}
                columnIndexToDelete={index}
                setdbColumns={setdbColumns}
                currentDatabaseName={currentDatabaseName}
                currentTableName={currentTableName}
                currentSchemaName={currentSchemaName}
                setData={setData}
            />

            
        </div>
    );
};

export default ColumnShow;
