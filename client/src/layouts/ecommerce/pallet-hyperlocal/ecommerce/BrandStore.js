import { Card, Grid, InputLabel } from '@mui/material';
import { CircularProgressWithLabel } from '../../../dashboards/default/components/circular-progrss';
import { brandCreation, brandFilter, editBrandStore, uploadBannerImage } from '../../../../config/Services';
import { buttonStyles } from '../../Common/buttonColor';
import { useNavigate, useParams } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Fade from '@mui/material/Fade';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  //   border: '2px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  //   p: 4,
};

const BrandStore = () => {
  const { brandId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const [imgUrlToogle, setimgUrgToogle] = useState([]);
  const [rowCount, setRowCount] = useState(1);
  const [brandName, setBrandNames] = useState([]);
  const [imgType, setImgType] = useState([]);
  const [blobImages, setBlobImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [clickableUrl, setClickableUrl] = useState([]);
  const [open, setOpen] = useState([]);
  const [showProgress, setShowProgresss] = useState(false);
  const navigate = useNavigate();
  const [displayPage, setDisplayPage] = useState('');
  const [listedOn, setListedOn] = useState([]);

  const handleListedOn = (selectedList) => {
    setListedOn(selectedList);
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 10,

      sourceId: [orgId],
      sourceLocationId: [locId],
      brandStoreId: [brandId],
      sort: {
        creationDateSortOption: 'DEFAULT',
        tagPriority: 'DEFAULT',
      },
    };
    if (brandId?.length) {
      brandFilter(payload)
        .then((res) => {
          //   setBrandDetails(res?.data?.data?.data?.data);
          setBrandNames([res?.data?.data?.data?.data[0]?.brandName]);
          setListedOn(
            res?.data?.data?.data?.data[0].listedOn?.map((item) => ({
              value: item,
              label: item,
            })) || [],
          );

          setDisplayPage(res?.data?.data?.data?.data[0].page || '');
          setClickableUrl([res?.data?.data?.data?.data[0]?.clickableUrl]);
          setimgUrgToogle(['url']);
          setImageUrls([res?.data?.data?.data?.data[0]?.image]);
          setSelectedImages([res?.data?.data?.data?.data[0]?.image]);
          setBlobImages([' ']);
        })
        .catch((err) => {});
    }
  }, [brandId]);

  const handleOpen = (index) => {
    const updatedOpen = open.map((item, i) => (i === index ? true : false));
    setOpen(updatedOpen);
  };

  const handleClose = (index) => {
    const updatedOpen = open.map((item, i) => i === index && false);
    setOpen(updatedOpen);
  };

  useEffect(() => {
    let data = [...open];
    data = Array.from({ length: rowCount }, () => false);
    setOpen(data);
  }, [rowCount]);

  const handleDrop = (e, index) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles, index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleUploadImage = (index) => {
    const data = [...selectedImages];

    setShowProgresss(true);
    const formData = new FormData();
    const payload = {
      path: 'BANNER',
      sourceId: orgId,
      sourceLocationId: locId,
    };
    formData.append(
      'anyFileUploadModel',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    if (blobImages.length === 0) {
      formData.append('file', []);
    } else {
      formData.append('file', blobImages[index]);
    }
    uploadBannerImage(formData)
      .then((res) => {
        data[index] = res?.data?.data?.fileUrl;
        setSelectedImages(data);
      })
      .catch((err) => {});

    setShowProgresss(false);

    handleClose();
  };

  const handleAddmore = () => {
    setRowCount(rowCount + 1);
  };

  const handleFileSelect = (selectedFiles, index) => {
    const selectedFilesArray = Array.from(selectedFiles);

    selectedFilesArray.map((e) => {
      setBlobImages((prev) => {
        const newImages = [...prev];
        newImages.splice(index, 1, e);
        return newImages;
      });
    });

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });

    setSelectedImages((previousImages) => {
      const newImages = [...previousImages];
      newImages.splice(index, 1, ...imagesArray);
      return newImages;
    });
  };

  const onSelectFile = (event, index) => {
    const selectedFiles = event.target.files;
    handleFileSelect(selectedFiles, index);

    event.target.value = '';
  };
  const handleBrandCreation = () => {
    const brandPayload = Array.from({ length: rowCount }).map((e, index) => ({
      brandName: brandName[index],
      brandHeader: '',
      image: selectedImages[index],
      clickableUrl: clickableUrl[index],
      sourceLocationId: locId,
      sourceId: orgId,
      createdBy: uidx,
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
    }));

    brandCreation(brandPayload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/brand/preview');
      })
      .catch((err) => {});
  };

  const handleEditBrand = () => {
    const payload = {
      brandStoreId: brandId,
      brandName: brandName[0],
      brandHeader: '',
      image: selectedImages[0],
      clickableUrl: clickableUrl[0],
      isActive: true,
      sourceId: orgId,
      sourceLocationId: locId,
      modifiedBy: uidx,
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
    };
    editBrandStore(payload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/brand/preview');
      })
      .catch(() => {});
  };

  const handleDelete = () => {
    const payload = {
      brandStoreId: brandId,
      brandName: brandName[0],
      brandHeader: '',
      image: selectedImages[0],
      clickableUrl: clickableUrl[0],
      isActive: false,
      sourceId: orgId,
      sourceLocationId: locId,
      modifiedBy: uidx,
      isDeleted: true,
    };
    editBrandStore(payload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/brand/preview');
      })
      .catch(() => {});
  };

  const handleSave = () => {
    if (brandId?.length) {
      handleEditBrand();
    } else {
      handleBrandCreation();
    }
  };

  const handleImgKeyDown = (e, index) => {
    const imageData = [...selectedImages];
    const blobData = [...blobImages];
    imageData.splice(index, 1, e.target.value);
    blobData.splice(index, 1, '');
    setBlobImages(blobData);
    setSelectedImages(imageData);
    setImageUrls(imageData);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <Card>
        <Box className="search-bar-filter-container">
          <SoftTypography style={{ color: 'white', fontSize: '0.95rem' }}>Brand Store </SoftTypography>
        </Box>
        <Grid container spacing={2} style={{ padding: '15px' }}>
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

        <Box style={{ padding: '15px' }}>
          {Array.from({ length: rowCount }).map((e, index) => (
            <Grid
              key={index}
              container
              spacing={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                margin: '1px',
                width: 'auto !important',
              }}
            >
              <Grid item xs={12} md={3} sx={{ padding: '0 !important' }}>
                {index === 0 && (
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Brand Name</InputLabel>
                )}
                <SoftInput
                  type="text"
                  value={brandName[index]}
                  placeholder="brand name"
                  onChange={(e) => {
                    const updatedBrands = [...brandName];
                    updatedBrands[index] = e.target.value;
                    setBrandNames(updatedBrands);
                  }}
                ></SoftInput>
              </Grid>

              <Grid item xs={12} md={3} sx={{ padding: '0 !important' }}>
                {index === 0 && (
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Clickable Link
                  </InputLabel>
                )}

                <SoftInput
                  placeholder="clickable Link"
                  value={clickableUrl[index]}
                  onChange={(e) => {
                    const updatedUrls = [...clickableUrl];
                    updatedUrls[index] = e.target.value;
                    setClickableUrl(updatedUrls);
                  }}
                ></SoftInput>
              </Grid>

              <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', padding: '0 !important' }}>
                {index === 0 && (
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Image Type
                  </InputLabel>
                )}

                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  value={imgUrlToogle[index]}
                  placeholder="File or url"
                  onChange={(e) => {
                    const toggleData = [...imgUrlToogle];
                    if (e.value === 'UploadImg') {
                      toggleData[index] = 'img';
                      setimgUrgToogle(toggleData);
                    } else {
                      toggleData[index] = 'url';
                      setimgUrgToogle(toggleData);
                    }
                  }}
                  options={[
                    { value: 'UploadImg', label: 'Upload IMG' },
                    { value: 'UploadUrl', label: 'Upload URL' },
                  ]}
                  // onChange={(option) => setPackagingType(option)}
                ></SoftSelect>
              </Grid>

              {imgUrlToogle[index] === 'url' ? (
                <Grid item xs={12} md={3} sx={{ padding: '0 !important' }}>
                  {index === 0 && (
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Brand Logo
                    </InputLabel>
                  )}

                  <SoftInput
                    placeholder="Upload url"
                    style={{ minWidth: '250px' }}
                    value={imageUrls[index]}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleImgKeyDown(e, index);
                      }
                    }}
                  ></SoftInput>
                </Grid>
              ) : (
                <Grid item xs={12} md={3} sx={{ padding: '0 !important' }}>
                  {index === 0 && (
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Brand Logo
                    </InputLabel>
                  )}

                  <SoftButton
                    onClick={() => handleOpen(index)}
                    color="info"
                    style={{ backgroundColor: '#0562FB', width: '100%' }}
                  >
                    Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="large" />{' '}
                  </SoftButton>
                </Grid>
              )}

              <div>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open[index]}
                  onClose={() => handleClose(index)}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Fade in={open[index]}>
                    <Box sx={style}>
                      <SoftTypography style={{ fontWeight: 'bold', margin: '16px' }}>Upload Image</SoftTypography>

                      <hr />
                      {selectedImages[index] && (
                        <SoftBox style={{ margin: '16px' }}>
                          <InputLabel
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginBottom: '10px' }}
                          >
                            Image Preview
                          </InputLabel>
                          <SoftBox
                            component="img"
                            src={selectedImages[index]}
                            key={index}
                            alt=""
                            borderRadius="lg"
                            shadow="lg"
                            width="100%"
                            height="170px"
                            //   my={3}
                            mr={2}
                          />
                        </SoftBox>
                      )}

                      <SoftBox style={{ margin: '16px' }}>
                        <InputLabel
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginBottom: '10px' }}
                        >
                          Upload Photo
                        </InputLabel>
                        <SoftBox
                          style={{
                            border: 'dashed #3872e8 2px',
                            borderRadius: '8px',
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: '20px',
                          }}
                          onDrop={(e, index) => handleDrop(e, index)}
                          onDragOver={handleDragOver}
                        >
                          <SoftBox>
                            <InsertPhotoOutlinedIcon fontSize="large" />
                          </SoftBox>
                          <SoftBox>
                            <SoftTypography style={{ fontSize: '0.9rem', color: 'gray', fontWeight: '600' }}>
                              {' '}
                              <label style={{ color: '#455af7', textDecoration: 'underline', cursor: 'pointer' }}>
                                Click to upload{' '}
                                <input
                                  type="file"
                                  name="images"
                                  onChange={(event) => onSelectFile(event, index)}
                                  accept="image/png, image/jpeg, image/webp"
                                />
                              </label>{' '}
                              or drag and drop
                            </SoftTypography>
                          </SoftBox>
                          <SoftBox>
                            <SoftTypography style={{ fontSize: '0.75rem', color: 'gray' }}>
                              {' '}
                              Recommended Size 400 x 400
                            </SoftTypography>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                      <SoftBox style={{ float: 'right', margin: '10px' }}>
                        {showProgress && <CircularProgressWithLabel value={50} />}
                        <SoftButton
                          color="info"
                          onClick={() => handleUploadImage(index)}
                          style={{ backgroundColor: '#0562FB' }}
                        >
                          Save
                        </SoftButton>
                      </SoftBox>
                    </Box>
                  </Fade>
                </Modal>
              </div>
            </Grid>
          ))}{' '}
        </Box>

        {!brandId && (
          <SoftTypography 
            className="add-more-text"
            component="label"
            variant="caption"
            fontWeight="bold"
            sx={{ marginLeft: '15px', marginRight: 'auto' }} 
            onClick={handleAddmore}
          >
            + Add More
          </SoftTypography>
        )}
        <SoftBox style={{ marginLeft: 'auto', padding: '15px' }}>
          {brandId && (
            <SoftButton 
              // color="error" 
              variant={buttonStyles.outlinedColor}
              className="outlined-softbutton"
              onClick={handleDelete} 
              style={{ marginInline: '15px' }}
            >
              Delete
            </SoftButton>
          )}

          <SoftButton color="info" style={{ backgroundColor: '#0562FB' }} onClick={handleSave}>
            Save
          </SoftButton>
        </SoftBox>
      </Card>

      <Card style={{ padding: '20px', marginTop: '20px' }}>
        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginBottom: '10px' }}>
          Brands Preview
        </InputLabel>
        <SoftBox style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          {Array.from({ length: rowCount }).map(
            (e, index) =>
              selectedImages[index] && (
                <SoftBox key={index}>
                  <img src={selectedImages[index]} style={{ borderRadius: '50%', height: '100px', width: '100px' }} />
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px' }}>
                    {brandName[index]}
                  </InputLabel>
                </SoftBox>
              ),
          )}
        </SoftBox>
      </Card>
    </DashboardLayout>
  );
};

export default BrandStore;
