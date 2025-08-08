import { Button, Grid, InputLabel } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useRef } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const CartValueCategory = ({
  count,
  setCount,
  mainCate,
  setMainCate,
  catLevel1,
  setCatLevel1,
  catLevel2,
  setCatLevel2,
}) => {
  const boxRef = useRef(null);

  const handleAddmore = () => {
    setCount((prev) => prev + 1);
    setMainCate([...mainCate, '']);
    setCatLevel1([...catLevel1, '']);
    setCatLevel2([...catLevel2, '']);

    const targetScrollPosition = 10050;

    if (boxRef.current) {
      const scrollStep = (targetScrollPosition - boxRef.current.scrollTop) / 20;
      let currentScrollPosition = boxRef.current.scrollTop;

      const animateScroll = () => {
        if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
          boxRef.current.scrollTop = targetScrollPosition;
        } else {
          boxRef.current.scrollTop += scrollStep;
          currentScrollPosition += scrollStep;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }
  };

  const handleDelete = (index) => {
    const updatedMainCate = [...mainCate];
    updatedMainCate.splice(index, 1);
    setMainCate(updatedMainCate);

    const updatedCatLevel1 = [...catLevel1];
    updatedCatLevel1.splice(index, 1);
    setCatLevel1(updatedCatLevel1);

    const updatedCatLevel2 = [...catLevel2];
    updatedCatLevel2.splice(index, 1);
    setCatLevel2(updatedCatLevel2);

    setCount((prev) => prev - 1);
  };

  return (
    <SoftBox>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">Category Details (Buy X) {count > 1 && ` (Total Item: ${count})`}</SoftTypography>
      </SoftBox>
      <SoftBox
        ref={boxRef}
        style={{
          marginTop: '20px',
          maxHeight: '500px',
          overflowY: count > 11 ? 'scroll' : 'visible',
          overflowX: 'scroll',
        }}
      >
        {Array.from({ length: count }, (_, i) => count - i - 1).map((_, reversedIndex) => {
          //   const isProductSelected = productSelected[reversedIndex];
          return (
            <SoftBox mt={1} style={{ minWidth: '900px' }}>
              <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid
                  item
                  xs={0.7}
                  sm={0.7}
                  md={0.7}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        S No.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftInput readOnly={true} value={reversedIndex + 1} />
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  //   display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Select Main Category
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftSelect />
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  //   display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Select Category Level 1
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftSelect />
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  //   display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Select Category Level 2
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftSelect />
                  </SoftBox>
                </Grid>
                <SoftBox
                  mt={reversedIndex === 0 ? '49px' : '10px'}
                  width="20px"
                  height="40px"
                  style={{ cursor: 'pointer' }}
                >
                  <CancelIcon onClick={() => handleDelete(reversedIndex)} fontSize="small" color="error" />
                </SoftBox>
              </Grid>
            </SoftBox>
          );
        })}
        <Button sx={{ marginLeft: '-10px', color: '#0562FB' }} onClick={handleAddmore}>
          + Add more
        </Button>
      </SoftBox>
    </SoftBox>
  );
};

export default CartValueCategory;
