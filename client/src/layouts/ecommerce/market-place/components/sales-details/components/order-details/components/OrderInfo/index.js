/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from '@mui/material/Grid';
// Soft UI Dashboard PRO React components
import './Orderinfo.css';
import { getProductDetails } from '../../../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftTypography from '../../../../../../../../../components/SoftTypography';

// Images
const orderImage =
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80';

function OrderInfo(props) {
  
  const itemList = props.orderItemList;
  const [dataArray, setDataArray] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imageFetchingDone, setImageFetchingDone] = useState(false); // New state to track image fetching

  // Function to fetch images for each gtin and update the array
  const fetchImagesAndUpdateArray = async (data) => {
    const updatedArray = [];

    for (const item of data) {
      const { gtin } = item;
      try {
        const productDetails = await getProductDetails(gtin);
        let imageUrl = 'https://i.imgur.com/dL4ScuP.png';
        if (productDetails?.data?.data?.images?.front && productDetails?.data?.data?.images?.front !== 'string') {
          imageUrl = productDetails?.data?.data?.images.front;
        } else if (productDetails?.data?.data?.images?.top && productDetails?.data?.data?.images?.top !== 'string') {
          imageUrl = productDetails?.data?.data?.images.top;
        } else if (productDetails?.data?.data?.images?.bottom && productDetails?.data?.data?.images?.bottom !== 'string') {
          imageUrl = productDetails?.data?.data?.images.bottom;
        } else if (productDetails?.data?.data?.images?.back && productDetails?.data?.data?.images?.back !== 'string') {
          imageUrl = productDetails?.data?.data?.images.back;
        } else if (productDetails?.data?.data?.images?.top_left && productDetails?.data?.data?.images?.top_left !== 'string') {
          imageUrl = productDetails?.data?.data?.images.top_left;
        } else if (productDetails?.data?.data?.images?.right && productDetails?.data?.data?.images?.right !== 'string') {
          imageUrl = productDetails?.data?.data?.images.right;
        } else if (productDetails?.data?.data?.images?.left && productDetails?.data?.data?.images?.left !== 'string') {
          imageUrl = productDetails?.data?.data?.images.left;
        } else if (productDetails?.data?.data?.images?.top_right && productDetails?.data?.data?.images?.top_right !== 'string') {
          imageUrl = productDetails?.data?.data?.images?.top_right;
        }

        const updatedItem = { ...item, productImage: imageUrl };
        updatedArray.push(updatedItem);

      } catch (error) {
        updatedArray.push(item);
      }
    }

    setDataArray(updatedArray);
  };

  useEffect(() => {
    setDataArray(itemList);
    setDataLoaded(true); // Mark the initial data loading as completed
  }, [itemList]);

  useEffect(() => {
    if (dataLoaded && dataArray.length > 0 && !imageFetchingDone) {
      fetchImagesAndUpdateArray(dataArray);
      setImageFetchingDone(true); // Mark image fetching as completed
    }
  }, [dataArray, dataLoaded, imageFetchingDone]);
  return (

    <Grid container spacing={3}>
      <Grid item xs={12} xl={12} p={1}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5" fontWeight="medium">
              Items
          </SoftTypography>
        </SoftBox>
        <table>
          <thead>
            <tr className="table-tr">
              <th className="th-text">Item</th>
              <th className="th-text">Rate</th>
              <th className="th-text">Quantity</th>
              <th className="th-text">Amount</th>
            </tr>
          </thead>

          <tbody>
            {dataArray.map((item) => (
              <tr key={item.gtin}>
                {item.productImage == null
                  ?<td className="td-text"> <SoftAvatar ml={5} p={2} variant="rounded" size="xl" src={orderImage} alt="" />
                    <SoftBox className="small-table-text-I">{item.productName}</SoftBox>
                  </td>
                  :<td className="td-text"> <SoftAvatar ml={5} p={2} variant="rounded" size="xl" src={item.productImage} alt="" />
                    <SoftBox className="small-table-text-I">{item.productName}</SoftBox>
                  </td>
                }
                <td className="small-table-text">Rs. {item.mrp}</td>
                <td className="small-table-text">{item.quantity}</td>
                <td className="small-table-text">Rs.{item.quantity * item.mrp}</td>
              </tr>   
            ))}
                
          </tbody>
        </table>
      </Grid>
    </Grid>
  );
}

export default OrderInfo;