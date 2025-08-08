import { Box, Pagination, Typography } from '@mui/material';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import React, { useState } from 'react';

const OrderMetrics = () => {
  const products = [
    {
      barcode: '2384286764223',
      image:
        'https://storage.googleapis.com/download/storage/v1/b/cms_products/o/cms%2Fproduct%2Fupload%2Fimages%2F8000500411469%2Ffront?generation=1708665536118975&alt=media',
      name: 'FERRERO ROCHER 16 PIECES',
      category: 'Snacks & Branded > FoodsChocolates & Candies > Chocolates',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products?.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(products?.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const isMobileDevice = isSmallScreen();

  return (
    <div>
      {!isMobileDevice && (
        <>
          <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
            {currentItems?.map((item) => {
              return (
                <div className="order-metrics-single-box">
                  <div className="order-metrics-product-left">
                    <img className="order-metrics-product-left-img" src={item.image} />
                    <div className="order-metrics-product-left-typo">
                      <Typography fontSize="11px" color="#0562fb">{item.category}</Typography>
                      <Typography fontSize="14px">{item.name}</Typography>
                    </div>
                  </div>
                  <div className="order-metrics-product-right">
                    <Typography fontSize="14px">Barcode: {item.barcode}</Typography>
                  </div>
                </div>
              );
            })}
          </Box>
          <div className="custom-pagination-component-order-metrics">
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrderMetrics;
