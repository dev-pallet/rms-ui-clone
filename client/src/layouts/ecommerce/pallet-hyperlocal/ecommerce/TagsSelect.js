import { Alert, Autocomplete, Box, Card, Grid, InputLabel, Snackbar, TextField } from '@mui/material';
import { expireDateChecker } from '../../Common/CommonFunction';
import {
  getAllProductsV2,
  getAllProductsV2New,
  getInventoryDetails,
  tagCreationProduct,
  tagEdit,
  tagFilterdata,
} from '../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormField from '../../purchase-bills/components/FormField';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';

const TagsSelect = () => {
  const { tagId } = useParams();
  const navigate = useNavigate();
  const [componentCount, setComponetCount] = useState(1);
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState('');
  const [itemName, setItemName] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loader, setLoader] = useState(false);
  const [tagPriority, setTagPriority] = useState(0);
  const [displayPage, setDisplayPage] = useState('');
  const [tagIcon, setTagIcon] = useState('');
  const [editGtin, setEditGtin] = useState('');
  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([]);
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const createdById = user_details && JSON.parse(user_details).uidx;
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
      availableUnits: '',
      productExpiry: 'noExpiry',
    },
  ]);
  const [editProductData, setEditProductData] = useState([]);
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [listedOn, setListedOn] = useState([]);
  const [expiredCount, setExpiredCount] = useState({});

  const getChipColor = (rowData) => {
    const expiredCount = rowData.filter((item) => item?.expired)?.length;
    const data = rowData.map((item) => item?.expired);
    const count = { totalCount: rowData?.length, expiredCount: expiredCount };
    if (expiredCount !== rowData?.length || rowData?.length !== 1) {
      setExpiredCount(count);
    }
    const halfLength = rowData?.length / 2;
    if (expiredCount === 0) {
      return 'noExpiry';
    }

    if (expiredCount === rowData?.length) {
      return 'error';
    } else if (expiredCount !== rowData?.length) {
      return 'noExpiry';
    }
    // return expiredCount >= halfLength ? 'error' : 'warning';
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.includes(' ')) {
      setInputValue(inputValue.replace(/ /g, ''));
    } else {
      setInputValue(inputValue);
    }
  };

  const handleAddComponent = () => {
    setComponetCount(componentCount + 1);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDeleteproduct = (index) => {
    const updatedInputlist = [...inputlist];
    updatedInputlist.splice(index, 1);
    setInputlist(updatedInputlist);
  };

  const handleItemNameKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };
  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  useEffect(() => {
    const tagPayload = {
      page: '1',
      pageSize: '10',
      orgIds: [orgId],
      locationIds: [locId],
      tagIds: [tagId],
      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DEFAULT',
      },
    };
    tagFilterdata(tagPayload)
      .then((res) => {
        setTagName(res?.data?.data?.data?.data[0]?.tagName || '');
        setTags(res?.data?.data?.data?.data[0]?.tags[0].replace(`${locId}_`, '') || '');
        setInputValue(res?.data?.data?.data?.data[0]?.tags[0].replace(`${locId}_`, '') || '');
        setTagIcon(res?.data?.data?.data?.data[0]?.tagIcon || '');
        setTagPriority(res?.data?.data?.data?.data[0]?.tagPriority || '');
        setEditGtin(res?.data?.data?.data?.data[0]?.gtins || []);
        setListedOn(
          res?.data?.data?.data?.data[0]?.listedOn?.map((item) => ({
            value: item,
            label: item,
          })) || [],
        );

        setDisplayPage(res?.data?.data?.data?.data[0]?.page || '');
      })
      .catch((err) => {});
  }, []);

  let lowerCaseLocId = locId.toLocaleLowerCase();

  useEffect(() => {
    if (editGtin.length) {
      const payload = {
        page: '1',
        pageSize: '100',
        barcode: editGtin || [],
        storeLocations: [locId],
        // sort: {
        //   mrpSortOption: 'DEFAULT',
        //   popular: 'DEFAULT',
        //   creationDateSortOption: 'DEFAULT',
        // },
        sortByPrice: 'DEFAULT',
        // sortByCreatedAt: 'DESC',
      };

      getAllProductsV2New(payload)
        .then((res) => {
          let d_img = 'https://i.imgur.com/dL4ScuP.png';
          const data = res?.data?.data?.data?.data;
          const inventoryData = res?.data?.data?.data?.response?.map((item) => item?.inventoryData);
          const length = res?.data?.data?.products?.length || 0;
          setEditProductData(data);
          const mappedData = data?.map((item) => {
            const matchedGtin = item?.variants.flatMap((variant) => variant?.barcodes);
            return {
              prodOptions: [],
              productName: item?.name || 'NA',
              quantity: '',
              unit: '',
              productPrice: '',
              gst: '',
              discount: '',
              vendorProductPrice: '',
              gtin: matchedGtin.length > 0 ? matchedGtin : 'NA',
              images: item?.variants[0]?.images?.front?.trim() || d_img,
              productExpiry: 'noExpiry',
              availableUnits: item?.variants[0]?.inventorySync?.availableQuantity || 0,
            };
          });
          setInputlist(mappedData || []);
          setAutoCompleteDetailsRowIndex(data?.map((e, i) => i));
        })
        .catch((err) => {});
    }
  }, [editGtin]);

  const handleTagEdit = (deleteTag) => {
    const editPayload = {
      tagId: tagId,
      tagName: tagName,
      tagIcon: tagIcon,
      tagStatus: 'Active',
      tagPriority: tagPriority || 0,
      orgId: orgId,
      locationId: locId,
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
      //   pinCodes: ['string'],
      gtins: inputlist?.flatMap((e) => e?.gtin || []).filter(Boolean),
      tags: [locId + '_' + inputValue.toUpperCase()],

      modifiedBy: createdById,
    };
    if (deleteTag === 'delete') {
      editPayload.isDeleted = true;
    }
    tagEdit(editPayload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/tag/filter');
      })
      .catch((err) => {});
  };

  const selectProduct = (item, index) => {
    const d_img = 'https://i.imgur.com/dL4ScuP.png';
    const list = [...inputlist];
    let availableUnits = 0;

    getInventoryDetails(locId, item?.gtin || '')
      .then((res) => {
        const data = res?.data?.data?.data?.multipleBatchCreations;
        if (data?.length > 0) {
          const newData = data?.map((row, index) => {
            availableUnits += row?.availableUnits || 0;
            return {
              ...row,
              expired: expireDateChecker(row?.expiryDate),
              index: index,
            };
          });

          const updatedData = getChipColor(newData);
          list[index].productExpiry = updatedData;
        }
      })
      .catch(() => {})
      .finally(() => {
        list[index].productName = item?.name || '';
        list[index].quantity = item?.weights_and_measures?.net_content || '';
        list[index].unit = item?.weights_and_measures?.measurement_unit || '';
        list[index].productPrice = item?.mrp?.mrp || '';
        list[index].gst = item?.igst || '';
        list[index].gtin = item?.gtin || '';
        list[index].productId = item?.productId || '';
        list[index].prodOptions = [];
        list[index].images =
          item?.images?.front || item?.images?.back || item?.images?.top_left || item?.images?.top_right || d_img;
        list[index].availableUnits = availableUnits || '';
        setInputlist(list);
        setAutoCompleteDetailsRowIndex((prev) => [...prev, index]);
      });
  };

  const handleListedOn = (selectedList) => {
    setListedOn(selectedList);
  };
  const handleClick = () => {
    setInputlist([
      ...inputlist,
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
        availableUnits: '',
        productExpiry: 'noExpiry',
      },
    ]);
  };

  const handleChange = (e, index) => {
    const searchText = e.target.value;
    let lowerCaseLocId = locId.toLocaleLowerCase();
    if (searchText) {
      const payload = {
        page: '1',
        pageSize: '10',

        names: [],
        brands: [],
        manufacturers: [],
        query: '',
        appCategories: {
          categoryLevel1: [],
          categoryLevel2: [],
          categoryLevel3: [],
        },
        productStatus: [],
        preferredVendors: [],
        sortByPrice: 'DEFAULT',
        // sortByCreatedAt: 'DESC',
        // displayWithoutInventoryProducts: true,
        storeLocations: [locId],
      };

      if (typeof searchText === 'string') {
        if (!isNaN(searchText)) {
          payload.barcode = [searchText];
        } else {
          payload.names = [searchText];
        }
      }
      //   setLoader(true);
      getAllProductsV2New(payload).then(function (response) {
        const data = response?.data?.data?.data?.data;
        // const inventoryData = response?.data?.data?.data?.response?.map((item) => item?.inventoryData);
        const list = [...inputlist];
        list[index].prodOptions = data?.flatMap((item, idx) =>
          item?.variants?.map((variant, variantIdx) => ({
            value: item?.name,
            label: `${variant?.barcodes?.[0]}  (${item?.name})`,
            name: item?.name,
            mrp: variant?.mrpData?.[0]?.mrp,
            gst: item?.taxReference?.taxRate,
            gtin: variant?.barcodes,
            images: item?.imageUrls,
            productId: item?.id,
          })),
        );
        setInputlist(list);
      });
    } else if (searchText == 0) {
      const list = [...inputlist];
      list[index].prodOptions = [];
      setInputlist(list);
    }
  };
  const handleSave = () => {
    const payload = {
      orgId: orgId,
      tagName: tagName,
      tagPriority: tagPriority || 0,
      tagIcon: tagIcon,
      locationId: locId,
      page: displayPage,
      listedOn: listedOn?.map((item) => item?.value) || [],
      gtins: inputlist?.flatMap((e) => e?.gtin || []).filter(Boolean),
      // productIds: [...new Set(inputlist?.map((item) => item?.productId) || [])],
      tags: [locId + '_' + inputValue.toUpperCase()],
      createdBy: createdById,
    };
    setLoader(true);
    tagCreationProduct(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success') {
          setAlertmessage('Tags Created Successful');
          setTimelineerror('success');
          setOpensnack(true);
        } else {
          setAlertmessage(res?.data?.data?.message);
          setTimelineerror('success');
          setOpensnack(true);
        }
        if (res?.data?.status === 'SUCCESS') {
          setTagName('');
          setInputValue('');
          setTagPriority('');
          setInputlist([
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
            },
          ]);
        }
        navigate('/pallet-hyperlocal/customize/tag/filter');
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const renderTagContent = (item) => {
    if (!item?.productName) {
      return <></>;
    }
    return (
      <p className={item?.availableUnits ? 'inventoryCountTag' : 'tagOutOfStock'}>
        {item?.availableUnits ? item?.availableUnits : 'Out of Stock'}
      </p>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {Array.from({ length: componentCount }).map((e, index) => (
        <Card style={{ marginBottom: '10px' }}>
          <Box className="search-bar-filter-container">
            <SoftTypography style={{ color: 'white', fontSize: '0.96rem' }}>Select Tag to Display</SoftTypography>
          </Box>
          <Box style={{ padding: '20px', marginBottom: '10px' }}>
            <Grid container spacing={2} style={{ dislay: 'flex' }}>
              <Grid item xs={12} md={6}>
                <FormField
                  autoFocus
                  margin="dense"
                  label="Tag Name"
                  placeholder="Tag Name eg: MOST POPULAR PRODUCTS"
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  maxWidth="sm"
                  //   sx={{ maxWidth: '300px !important' }}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography style={{ fontSize: '0.8rem', marginTop: '10px', marginBottom: '3px' }}>
                  Tag
                </SoftTypography>
                <SoftBox style={{ display: 'flex', flexDirection: 'column' }}>
                  <SoftInput
                    placeholder="Enter Tags for products"
                    label="Tags"
                    variant="outlined"
                    fullWidth
                    value={inputValue}
                    onChange={handleInputChange}
                    // sx={{ maxWidth: '300px !important' }}

                    //   onKeyDown={handleInputKeyDown}
                  >
                    {' '}
                  </SoftInput>
                  {/* <div style={{ marginTop: '5px' }}>
            {tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                style={{ marginRight: '8px', marginBottom: '8px' }}
              />
            ))}
          </div> */}
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <SoftTypography style={{ fontSize: '0.8rem', marginTop: '5px' }}> Tag Icon</SoftTypography>

                <SoftInput
                  type="text"
                  value={tagIcon}
                  placeholder="Tag Icon"
                  onChange={(e) => setTagIcon(e.target.value)}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <SoftTypography style={{ fontSize: '0.8rem', marginTop: '5px' }}> Tag Priority</SoftTypography>

                <SoftInput
                  type="number"
                  value={tagPriority}
                  placeholder="tag priority"
                  onChange={(e) => setTagPriority(e.target.value)}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <SoftTypography style={{ fontSize: '0.8rem', marginTop: '5px' }}>Display page</SoftTypography>

                <SoftInput
                  type="text"
                  value={displayPage}
                  placeholder="Enter page to display"
                  onChange={(e) => setDisplayPage(e.target.value)}
                ></SoftInput>
              </Grid>

              <Grid item xs={12} md={6}>
                <SoftTypography style={{ fontSize: '0.8rem', marginTop: '5px' }}> Listed on</SoftTypography>

                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  placeholder="Display on"
                  options={[
                    { value: 'B2C', label: 'B2C' },
                    { value: 'B2B', label: 'B2B' },
                    { value: 'RMS', label: 'RMS' },
                    { value: 'WMS', label: 'WMS' },
                    { value: 'VENDOR', label: 'VENDOR' },
                  ]}
                  isMulti={true}
                  value={listedOn}
                  onChange={handleListedOn}
                ></SoftSelect>
              </Grid>
            </Grid>
            <div
              style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <SoftTypography style={{ fontSize: '0.8rem', marginTop: '8px' }}> Select Products</SoftTypography>
              <SoftBox style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                              width: '175px',
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
                          style={{ width: 200 }}
                          renderInput={(params) => (
                            <TextField {...params} onChange={(e) => handleChange(e, i)} variant="outlined" fullWidth />
                          )}
                        />
                      )}
                    </SoftBox>
                  );
                })}
              </SoftBox>
              <SoftBox style={{ marginRight: 'auto' }}>
                <SoftTypography
                  className="add-more-text"
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  onClick={handleClick}
                  style={{ float: 'left', marginTop: '10px' }}
                >
                  +Add More Products
                </SoftTypography>
              </SoftBox>
            </div>
            <SoftBox style={{ textAlign: 'right' }}>
              {tagId && (
                <SoftButton color="info" variant="outlined" onClick={() => handleTagEdit('delete')}>
                  {loader ? <Spinner size={'1.3rem'} /> : 'Delete'}
                </SoftButton>
              )}

              <SoftButton
                color="info"
                onClick={tagId ? handleTagEdit : handleSave}
                style={{ backgroundColor: '#0562FB', marginLeft: '15px' }}
              >
                {loader ? <Spinner size={'1.3rem'} /> : 'Save'}
              </SoftButton>
            </SoftBox>
            <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
                {alertmessage}
              </Alert>
            </Snackbar>
          </Box>
        </Card>
      ))}

      {/* <CheckBoxAllProducts /> */}
      <br />
      <Card style={{ padding: '20px' }}>
        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginBottom: '10px' }}>
          Tags Preview
        </InputLabel>

        <SoftBox style={{ display: 'flex', flexDirection: 'Column' }}>
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#344767', marginBottom: '10px' }}>
            {tagName}
          </InputLabel>
          <SoftBox style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {inputlist?.map((item, index) => {
              return (
                <div style={{ position: 'relative' }}>
                  <div>
                    <SoftBox className="displayTagCard">
                      {item?.images && <img src={item?.images} alt="" style={{ width: '85px', height: '85px' }} />}
                      <InputLabel
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          color: '#344767',
                          marginBottom: '10px',
                          paddingLeft: '2px',
                          marginTop: '5px',
                        }}
                      >
                        {item?.productName}
                      </InputLabel>
                    </SoftBox>
                  </div>

                  <div style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                    {item?.productExpiry !== 'noExpiry' ? (
                      <SoftBox style={{ margin: '5px' }}>
                        <Chip
                          color={item?.productExpiry || 'error'}
                          label={`Expired

                          `}
                        />
                      </SoftBox>
                    ) : (
                      <>{renderTagContent(item)}</>
                    )}
                  </div>
                </div>
              );
            })}
          </SoftBox>
        </SoftBox>
      </Card>
      {/* 
      <SoftBox style={{ marginRight: 'auto' }}>
        <Button style={{ float: 'left', marginTop: '10px' }} onClick={handleAddComponent}>
          + add Tags Component{' '}
        </Button>
      </SoftBox> */}
    </DashboardLayout>
  );
};

export default TagsSelect;
