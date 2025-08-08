import { Checkbox, Paper, TableContainer, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import './index.css';

export const ProductsListTable = ({
  tableRows,
  totalPages,
  totalResults,
  pageState,
  setPageState,
  selectedProducts,
  setSelectedProducts,
  selectDeselectProducts,
  setAllSelected,
}) => {
  const [loading, setLoading] = useState(false);
  const tableRef = useRef();

  const defaultHeaderRenderer = ({ label }) => <div style={{ fontSize: '14px' }}>{label}</div>;

  const handleScroll = async () => {
    if (loading) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = tableRef.current;

    // Check if the user has scrolled to the bottom, only check if the pageState.page < pageState.totalPages
    if (Number(pageState.page) < Number(pageState.totalPages)) {
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        setPageState((prev) => ({ ...prev, page: prev.page + 1 }));
        // console.log('reached bottom');
      }
    }
  };

  const handleCheckboxChange = (gtin, isOutOfStock) => {
    setSelectedProducts((prevSelected) => {
      if (isChecked(gtin)) {
        setAllSelected(false);
        return prevSelected.filter((product) => product.gtin !== gtin);
      } else {
        if (prevSelected.length === tableRows.length - 1) {
          setAllSelected(true);
        }
        const selected = {
          gtin,
          isOutOfStock,
        };
        return [...prevSelected, selected];
      }
    });
  };

  useEffect(() => {
    const currentRef = tableRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);

  // console.log(selectedProducts);

  const isChecked = (gtin, index) => {
    return selectedProducts?.some((product) => product.gtin === gtin);
  };

  return (
    <TableContainer style={{ height: '100%', width: '100%' }} component={Paper}>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            className="products-list-table"
            width={width}
            height={height}
            headerHeight={50}
            rowHeight={40}
            rowCount={tableRows?.length}
            rowGetter={({ index }) => tableRows[index]}
            // rowRenderer={({item,index})=><div>{item}</div>}
            onRowsRendered={({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
              if (stopIndex + 1 === tableRows.length) {
                if (Number(pageState.page) < Number(pageState.totalPages) && pageState.loading === false) {
                  setPageState((prev) => ({ ...prev, page: prev.page + 1 }));
                  // console.log('scrolled to bottom');
                }
              }
            }}
          >
            <Column
              label={
                <Tooltip
                  title={selectedProducts?.length === tableRows?.length ? 'Deselect All' : 'Select All'}
                  placement="top"
                >
                  <Checkbox
                    checked={selectedProducts?.length === tableRows?.length}
                    onChange={() => selectDeselectProducts()}
                  />
                </Tooltip>
              }
              dataKey=""
              headerRenderer={defaultHeaderRenderer}
              cellRenderer={({ rowIndex }) => {
                return (
                  <div>
                    <Checkbox
                      className="checkbox-css"
                      checked={selectedProducts?.some((product) => product.gtin === tableRows[rowIndex]?.gtin)}
                      onClick={() =>
                        handleCheckboxChange(
                          tableRows[rowIndex]?.gtin,
                          tableRows[rowIndex]?.availableUnits === 'NA' || tableRows[rowIndex]?.availableUnits === 0,
                        )
                      }
                    />
                  </div>
                );
              }}
            />
            <Column
              label="S.No"
              dataKey="id"
              headerRenderer={defaultHeaderRenderer}
              cellRenderer={({ rowIndex }) => <div>{rowIndex + 1}</div>}
            />
            <Column label="Product Name" dataKey="product" headerRenderer={defaultHeaderRenderer} />
            <Column label="Barcode" dataKey="gtin" headerRenderer={defaultHeaderRenderer} />
            <Column label="Brand" dataKey="brand" headerRenderer={defaultHeaderRenderer} />
            <Column label="Available Units" dataKey="availableUnits" headerRenderer={defaultHeaderRenderer} />
            <Column label="UOM" dataKey="weightUOM" headerRenderer={defaultHeaderRenderer} />
            <Column label="MRP" dataKey="mrp" headerRenderer={defaultHeaderRenderer} />
          </Table>
        )}
      </AutoSizer>
    </TableContainer>
  );
};
