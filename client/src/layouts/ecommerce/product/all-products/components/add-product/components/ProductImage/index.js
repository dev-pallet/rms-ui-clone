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
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import './prodimage.css';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Grid } from './Grid';
import { Photo } from './Photo';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortablePhoto } from './SortablePhoto';
import { buttonStyles } from '../../../../../../Common/buttonColor';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import photos from './photos.json';

function ProductImage({
  images,
  setImages,
  isGen,
  setIsGen,
  blobImages,
  setBlobImages,
  selectedImages,
  setSelectedImages,
  setIsUpload,
  isUpload,
}) {
  const [items, setItems] = useState(photos);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedImages((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newArr = [...blobImages];
        const element = newArr[oldIndex];
        newArr.splice(oldIndex, 1);
        newArr.splice(newIndex, 0, element);
        setBlobImages(newArr);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragEnd(event) {
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  useEffect(() => {
    setSelectedImages(images);
  }, [images]);

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    // setBlobImages((prev) => [...prev, selectedFilesArray[0]]);
    selectedFilesArray.map((e) => {
      setBlobImages((prev) => [...prev, e]);
    });

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });

    setSelectedImages((previousImages) => previousImages.concat(imagesArray));

    // FOR BUG IN CHROME
    event.target.value = '';
  };

  function deleteHandler(index) {
    setSelectedImages(selectedImages.filter((e, i) => i !== index));
    setBlobImages(blobImages.filter((e, i) => i !== index));
    URL.revokeObjectURL(index);
  }

  const [imgaediv, setImgdiv] = useState(false);

  const handleImage = () => {
    setImgdiv(true);
  };

  const handleSaveImage = () => {
    setImgdiv(false);
  };
  const isMobileDevice = isSmallScreen();
  

  return (
    <Card sx={{ height: '100%' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
      <SoftBox p={3}>
        <SoftTypography variant="h5" fontWeight="bold">
          Product Image
        </SoftTypography>

        {imgaediv ? (
          <section>
            {selectedImages.length <= 8 ? (
              <SoftBox className="multiple-box">
                <label variant="body2" className="body-label">
                  <br />
                  Browse Image
                  <input
                    type="file"
                    name="images"
                    onChange={onSelectFile}
                    multiple
                    accept="image/png , image/jpeg, image/webp"
                  />
                </label>
              </SoftBox>
            ) : null}

            <br />

            {selectedImages.length > 0 &&
              (selectedImages.length > 8 ? (
                <p className="error">
                  Max 8 images is only allowed <br />
                  <span>Delete {selectedImages.length - 8} image</span>
                </p>
              ) : (
                ''
              ))}

            <div className="images-box">
              {/* {selectedImages &&
                selectedImages.map((image, index) => {
                  return (
                    <div key={image} className="image">
                      <img src={image} height="200" alt="" className="uil" />
                      <button onClick={() => deleteHandler(index)} className="del-btn">
                        <DeleteOutlineIcon />
                      </button>
                    </div>
                  );
                })} */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={selectedImages} strategy={() => {}}>
                  <Grid columns={2}>
                    {selectedImages.map((url, index) => (
                      <div key={url} className="image">
                        <SoftTypography variant="h7" fontWeight="bold">
                          {index == 0 ? (
                            <>1</>
                          ) : index == 1 ? (
                            <>2</>
                          ) : index == 2 ? (
                            <>3</>
                          ) : index == 3 ? (
                            <>4</>
                          ) : index == 4 ? (
                            <>5</>
                          ) : index == 5 ? (
                            <>6</>
                          ) : index == 6 ? (
                            <>7</>
                          ) : index == 7 ? (
                            <>8</>
                          ) : (
                            <></>
                          )}
                        </SoftTypography>
                        <SortablePhoto key={url} url={url} index={index} />
                        <button onClick={() => deleteHandler(index)} className="del-btn">
                          <DeleteOutlineIcon />
                        </button>
                      </div>
                    ))}
                  </Grid>
                </SortableContext>

                <DragOverlay adjustScale={false}>
                  {activeId ? (
                    <div
                      style={{
                        display: 'grid',
                        gridAutoColumns: 'auto',
                        gridAutoRows: 'auto',
                        height: '100%',
                      }}
                    >
                      <Photo url={activeId} />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </section>
        ) : (
          <>
            {selectedImages && (
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
            )}
            {selectedImages.length < 1 ? (
              <SoftBox>
                <SoftTypography variant="h6">No image available, upload an image.</SoftTypography>
              </SoftBox>
            ) : null}
          </>
        )}
        <br />

        <SoftBox display="flex">
          {selectedImages.length <= 8 ? (
            <SoftBox mr={1}>
              {imgaediv ? (
                <SoftButton color="info" size="small" onClick={handleSaveImage} variant={buttonStyles.primaryVariant} className="vendor-add-btn contained-softbutton">
                  save
                </SoftButton>
              ) : (
                <SoftButton
                  // variant="gradient"
                  disabled={isGen ? true : false}
                  color="info"
                  size="small"
                  onClick={handleImage}
                  variant={buttonStyles.primaryVariant}
                  className="vendor-add-btn contained-softbutton"
                >
                  Edit
                </SoftButton>
              )}
            </SoftBox>
          ) : null}
          <SoftButton
            // variant="outlined"
            // color="dark"
            disabled={isGen ? true : false}
            size="small"
            variant={buttonStyles.secondaryVariant}
            className="vendor-second-btn outlined-softbutton"
            onClick={() => {
              setSelectedImages([]);
              setBlobImages([]);
            }}
            sx={{
              flex: '1'
            }}
          >
            Delete All
          </SoftButton>
        </SoftBox>
      </SoftBox>
      {/* <SoftBox py={3}>
        <SoftBox display="flex" justifyContent="flex-end" m={2}>
           <Header /> 
        </SoftBox>
        <SoftBox
          position="relative"
          my={4}
          sx={({ palette: { light }, functions: { pxToRem }, borders: { borderRadius } }) => ({
            '& .react-kanban-column': {
              backgroundColor: light.main,
              width: pxToRem(750),
              margin: `0 ${pxToRem(10)}`,
              padding: pxToRem(20),
              borderRadius: borderRadius.lg,
            },
          })}
        ></SoftBox>
      </SoftBox> */}
    </Card>
  );
}

export default ProductImage;
