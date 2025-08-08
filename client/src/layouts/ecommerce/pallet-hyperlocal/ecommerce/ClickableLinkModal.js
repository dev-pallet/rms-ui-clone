import { Autocomplete, Grid, InputLabel, TextField } from '@mui/material';
import {
  getCatLevel1,
  getCatLevel2,
  getMainCategory,
  getVendorProdPortfolioInfoSuggest,
} from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,
};

const cardStyle = {
  fontWeight: '600',
  fontSize: '1.2rem',
  lineHeight: '2',
  color: '#4b524d',
};

const outerCardStyle = {
  cursor: 'pointer',
  marginTop: '15px',
  textAlign: 'center',
  padding: '20px !important',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
};

export default function ClickableLinkModal({ clickableUrl, setClickableUrl, index }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [urlType, setUrlType] = useState();
  const [mainCatgeory, setMainCategory] = useState({});
  const [catLevel1, setCatLevel1] = useState();
  const [catLevel2, setCatLevel2] = useState();
  const [selectedCat1, setSelectedCat1] = useState({});
  const [selectedCat2, setSelectedCat2] = useState({});
  const [urlCategoryType, setUrlCategoryType] = useState();
  const [mainCat, setMainCat] = useState();
  const [inputlist, setInputlist] = useState([
    {
      prodOptions: [],
      productName: '',
      quantity: '',
      unit: '',
      productPrice: '',
      gst: '',
      discount: '',
      vendorProductPrice: '',
      gtin: '',
      images: '',
    },
  ]);
  const locId = localStorage.getItem('locId');
  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([]);

  const selectProduct = (item, index) => {
    const d_img = 'https://i.imgur.com/dL4ScuP.png';

    const list = [...inputlist];
    list[index].productName = item.name;
    list[index].quantity = item.weights_and_measures.net_content;
    list[index].unit = item.weights_and_measures.measurement_unit;
    list[index].productPrice = item.mrp.mrp;
    list[index].gst = item.igst;
    list[index].gtin = item.gtin;
    list[index].prodOptions = [];
    (list[index].images =
      item?.images?.front || item?.images?.back || item?.images?.top_left || item?.images?.top_right || d_img),
    setInputlist(list);
    setAutoCompleteDetailsRowIndex((prev) => [...prev, index]);
  };

  const handleDeleteproduct = (index) => {
    const updatedInputlist = [...inputlist];
    updatedInputlist.splice(index, 1);
    setInputlist(updatedInputlist);
  };

  useEffect(() => {
    const updatedUrls = [...clickableUrl];
    if (urlType?.label === 'category') {
      updatedUrls[index] = `://banners/${urlCategoryType?.level ? urlCategoryType?.level + '/' : ''}${
        urlCategoryType?.data?.label || ''
      }`;
      setClickableUrl(updatedUrls);
    } else if (urlType?.label === 'product') {
      updatedUrls[index] = `://banners/product/${inputlist[0]?.gtin}`;
      setClickableUrl(updatedUrls);
    } else if (urlType?.label === 'brand') {
    }
  }, [urlCategoryType, inputlist]);

  const handleChange = (e, index) => {
    const searchText = e.target.value;

    if (searchText) {
      const payload = {
        page: '1',
        pageSize: '10',
        brand: [],
        companyName: [],
        mainCategory: [],
        categoryLevel1: [],
        categoryLevel2: [],
        supportedStore: [locId],
        supportedWarehouse: [],
        supportedVendor: [],
        marketPlaceSeller: [],
      };

      if (typeof searchText === 'string') {
        if (!isNaN(searchText)) {
          payload.gtin = [searchText];
        } else {
          payload.names = [searchText];
        }
      }
      //   setLoader(true);
      getVendorProdPortfolioInfoSuggest(payload).then(function (response) {
        // setLoader(false);
        // const list = [...inputlist];
        // list[index].prodOptions = response.data.data.products;

        const list = [...inputlist];
        list[index].prodOptions = response.data.data.products.map((item) => ({
          value: item?.name,
          label: `${item.gtin}  (${item?.name})`,
          name: item?.name,
          weights_and_measures: item?.weights_and_measures.net_content,
          mrp: item.mrp.mrp,
          gst: item.igst,
          gtin: item.gtin,
          images: item.images,
        }));
        setInputlist(list);
      });
    } else if (searchText == 0) {
      const list = [...inputlist];
      list[index].prodOptions = [];
      setInputlist(list);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    getMainCategory()
      .then((res) => {
        const cat = res?.data?.data?.map((e) => ({ value: e.mainCategoryId, label: e.categoryName }));
        setMainCategory(cat);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mainCat) {
      getCatLevel1(mainCat?.value)
        .then((res) => {
          const cat = res?.data?.data?.map((e) => ({ value: e.level1Id, label: e.categoryName }));
          setCatLevel1(cat);
        })
        .catch(() => {});
    }
  }, [mainCat]);

  useEffect(() => {
    if (selectedCat1) {
      getCatLevel2(selectedCat1?.value)
        .then((res) => {
          const cat = res?.data?.data?.map((e) => ({ value: e.level2Id, label: e.categoryName }));
          setCatLevel2(cat);
        })
        .catch(() => {});
    }
  }, [selectedCat1]);

  const handleClickableUrl = (e) => {
    setUrlType(e);
    if (e) {
      handleOpen();
    }
  };

  return (
    <div>
      <SoftSelect
        menuPortalTarget={document.body}
        id="status"
        placeholder="select type"
        options={[
          { value: 'category', label: 'category' },
          { value: 'brand', label: 'brand' },
          { value: 'product', label: 'product' },
        ]}
        isClearable={true}
        // value={listedOn}
        onChange={handleClickableUrl}
      ></SoftSelect>
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
        <Box sx={style}>
          <SoftTypography style={{ fontSize: '1rem' }}>Select {urlType?.label}</SoftTypography>

          <hr
            style={{
              color: 'blue',
              backgroundColor: 'lightgray',
              marginTop: '10px',
              marginBottom: '10px',
              height: '1px',
              border: 'none',
              opacity: '0.4',
            }}
          />
          {urlType?.value === 'category' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Main Category
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  // defaultValue={[]}
                  isClearable={true}
                  value={mainCat}
                  options={mainCatgeory}
                  onChange={(option) => {
                    setMainCat(option),
                    setUrlCategoryType({ level: 'mainCategory', data: option }),
                    setSelectedCat1({ value: '', label: '' }),
                    setSelectedCat2({ value: '', label: '' });
                  }}
                />
              </Grid>
              {catLevel1 && (
                <Grid item xs={12}>
                  <SoftBox mb={1} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Category Level 1
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    // defaultValue={[]}
                    isClearable={true}
                    value={selectedCat1}
                    options={catLevel1}
                    onChange={(option) => {
                      setSelectedCat1(option), setUrlCategoryType({ level: 'level1', data: option }), setSelectedCat2();
                    }}
                  />
                </Grid>
              )}
              {catLevel2 && (
                <Grid item xs={12}>
                  <SoftBox mb={1} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Category Level 2
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    // defaultValue={[]}
                    isClearable={true}
                    value={selectedCat2}
                    options={catLevel2}
                    onChange={(option) => {
                      setSelectedCat2(option), setUrlCategoryType({ level: 'level2', data: option });
                    }}
                  />
                </Grid>
              )}
            </Grid>
          )}

          {urlType?.value === 'product' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    product Name
                  </InputLabel>
                </SoftBox>
                <SoftBox>
                  {inputlist?.map((x, i) => {
                    return (
                      <SoftBox sx={{ display: 'flex', flexDirection: 'column' }}>
                        {autoCompleteDetailsRowIndex.includes(i) && x.productName.length ? (
                          <SoftBox style={{ position: 'relative' }}>
                            <TextField
                              value={x.productName}
                              //   onChange={(e) => {
                              //     const list = [...inputlist];
                              //     list[i].productName = e.target.value;
                              //     setInputlist(list);
                              //   }}
                              readOnly={true}
                              style={{
                                width: '100%',
                                height: '40px',
                              }}
                            />
                            <SoftTypography
                              onClick={() => handleDeleteproduct(i)}
                              style={{
                                fontSize: '1.2rem',
                                position: 'absolute',
                                top: '5px',
                                right: '10px',
                                color: 'red',
                              }}
                            >
                              <DeleteOutlineIcon />{' '}
                            </SoftTypography>
                          </SoftBox>
                        ) : (
                          <Autocomplete
                            options={x.prodOptions}
                            // getOptionLabel={(option) => option.name}
                            autoFocus
                            onChange={(e, v) => selectProduct(v, i)}
                            style={{ width: '100%' }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={(e) => handleChange(e, i)}
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />
                        )}
                      </SoftBox>
                    );
                  })}
                </SoftBox>
              </Grid>
            </Grid>
          )}
          {urlType?.value === 'brand' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Brand Name
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  // defaultValue={[]}
                  isClearable={true}
                  value={{}}
                  options={{}}
                  onChange={(option) => {
                    //   setMainCat(option);
                  }}
                />
              </Grid>
            </Grid>
          )}
          <SoftTypography
            style={{
              fontSize: '0.9rem',
              backgroundColor: 'ghostwhite',
              padding: '3px',
              borderRadius: '8px',
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            {urlType?.label === 'category' &&
              `://banners/${urlCategoryType?.level ? urlCategoryType?.level + '/' : ''}${
                urlCategoryType?.data?.label || ''
              }`}

            {urlType?.label === 'product' && `://banners/product/${inputlist[0]?.gtin}`}

            {urlType?.label === 'brand' && '://banners/brand/'}
          </SoftTypography>
          <SoftBox style={{ float: 'right', marginTop: '10px' }}>
            <SoftButton color="info" onClick={handleClose}>
              Save
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>
    </div>
  );
}
