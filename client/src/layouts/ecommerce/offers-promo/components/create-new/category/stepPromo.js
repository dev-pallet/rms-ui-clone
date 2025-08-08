import { Button, Grid, InputLabel, TextField } from '@mui/material';
import { getAllLevel1Category, getAllLevel2Category } from '../../../../../../config/Services';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const StepCategoryPromotion = ({
  count,
  setCount,
  mainCate,
  setMainCate,
  catLevel1,
  setCatLevel1,
  catLevel2,
  setCatLevel2,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  quantity,
  setQuantity,
  mainCatOption,
  setMainCatOption,
  brandOption,
  setBrandOption,
  catLevel1Option,
  setCatLevel1Option,
  catLevel2Option,
  setCatLevel2Option,
  brandName,
  setBrandName,
}) => {
  const boxRef = useRef(null);
  const [mainCatSelected, setMainCatSelected] = useState(Array(count).fill(false));
  const [catLevel1Selected, setCatLevel1Selected] = useState(Array(count).fill(false));
  const [catLevel2Selected, setCatLevel2Selected] = useState(Array(count).fill(false));
  const [brandSelected, setBrandSelected] = useState(Array(count).fill(false));
  const discountArray = [
    { value: '%', label: '%' },
    { value: 'Rs', label: 'Rs' },
  ];

  const handleAddmore = () => {
    setCount((prev) => prev + 1);
    setMainCate([...mainCate, mainCate]);
    setCatLevel1([...catLevel1, catLevel1]);
    setCatLevel2([...catLevel2, catLevel2]);
    setBrandName([...brandName, brandName]);
    setDiscount([...discount, '']);
    setQuantity([...quantity, '']);
    setDiscountType([...discountType, '']);

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

    const updatedBrandName = [...brandName];
    updatedBrandName.splice(index, 1);
    setBrandName(updatedBrandName);

    const updatedQuantity = [...quantity];
    updatedQuantity.splice(index, 1);
    setQuantity(updatedQuantity);

    const updatedDiscount = [...discount];
    updatedDiscount.splice(index, 1);
    setDiscount(updatedDiscount);

    const updatedDiscountType = [...discountType];
    updatedDiscountType.splice(index, 1);
    setDiscountType(updatedDiscountType);

    const updatedMainCatSelected = [...mainCatSelected];
    updatedMainCatSelected.splice(index, 1);
    setMainCatSelected(updatedMainCatSelected);

    const updatedCatLevel1Selected = [...catLevel1Selected];
    updatedCatLevel1Selected.splice(index, 1);
    setCatLevel1Selected(updatedCatLevel1Selected);

    const updatedCatLevel2Selected = [...catLevel2Selected];
    updatedCatLevel2Selected.splice(index, 1);
    setCatLevel2Selected(updatedCatLevel2Selected);

    const updatedBrandSelected = [...brandSelected];
    updatedBrandSelected.splice(index, 1);
    setBrandSelected(updatedBrandSelected);

    setCount((prev) => prev - 1);
  };

  const handleChangeValues = (e, index) => {
    if (e.target.name === 'discount') {
      const updatedDiscount = [...discount];
      updatedDiscount[index] = e.target.value;
      setDiscount(updatedDiscount);
    } else if (e.target.name === 'quantity') {
      const updatedQuantity = [...quantity];
      updatedQuantity[index] = e.target.value;
      setQuantity(updatedQuantity);
    }
  };

  const handelDiscount = (option, index) => {
    const update = [...discountType];
    update[index] = option.value;
    setDiscountType(update);
  };

  const handleCatLevel1 = (e, index) => {
    const updatedMainCate = [...mainCate];
    updatedMainCate[index] = e.label;
    setMainCate(updatedMainCate);

    const updatedMainCatSelected = [...mainCatSelected];
    updatedMainCatSelected[index] = true;
    setMainCatSelected(updatedMainCatSelected);

    const payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [e.value],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level1Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel1Option(arr[0]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCatLevel2 = (e, index) => {
    const updatedCatLevel1 = [...catLevel1];
    updatedCatLevel1[index] = e.label;
    setCatLevel1(updatedCatLevel1);

    const updatedCatLevel1Selected = [...catLevel1Selected];
    updatedCatLevel1Selected[index] = true;
    setCatLevel1Selected(updatedCatLevel1Selected);

    const payload = {
      page: 1,
      pageSize: 100,
      level1Id: [e.value],
    };
    getAllLevel2Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel2Option(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
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
          // const isProductSelected = main[reversedIndex];
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
                  xs={2}
                  sm={2}
                  md={2}
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
                    {mainCatSelected[reversedIndex] || reversedIndex !== 0 ? (
                      <TextField
                        value={mainCate[0]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        options={mainCatOption}
                        onChange={(e) => handleCatLevel1(e, reversedIndex)}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
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
                    {catLevel1Selected[reversedIndex] || catLevel1[0] === '' || reversedIndex !== 0 ? (
                      <TextField
                        value={catLevel1[0]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        options={catLevel1Option}
                        // value={catLevel1}
                        onChange={(e) => handleCatLevel2(e, reversedIndex)}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
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
                    {catLevel2Selected[reversedIndex] || catLevel2[0] === '' || reversedIndex !== 0 ? (
                      <TextField
                        value={catLevel2[0]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        options={catLevel2Option}
                        // value={catLevel2}
                        onChange={(e) => {
                          const updatedCatLevel2 = [...catLevel2];
                          updatedCatLevel2[reversedIndex] = e.label;
                          setCatLevel2(updatedCatLevel2);

                          const updatedCatLevel2Selected = [...catLevel2Selected];
                          updatedCatLevel2Selected[reversedIndex] = true;
                          setCatLevel2Selected(updatedCatLevel2Selected);
                        }}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  //   display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Brand Name
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    {brandSelected[reversedIndex] || reversedIndex !== 0 ? (
                      <TextField
                        value={brandName[0]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        options={brandOption}
                        onChange={(e) => {
                          const updatedBrandName = [...brandName];
                          updatedBrandName[reversedIndex] = e.label;
                          setBrandName(updatedBrandName);

                          const updatedBrandSelected = [...brandSelected];
                          updatedBrandSelected[reversedIndex] = true;
                          setBrandSelected(updatedBrandSelected);
                        }}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  //   display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Quantity
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftInput
                      type="number"
                      name="quantity"
                      value={quantity[reversedIndex]}
                      onChange={(e) => handleChangeValues(e, reversedIndex)}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Discount
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox className="boom-box">
                    <SoftInput
                      className="boom-input"
                      //   disabled={isGen ? true : false}
                      onChange={(e) => handleChangeValues(e, reversedIndex)}
                      value={discount[reversedIndex]}
                      type="number"
                      name="discount"
                    />
                    <SoftBox>
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        // className="boom-soft-select"
                        // isDisabled={isGen ? true : false}
                        value={discountArray.find((option) => option.value === discountType[reversedIndex]) || ''}
                        defaultValue={{ value: '%', label: '%' }}
                        onChange={(option) => handelDiscount(option, reversedIndex)}
                        options={discountArray}
                      />
                    </SoftBox>
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
        <Button sx={{ marginLeft: '-10px', marginTop: '10px', color: '#0562FB' }} onClick={handleAddmore}>
          + Add more
        </Button>
      </SoftBox>
    </SoftBox>
  );
};

export default StepCategoryPromotion;
