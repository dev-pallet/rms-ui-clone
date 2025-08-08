import { Card, Grid, InputLabel } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { buttonStyles } from '../../Common/buttonColor';
import { createBanner, editPrevBanner, previewBanner, uploadBannerImage } from '../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Fade from '@mui/material/Fade';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import Modal from '@mui/material/Modal';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
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

const BannerSelection = () => {
  const [blobImages, setBlobImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [clickableUrl, setClickableUrl] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageType, setImageType] = useState('');
  const [uploadType, setUploadType] = useState([]);
  const [carouselCount, setCarouselCount] = useState(1);
  const [componentCount, setComponentCount] = useState(1);
  const [open, setOpen] = useState([]);
  const [showProgress, setShowProgresss] = useState(false);
  const [listedOn, setListedOn] = useState([]);
  const [displayPage, setDisplayPage] = useState('');
  const [loader, setLoader] = useState(false);
  const [bannerName, setBannerName] = useState('');
  const [prevData, setPrevData] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const navigate = useNavigate();
  const { bannerId } = useParams();  
  const showSnackbar = useSnackbar();

  const handleOpen = (index) => {
    const updatedOpen = open.map((item, i) => (i === index ? true : false));
    setOpen(updatedOpen);
  };

  const handleClose = (index) => {
    const updatedOpen = open.map((item, i) => i === index && false);
    setOpen(updatedOpen);
  };

  useEffect(() => {
    if (bannerId?.length) {
      const payload = {
        page: 1,
        pageSize: 10,
        bannerId: [bannerId],
        sourceId: [orgId],
        sourceLocationId: [locId],
        sort: {
          creationDateSortOption: 'DEFAULT',
          tagPriority: 'DEFAULT',
        },
      };
      previewBanner(payload)
        .then((res) => {
          setPrevData(res?.data?.data?.data?.data);
          if (res?.data?.data?.data?.data[0]?.bannerImage?.length >= 1) {
            setUploadType(res?.data?.data?.data?.data[0]?.bannerImage?.map(() => 'UPLOADURL'));
            setCarouselCount(res?.data?.data?.data?.data[0]?.bannerImage?.length);
            setImageType('CAROUSEL');
            const imageData = res?.data?.data?.data?.data[0]?.bannerImage?.map((e) => e?.image);
            setSelectedImages(imageData);
            setImageUrls(imageData);
            setClickableUrl(res?.data?.data?.data?.data[0]?.bannerImage?.map((e) => e?.clickableUrl || ''));
            setBlobImages(res?.data?.data?.data?.data[0]?.bannerImage?.map((e) => ''));
            setBannerName(res?.data?.data?.data?.data[0]?.bannerName || '');
            setListedOn(
              res?.data?.data?.data?.data[0]?.listedOn?.map((item) => ({
                value: item,
                label: item,
              })) || [],
            );

            setDisplayPage(res?.data?.data?.data?.data[0]?.page || '');
          }
        })
        .catch(() => {});
    }
  }, [bannerId, imageType]);

  useEffect(() => {
    let data = [...open];
    data = Array.from({ length: carouselCount }, () => false);
    setOpen(data);
  }, [carouselCount]);

  const handleAddComponent = () => {
    setComponentCount(componentCount + 1);
  };

  const handleUploadImage = (index) => {
    setLoader(true);
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
        setLoader(false);
        handleClose();
        showSnackbar('Image Uploaded ✅', 'success');
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar('Try again', 'error');
      });

    setShowProgresss(false);
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

  const handleDrop = (e, index) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles, index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleAddmore = () => {
    setCarouselCount(carouselCount + 1);
  };

  useEffect(() => {
    setCarouselCount(1);
    setSelectedImages([]);
  }, [imageType]);

  const handleImgKeyDown = (e, index) => {
    const imageData = [...selectedImages];
    const blobData = [...blobImages];
    imageData.splice(index, 1, e.target.value);
    blobData.splice(index, 1, '');
    setBlobImages(blobData);
    setSelectedImages(imageData);
    setImageUrls(imageData);
  };

  const editBannerData = () => {
    const payload = {
      bannerId: bannerId,
      bannerName: bannerName,
      bannerImage: Array.from({ length: carouselCount }).map((e, index) => ({
        image: selectedImages[index],
        clickableUrl: clickableUrl[index],
      })),
      type: 'string',
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
      sourceId: orgId,
      sourceLocationId: locId,
      // createdBy: createdById,
      modifiedBy: createdById,
    };

    editPrevBanner(payload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/banner/available');
      })
      .catch((err) => {});
  };
  const handleBannerCreation = () => {
    const payload = {
      bannerName: bannerName,
      bannerImage: Array.from({ length: carouselCount }).map((e, index) => ({
        image: selectedImages[index],
        clickableUrl: clickableUrl[index],
      })),
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
      sourceId: orgId,
      sourceLocationId: locId,
      createdBy: createdById,
    };

    createBanner(payload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/banner/available');
      })
      .catch((err) => {});
  };
  const handleDeleteBanner = () => {
    const payload = {
      bannerId: bannerId,
      bannerName: bannerName,
      bannerImage: Array.from({ length: carouselCount }).map((e, index) => ({
        image: selectedImages[index],
        clickableUrl: clickableUrl[index],
      })),
      type: 'string',
      sourceId: orgId,
      sourceLocationId: locId,
      // createdBy: createdById,
      modifiedBy: createdById,
      isDeleted: true,
    };

    editPrevBanner(payload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/banner/available');
      })
      .catch((err) => {});
  };
  const handleSave = () => {
    if (bannerId?.length) {
      editBannerData();
    } else {
      handleBannerCreation();
    }
  };
  const handleListedOn = (selectedList) => {
    setListedOn(selectedList);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {Array.from({ length: componentCount }).map((e, index) => (
        <Card sx={{ marginBottom: '15px' }}>
          <div
            className="search-bar-filter-container"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <SoftTypography style={{ color: 'white', fontSize: '0.95rem' }}>
              Banner Selection {index >= 1 ? index + 1 : ''}
            </SoftTypography>

            <SoftSelect
              insideHeader={true}
              menuPortalTarget={document.body}
              id="status"
              placeholder="Select no of Images"
              options={[
                { value: 'SINGLE', label: 'Single Image' },
                { value: 'CAROUSEL', label: 'Carousel' },
              ]}
              onChange={(option) => setImageType(option.value)}
            ></SoftSelect>
          </div>
          <Box style={{ padding: '20px', marginBottom: '10px' }}>
            <SoftBox style={{ marginLeft: '10px' }}>
              <SoftTypography style={{ fontSize: '0.75rem', color: 'gray' }}>
                {' '}
                Recommended Size 1600 x 400
              </SoftTypography>
            </SoftBox>

            <Grid container style={{ padding: '15px', marginTop: '1px' }}>
              <Grid item xs={12}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Banner Name</InputLabel>
                <SoftInput value={bannerName} onChange={(e) => setBannerName(e.target.value)}></SoftInput>
              </Grid>
            </Grid>

            <Grid container style={{ padding: '15px' }} spacing={2}>
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
            <hr style={{ opacity: 0.3, width: '100%', margin: '6px' }} />

            {Array.from({ length: carouselCount }).map((e, index) => (
              <Grid
                container
                spacing={2}
                style={{ display: 'flex', alignItems: 'center', marginTop: '-5px', marginLeft: '-2px' }}
              >
                <Grid item xs={12} md={4}>
                  {index === 0 && (
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Clickable Url
                    </InputLabel>
                  )}
                  <SoftInput
                    placeholder="Clickable URL"
                    value={clickableUrl[index]}
                    onChange={(e) => {
                      const updatedUrls = [...clickableUrl];
                      updatedUrls[index] = e.target.value;
                      setClickableUrl(updatedUrls);
                    }}
                  ></SoftInput>
                  {/* <ClickableLinkModal setClickableUrl={setClickableUrl} clickableUrl={clickableUrl}/> */}
                </Grid>
                <Grid
                  key={index}
                  item
                  xs={12}
                  md={3}
                  //   className="multiple-box"
                >
                  {index === 0 && (
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Image Type
                    </InputLabel>
                  )}
                  <SoftSelect
                    menuPortalTarget={document.body}
                    id="status"
                    placeholder="Img / Url"
                    options={[
                      { value: 'UPLOADIMG', label: 'Upload Img' },
                      { value: 'UPLOADURL', label: 'Upload Url' },
                    ]}
                    onChange={(option) => {
                      const uploadData = [...uploadType];
                      uploadData[index] = option.value;
                      setUploadType(uploadData);
                    }}
                  ></SoftSelect>
                </Grid>
                <Grid
                  key={index}
                  item
                  xs={12}
                  md={5}
                  //   className="multiple-box"
                >
                  <SoftBox style={{ display: 'flex', gap: '10px' }}>
                    <SoftBox style={{ marginTop: '3px', width: '100%', display: 'flex', flexDirection: 'column' }}>
                      {index === 0 && (
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                          Banner Image
                        </InputLabel>
                      )}
                      {uploadType[index] === 'UPLOADURL' ? (
                        <SoftInput
                          placeholder="Upload Url"
                          value={imageUrls[index]}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleImgKeyDown(e, index);
                            }
                          }}
                        >
                          {' '}
                        </SoftInput>
                      ) : (
                        //   <SoftBox className="multiple-box" style={{ width: '100%', height: 'auto' }}>
                        //     <label variant="body2" className="body-label">
                        //       <br />
                        //       Upload Banner
                        //       <input
                        //         type="file"
                        //         name="images"
                        //         onChange={onSelectFile}
                        //         accept="image/png, image/jpeg, image/webp"
                        //       />
                        //     </label>
                        //   </SoftBox>
                        <SoftButton
                          onClick={() => handleOpen(index)}
                          color="info"
                          style={{ backgroundColor: '#0562FB', marginRight: '15px' }}
                        >
                          Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="large" />{' '}
                        </SoftButton>
                      )}
                    </SoftBox>

                    {selectedImages[index] && (
                      <SoftBox>
                        {' '}
                        {index === 0 && (
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Preview
                          </InputLabel>
                        )}
                        <SoftBox
                          component="img"
                          src={selectedImages[index]}
                          key={index}
                          alt=""
                          borderRadius="lg"
                          shadow="lg"
                          width="130px"
                          height="50px"
                          //   my={3}
                          mr={2}
                        />
                      </SoftBox>
                    )}
                  </SoftBox>

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
                                      accept="image/png, image/jpeg, image/webp, image/gif"
                                    />
                                  </label>{' '}
                                  or drag and drop
                                </SoftTypography>
                              </SoftBox>
                              <SoftBox>
                                <SoftTypography style={{ fontSize: '0.75rem', color: 'gray' }}>
                                  {' '}
                                  Recommended Size 1600 x 400
                                </SoftTypography>
                              </SoftBox>
                            </SoftBox>
                          </SoftBox>
                          <SoftBox style={{ float: 'right' }}>
                            {loader ? (
                              <SoftButton style={{ margin: '15px' }}>
                                <Spinner size={20} />
                              </SoftButton>
                            ) : (
                              <SoftButton
                                color="info"
                                onClick={() => handleUploadImage(index)}
                                style={{ backgroundColor: '#0562FB', margin: '15px' }}
                              >
                                Save
                              </SoftButton>
                            )}
                          </SoftBox>
                        </Box>
                      </Fade>
                    </Modal>
                  </div>
                </Grid>
              </Grid>
            ))}

            {imageType === 'CAROUSEL' && (
              <SoftTypography
                className="add-more-text"
                component="label"
                variant="caption"
                fontWeight="bold"
                sx={{ margin: '10px', marginRight: 'auto' }}
                onClick={handleAddmore}
              >
                + Add More
              </SoftTypography>
            )}

            {/* {selectedImages && (
        <SoftBox>
          {selectedImages.map((e) => {
            return (
              <SoftBox
                component="img"
                src={e}
                key={e}
                alt=""
                borderRadius="lg"
                shadow="lg"
                width="100px"
                height="100px"
                my={3}
                mr={2}
              />
            );
          })}
        </SoftBox>
      )} */}
            <SoftBox style={{ textAlign: 'right', marginTop: '20px' }}>
              {bannerId && (
                <SoftButton
                  // color="error"
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton"
                  onClick={handleDeleteBanner}
                  style={{ marginInline: '15px' }}
                >
                  Delete
                </SoftButton>
              )}

              <SoftButton color="info" onClick={handleSave} style={{ backgroundColor: '#0562FB' }}>
                Save
              </SoftButton>
            </SoftBox>
          </Box>
        </Card>
      ))}

      {selectedImages.length > 0 && (
        <Card style={{ padding: '20px' }}>
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginBottom: '10px' }}>
            Carousel Preview
          </InputLabel>
          <Splide
            style={{ width: '100%' }}
            options={{
              padding: imageType === 'CAROUSEL' ? '3rem' : '1rem',
              type: 'loop',
              perPage: 1,
              perMove: 1,
              interval: 2500,
              autoplay: true,
              pagination: false,
            }}
            aria-label="My Favorite Images"
          >
            {selectedImages?.map((image, index) => (
              <SplideSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  style={{ height: '300px', width: '97%', borderRadius: '20px', objectFit: 'contain' }}
                  src={image}
                  alt={`Image ${index + 1}`}
                />
              </SplideSlide>
            ))}
          </Splide>
        </Card>
      )}

      {/* <SoftBox style={{ marginRight: 'auto' }}>
        <Button style={{ float: 'left', marginTop: '10px' }} onClick={handleAddComponent}>
          + add Banner Component{' '}
        </Button>
      </SoftBox> */}
    </DashboardLayout>
  );
};

export default BannerSelection;
