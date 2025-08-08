import Board, { moveCard } from '@asseinfo/react-kanban';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Card, Grid, InputLabel } from '@mui/material';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import { createB2cContent, editB2cContent, filterB2cContent } from '../../../../config/Services';
import './customizeb2c.css';
import AvailableBanner from './DragDropb2c_Components/AvailableBanner';
import AvailableBrands from './DragDropb2c_Components/AvailableBrands';
import AvailableCategory from './DragDropb2c_Components/AvailableCategory';
import AvailableTags from './DragDropb2c_Components/AvailableTags';
import SelectAvailableBanner from './DragDropb2c_Components/SelectAvailableBanner';
import SelectAvailableBrand from './DragDropb2c_Components/SelectAvailableBrand';
import SelectAvailableCategories from './DragDropb2c_Components/SelectAvailableCategories';
import SelectAvailableTags from './DragDropb2c_Components/SelectAvailableTags';
import Spinner from '../../../../components/Spinner';

const ModifyContent = ({ selectedPage, selectedApp }) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const [reloadData, setReloadData] = useState(false);
  const [contentId, setContentId] = useState('');
  const [contentData, setContentData] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [contentType, setContentType] = useState();
  const [contentTypeId, setContentTypeId] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);
  const [contentItems, setContentItems] = useState(['Banner', 'Categories', 'Brand', 'Tags']);
  const [updatedContentIndex, setUpdatedContentIndex] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [deleteIcon, setDeleteIcon] = useState(false);
  const [loader, setLoader] = useState(false);
  const [columnData, setColumnData] = useState([
    {
      id: 1,
      title: 'Components',
      cards: [],
    },
  ]);
  const board = {
    columns: columnData,
  };

  function onComponentChange(_card, source, destination) {
    const updatedBoard = moveCard(board, source, destination);
    setColumnData(updatedBoard?.columns);
    handleEditContent(updatedBoard?.columns);
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContentType = (type) => {
    setContentType(type);
    handleClose();
  };

  const handleComponentDelete = (componentId, type) => {
    const newArray = columnData[0]?.cards.filter((item) => !(item.title === type && item.id === componentId));
    const data = [
      {
        id: 1,
        title: 'Components',
        cards: newArray,
      },
    ];
    handleEditContent(data);
    if (newArray) {
      setColumnData(data);
    }
  };

  const renderDecriptionComponent = (type, typeId) => {
    if (type === 'BANNER') {
      return (
        <div style={{ position: 'relative' }}>
          <div>
            <AvailableBanner typeId={typeId} />
          </div>
          {deleteIcon && (
            <div style={{ position: 'absolute', top: '3px', right: '3px' }}>
              <DeleteIcon sx={{ color: 'red' }} onClick={() => handleComponentDelete(typeId, type)} />{' '}
            </div>
          )}
        </div>
      );
    } else if (type === 'CATEGORY') {
      return (
        <div style={{ position: 'relative' }}>
          <div>
            <AvailableCategory setCategoryId={setCategoryId} typeId={typeId} />
          </div>
          {deleteIcon && (
            <div style={{ position: 'absolute', top: '3px', right: '3px' }}>
              <DeleteIcon sx={{ color: 'red' }} onClick={() => handleComponentDelete(typeId, type)} />{' '}
            </div>
          )}
        </div>
      );
    } else if (type === 'TAGS') {
      return (
        <div style={{ position: 'relative' }}>
          <div>
            <AvailableTags typeId={typeId} />
          </div>
          {deleteIcon && (
            <div style={{ position: 'absolute', top: '3px', right: '3px' }}>
              <DeleteIcon sx={{ color: 'red' }} onClick={() => handleComponentDelete(typeId, type)} />{' '}
            </div>
          )}
        </div>
      );
    } else if (type === 'BRANDS') {
      return (
        <div style={{ position: 'relative' }}>
          <div>
            <AvailableBrands />
          </div>
          {deleteIcon && (
            <div style={{ position: 'absolute', top: '3px', right: '3px' }}>
              <DeleteIcon sx={{ color: 'red' }} onClick={() => handleComponentDelete(typeId, type)} />{' '}
            </div>
          )}
        </div>
      );
    }
  };
  const handleFetchContentData = () => {
    setLoader(true);
    const payload = {
      contentSourceId: [orgId],
      contentSourceLocationId: [locId],
      contentPage: [selectedPage?.value],
      contentType: [selectedApp?.value],
    };
    filterB2cContent(payload)
      .then((res) => {
        setLoader(false);
        setContentId(res?.data?.data?.data?.data[0]?.contentId || '');
        setContentData(res?.data?.data?.data?.data[0]?.contentData?.map((item) => item?.type) || []);

        const columnApiData = res?.data?.data?.data?.data[0]?.contentData?.map((item, index) => ({
          id: item?.idOfData || index,
          title: item?.type,
          description: renderDecriptionComponent(item?.type, item?.idOfData),
        }));

        const data = [
          {
            id: 1,
            title: 'Components',
            cards: columnApiData,
          },
        ];
        if (columnApiData?.length > 0) {
          setColumnData(data);
        } else {
          setColumnData([
            {
              id: 1,
              title: 'Components',
              cards: [],
            },
          ]);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };
  // fetching content from api
  useEffect(() => {
    handleFetchContentData();
  }, [reloadData, deleteIcon, selectedPage, selectedApp]);

  const handleCreateContent = () => {
    const payload = {
      //   contentId: 'string',
      contentName: 'CONTENT_CREATION',
      contentType: selectedApp?.value,
      contentPage: selectedPage?.value,
      contentSource: 'RETAIL',
      contentSourceId: orgId,
      contentSourceLocationId: locId,
      contentData: [
        // {
        //   type: 'Banner',
        //   //   idOfData: '',
        //   priority: 0,
        // },
      ],
      isActive: true,
      createdBy: uidx,
      //   isDeleted: true,
    };
    createB2cContent(payload)
      .then((res) => {
        setReloadData(!reloadData);
      })
      .catch(() => {});
  };

  const handleEditContent = (contentData) => {
    const data = contentData[0]?.cards?.map((item, index) => ({
      type: item?.title,
      idOfData: item?.id,
      priority: index,
    }));

    const payload = {
      contentId: contentId,
      contentName: 'CONTENT_CREATION',
      contentType: selectedApp?.value,
      contentPage: selectedPage?.value,
      contentSource: 'RETAIL',
      contentSourceId: orgId,
      contentSourceLocationId: locId,
      contentData: data,
      isActive: true,
      createdBy: uidx,
    };
    editB2cContent(payload)
      .then((res) => {
        // setReloadData(!reloadData)
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (contentTypeId?.length > 0) {
      handleCombineSelectData(contentTypeId);
    }
  }, [contentTypeId]);
  const handleCombineSelectData = (contentData) => {
    const data = columnData?.[0]?.cards?.map((item, index) => ({
      type: item?.title,
      idOfData: item?.id,
      priority: index,
    }));
    let combineData;

    if (contentData?.length > 0) {
      combineData = [...data, ...contentData];
    } else {
      combineData = [...data];
    }

    const columnSelectData = combineData?.map((item, index) => ({
      id: item?.idOfData || index,
      title: item?.type,
      description: renderDecriptionComponent(item?.type, item?.idOfData),
    }));

    const tempData = [
      {
        id: 1,
        title: 'Components',
        cards: columnSelectData,
      },
    ];
    if (columnSelectData?.length > 0) {
      setColumnData(tempData);
    }

    const payload = {
      contentId: contentId,
      contentName: 'CONTENT_CREATION',
      contentType: selectedApp?.value,
      contentPage: selectedPage?.value,
      contentSource: 'RETAIL',
      contentSourceId: orgId,
      contentSourceLocationId: locId,
      contentData: combineData,
      isActive: true,
      createdBy: uidx,
    };

    editB2cContent(payload)
      .then((res) => {
        // setReloadData(!reloadData)
      })
      .catch(() => {});
  };

  const handleConfirmSave = () => {};

  return (
    <>
      {/* <DashboardNavbar /> */}
      {contentId?.length > 0 ? (
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <div className="dispplayCard_Shadow">
                <div>
                  <SoftTypography style={{ padding: '10px', backgroundColor: 'lavender', fontSize: '1rem' }}>
                    {contentType && `Select Available ${contentType}`}
                  </SoftTypography>
                  <hr style={{ margin: '0px 0px 5px 0px', opacity: '0.3' }} />
                </div>
                {contentType === 'Banner' && (
                  <SelectAvailableBanner contentTypeId={contentTypeId} setContentTypeId={setContentTypeId} />
                )}
                {contentType === 'Tags' && (
                  <SelectAvailableTags contentTypeId={contentTypeId} setContentTypeId={setContentTypeId} />
                )}
                {contentType === 'Brands' && (
                  <SelectAvailableBrand contentTypeId={contentTypeId} setContentTypeId={setContentTypeId} />
                )}
                {contentType === 'Categories' && (
                  <SelectAvailableCategories contentTypeId={contentTypeId} setContentTypeId={setContentTypeId} />
                )}
                {!contentType && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <div>
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Add Content
                      </InputLabel>
                      <SoftSelect
                        options={[
                          { label: 'Banner', value: 'Banner' },
                          { label: 'Tags', value: 'Tags' },
                          { label: 'Brands', value: 'Brands' },
                          { label: 'Categories', value: 'Categories' },
                        ]}
                        onChange={(e) => handleContentType(e.value)}
                      ></SoftSelect>
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="mobile-screen">
                <img
                  src="https://i.ibb.co/Kj2wkfW/Whats-App-Image-2024-01-11-at-11-24-48-AM.jpg"
                  alt="header"
                  style={{ width: '100%' }}
                />
                <div className="mobileCards_container">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <div>
                      <Button
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        + Add Content
                      </Button>
                      <Menu
                        id="fade-menu"
                        MenuListProps={{
                          'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={() => handleContentType('Banner')}>Banner</MenuItem>
                        <MenuItem onClick={() => handleContentType('Tags')}>Tags</MenuItem>
                        <MenuItem onClick={() => handleContentType('Brands')}>Brands</MenuItem>
                        <MenuItem onClick={() => handleContentType('Categories')}>Categories</MenuItem>
                      </Menu>
                    </div>
                    <div>
                      <Button onClick={() => setDeleteIcon(!deleteIcon)}>Delete</Button>
                    </div>
                  </div>
                  <SoftBox>
                    <Board
                      children={board}
                      //  initialBoard={board}
                      onCardDragEnd={onComponentChange}
                    />
                  </SoftBox>
                </div>
                <img
                  src="https://i.ibb.co/FhBgp37/Whats-App-Image-2024-01-11-at-11-24-48-AM-1.jpg"
                  alt="header"
                  style={{ width: '100%' }}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Card className="customizeCard">
          {loader ? (
            <Spinner size={'1.3rem'} />
          ) : (
            <SoftButton color="info" onClick={handleCreateContent}>
              Create Content
            </SoftButton>
          )}
        </Card>
      )}
    </>
  );
};

export default ModifyContent;
