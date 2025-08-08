import React, { useState } from 'react';
import {
  Modal,
  Box,
  Skeleton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  TablePagination,
} from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import SoftButton from '../../../../components/SoftButton';

const SelectProductModal = ({
  open,
  handleClose,
  brandRows,
  selectedRows,
  setSelectedRows,
  brandProductLoader,
  handleRowClick,
  isSelected,
  style,
  totalCount,
  setPage,
  page,
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      sx={{
        '& > .MuiBackdrop-root': {
          backdropFilter: 'blur(5px)',
        },
      }}
    >
      <Box sx={{ ...style, width: '95vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{ fontSize: '0.8rem', color: '#0562FB', fontWeight: 'bold' }}>
            {brandRows?.length > 0 ? `${brandRows?.length} Products found` : 'No Data found'}
          </SoftTypography>
          <SoftTypography style={{ fontSize: '0.8rem', color: 'green', fontWeight: 'bold' }}>
            {selectedRows?.length > 0 ? `${selectedRows?.length} Products selected` : ''}
          </SoftTypography>
        </div>
        {brandProductLoader ? (
          <>
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
          </>
        ) : (
          <>
            <TableContainer component={Paper} style={{ height: '75vh' }}>
              <Table
                sx={{
                  minWidth: 650,
                  '& > .MuiTableHead-root': {
                    display: 'contents',
                  },
                }}
                size="small"
                aria-label="a dense table"
                stickyHeader
              >
                <TableHead>
                  <TableRow size="small">
                    <TableCell>
                      <Checkbox
                        indeterminate={selectedRows.length > 0 && selectedRows.length < brandRows.length}
                        checked={brandRows.length > 0 && selectedRows.length === brandRows.length}
                        onChange={() => {
                          if (selectedRows.length === brandRows.length) {
                            setSelectedRows([]);
                          } else {
                            setSelectedRows([...brandRows]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem !important', fontWeight: 'bold' }}>Product Name</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem !important', fontWeight: 'bold' }}>Barcode</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem !important', fontWeight: 'bold' }}>Brand</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem !important', fontWeight: 'bold' }}>Uom</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem !important', fontWeight: 'bold' }}>mrp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brandRows?.map((row) => (
                    <TableRow
                      key={row.name}
                      onClick={() => handleRowClick(row)}
                      selected={isSelected(row)}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" padding="checkbox">
                        <Checkbox checked={isSelected(row)} />
                      </TableCell>
                      <TableCell component="th" scope="row" sx={{ fontSize: '0.85rem !important', maxWidth: '200px' }}>
                        {row?.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem !important' }}>{row?.barcode}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem !important' }}>{row?.brand}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem !important' }}>{row?.uom}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem !important' }}>{row?.mrp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={totalCount || 0}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
              />
            </TableContainer>
          </>
        )}
        <br />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            bottom: '10px',
            position: 'absolute',
            right: '10px',
          }}
        >
          <SoftButton color="info" variant="outlined" size="small" onClick={handleClose}>
            Cancel
          </SoftButton>
          <SoftButton color="info" size="small" onClick={handleClose}>
            Save
          </SoftButton>
        </div>
      </Box>
    </Modal>
  );
};

export default SelectProductModal;
