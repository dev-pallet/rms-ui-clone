import { Box, Card, Grid, Modal } from '@mui/material';
import React, { useState } from 'react';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SortablePhoto } from '../../../../../all-products/components/edit-product/SortablePhoto';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Photo } from '../../../../../all-products/components/edit-product/Photo';
import { uploadImageBase64 } from '../../../../../../../../config/Services';

const ProductVarientImagesUpload = ({
  index,
  openImageModal,
  handleCloseImageModal,
  productVariantArr,
  setProductVariantArr,
}) => {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setProductVariantArr((prevArr) => {
        const newArr = [...prevArr];
        const activeIndex = newArr[index]?.imageList?.indexOf(active.id);
        const overIndex = newArr[index]?.imageList?.indexOf(over.id);

        const draggedItem = newArr[index]?.imageList[activeIndex];
        newArr[index]?.imageList?.splice(activeIndex, 1);
        newArr[index]?.imageList?.splice(overIndex, 0, draggedItem);

        return newArr;
      });
    }
  };

  function handleDragEnd(event) {
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  // Remove the data URL prefix if present

  const removeDataURLPrefix = (base64String) => {
    return base64String.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
  };

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const base64Array = [];
    // const imagesArray = selectedFilesArray.map((file) => URL.createObjectURL(file));
    let imagesArray;
    selectedFilesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Array.push(reader.result);

        // Check if all files are processed
        if (base64Array.length === selectedFilesArray.length) {
          // Create the payload with Base64 images
          const imagePayload = {
            uploadType: 'VARIANT_IMAGES',
            images: {},
          };

          base64Array.forEach((base64String, index) => {
            imagePayload.images[`image${index + 1}`] = removeDataURLPrefix(base64String);
          });

          // Call the API with the payload
          uploadImageBase64(imagePayload)
            .then((res) => {
              const data = res?.data?.data?.data;
              if (data) {
                const imagesArray = Object.values(data);
                // Update productVariantArr with new images
                setProductVariantArr((prevArr) => {
                  const newArr = [...prevArr];
                  newArr[index] = { ...newArr[index], imageList: [...newArr[index].imageList, ...imagesArray] };
                  return newArr;
                });
              } else {
                console.error('No data found in response');
              }
            })
            .catch((err) => {
              console.error('Error uploading images:', err);
            });
        }
      };
      reader.onerror = (error) => {
        console.error('Error converting file to base64:', error);
      };
      reader.readAsDataURL(file);
    });
  };
  const deleteHandler = (imageIndex) => {
    setProductVariantArr((prevArr) => {
      const newArr = [...prevArr];
      const deletedImageURL = newArr[index]?.imageList[imageIndex];

      // Remove the image URL from the imageList
      newArr[index]?.imageList?.splice(imageIndex, 1);

      // Revoke the object URL to release memory
      URL.revokeObjectURL(deletedImageURL);

      return newArr;
    });
  };

  return (
    <Modal
      open={openImageModal}
      onClose={handleCloseImageModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
    >
      <Box
        className="pi-box-inventory"
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: '60vh',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Card sx={{ height: '100%' }}>
          <SoftBox p={1}>
            <SoftTypography variant="h5" fontWeight="bold">
              Product Image
            </SoftTypography>
            <section>
              {productVariantArr[index]?.imageList?.length <= 8 ? (
                <SoftBox className="multiple-box">
                  <label variant="body2" className="body-label">
                    <br />
                    Browse Images
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
            </section>

            {productVariantArr[index]?.imageList?.length > 0 &&
              (productVariantArr[index]?.imageList?.length > 8 ? (
                <p className="error">
                  Max 8 images are allowed <br />
                  <span>Delete {productVariantArr[index]?.imageList?.length - 8} image</span>
                </p>
              ) : (
                ''
              ))}
            <div className="images-box">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={productVariantArr[index]?.imageList || []} strategy={() => {}}>
                  <Grid container direction="row" justifyContent="flex-start" alignItems="center">
                    {productVariantArr[index]?.imageList ? (
                      productVariantArr[index]?.imageList.map((url, imageIndex) => (
                        <div key={url} className="image" style={{ width: '30%' }}>
                          <SoftTypography variant="h7" fontWeight="bold">
                            {imageIndex ? imageIndex + 1 : 1}
                          </SoftTypography>
                          <SortablePhoto key={url} url={url} index={imageIndex} />
                          <button onClick={() => deleteHandler(imageIndex)} className="del-btn">
                            <DeleteOutlineIcon />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No images available</p> // You can customize this message or rendering for no images
                    )}
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
          </SoftBox>
        </Card>
      </Box>
    </Modal>
  );
};

export default ProductVarientImagesUpload;
