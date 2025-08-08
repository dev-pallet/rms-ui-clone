import './add-hierarchy.css';
import { Box, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import {
  fetchCreatedSubEntitiesForLayout,
  fetchLayoutComponents,
  filterVendorSKUData,
  getCategoryForLayout,
  getSubEntitiesForLayout,
} from '../../../../../config/Services';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';
// import MultiSelect from '../../../../../components/SoftSelect/MultiSelect';
import { MultiSelect } from 'react-multi-select-component';

const AddHierarchyNew = () => {
  sideNavUpdate();
  injectStyle();
  const navigate = useNavigate();

  let entityArrDef = '';

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const layoutId = localStorage.getItem('layout_id');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

  const [categories, setCategories] = useState('');
  const [totalSavedComponents, setTotalSavedComponents] = useState([]);
  const [subEntities, setSubEntities] = useState([]);
  const [subEntityIndex, setSubEntityIndex] = useState('');
  const [valueEntity, setValueEntity] = useState(entityArrDef);
  const [mapSubEntity, setMapSubEntity] = useState(null);
  const [mapId, setMapId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [loader, setLoader] = useState(false);

  const [hierarchyData, setHiearchyData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [productIndex, setProductIndex] = useState('');

  // const hierarchyDat = {
  //   entityName: item.definitionName,
  //   definitionId: item.definitionId,
  //   rowData: [
  //     {
  //       id: 1,
  //       entityName: '',
  //       totalCapacity: '',
  //       storageType: '',
  //       inUse: false,
  //       storageCap: false,
  //     },
  //   ],
  // }

  const handleTabsChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddRow = (entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);

    newHierarchyData[findIndx] = {
      ...newHierarchyData[findIndx],
      rowData: [
        ...newHierarchyData[findIndx]['rowData'],
        {
          id: newHierarchyData[findIndx]['rowData'][newHierarchyData[findIndx]['rowData'].length - 1].id + 1,
          entityName: '',
          totalCapacity: '',
          capacityUnit: '',
          storageType: '',
          // inUse: false,
          // storageCap: false,
          mapCategories: [],
          mapProduct: [],
          // product: {
          //   value: '',
          //   label: 'Select...',
          // },
          product: [],
        },
      ],
    };

    setHiearchyData(newHierarchyData);
  };

  const handleRemove = (payload, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);

    if (newHierarchyData[findIndx]['rowData'].length > 1) {
      newHierarchyData[findIndx] = {
        ...newHierarchyData[findIndx],
        rowData: [...newHierarchyData[findIndx]['rowData'].filter((e) => e.id !== payload)],
      };

      setHiearchyData(newHierarchyData);
    }
  };

  const handleUnits = (option, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['capacityUnit'] = option.value;
    setHiearchyData(newHierarchyData);
  };

  const handleChange = (e, index, entityName) => {
    const { name, value } = e.target;
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);

    newHierarchyData[findIndx]['rowData'][index][name] = value;
    newHierarchyData[findIndx]['rowData'][index]['layoutId'] = layoutId;
    setHiearchyData(newHierarchyData);
  };

  const handleCheckBox = (e, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['inUse'] = e.target.checked;
    setHiearchyData(newHierarchyData);
  };

  const handleCheckBoxStorage = (e, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['storageCap'] = e.target.checked;
    setHiearchyData(newHierarchyData);
  };

  const handleSelectForStorage = (option, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['storageType'] = option.value;
    setHiearchyData(newHierarchyData);
  };

  const handleProductChange = (products, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['product'] = products;
    setHiearchyData(newHierarchyData);
  };

  const fetchProductsByCategory = async (categories, index, entityName) => {
    const categoryFinalLists = [...categories].map((el) => el.label);

    const payload = {
      page: pageNum,
      pageSize: '20',
      names: [],
      brand: [],
      gtin: [],
      companyName: [],
      mainCategory: [...categoryFinalLists],
      categoryLevel1: [],
      categoryLevel2: [],
      supportedStore: [locId],
      supportedWarehouse: [],
      supportedVendor: [],
      marketPlaceSeller: [],
      tags: [],
      productStatuses: [],
      sort: {
        mrpSortOption: 'DEFAULT',
        popular: 'DEFAULT',
        creationDateSortOption: 'DEFAULT',
      },
    };

    try {
      const resp = await filterVendorSKUData(payload);
      // console.log('respProducts', resp);
      const result = resp.data.data.products;
      if (result.length > 0) {
        const finalProductList = result.map((el) => ({
          value: el.gtin,
          label: el.name,
        }));
        const newHierarchyData = [...hierarchyData];
        const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
        const productData = [...newHierarchyData[findIndx]['rowData'][index]['mapProduct'], ...finalProductList];

        newHierarchyData[findIndx]['rowData'][index]['mapProduct'] = productData.filter((value, index, self) => {
          return self.findIndex((v) => v.value === value.value) === index;
        });
        setHiearchyData(newHierarchyData);
      }
    } catch (e) {}
  };

  const handleSelectCategory = (newSelected, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['mapCategories'] = newSelected;
    // console.log("newHierarchyData",newHierarchyData)
    setHiearchyData(newHierarchyData);
    if (newSelected.length > 0) {
      // setPageNum(1);
      fetchProductsByCategory(newSelected, index, entityName); //func. to generate the product list from the -> category list
    } else {
      const newHierarchyData = [...hierarchyData];
      const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
      newHierarchyData[findIndx]['rowData'][index]['mapProduct'] = [];
      newHierarchyData[findIndx]['rowData'][index]['product'] = [];
      setHiearchyData(newHierarchyData);
      // setPageNum(1);
    }
  };

  const handleOnSelectForCategory = (selectedList, selectedItem, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['mapCategories'] = selectedList;
    setHiearchyData(newHierarchyData);
    if (selectedList.length > 0) {
      // setPageNum(1);
      fetchProductsByCategory(selectedList, index, entityName); //func. to generate the product list from the -> category list
    } else {
      const newHierarchyData = [...hierarchyData];
      const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
      newHierarchyData[findIndx]['rowData'][index]['mapProduct'] = [];
      newHierarchyData[findIndx]['rowData'][index]['product'] = [];
      setHiearchyData(newHierarchyData);
      // setPageNum(1);
    }
  };

  const handleOnRemoveForCategory = (selectedList, removedItem, index, entityName) => {
    // console.log('Onremove', selectedList, removedItem, index, entityName);
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['mapCategories'] = selectedList;
    setHiearchyData(newHierarchyData);
    if (selectedList.length > 0) {
      // setPageNum(1);
      fetchProductsByCategory(selectedList, index, entityName); //func. to generate the product list from the -> category list
    } else {
      const newHierarchyData = [...hierarchyData];
      const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
      newHierarchyData[findIndx]['rowData'][index]['mapProduct'] = [];
      newHierarchyData[findIndx]['rowData'][index]['product'] = [];
      setHiearchyData(newHierarchyData);
      // setPageNum(1);
    }
  };

  const handleSelectProduct = (newSelected, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['product'] = newSelected;
    setHiearchyData(newHierarchyData);
  };

  const handleOnSelectProduct = (selectedList, selectedItem, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['product'] = selectedList;
    setHiearchyData(newHierarchyData);
  };

  const handleOnRemoveProduct = (selectedList, removedItem, index, entityName) => {
    const newHierarchyData = [...hierarchyData];
    const findIndx = newHierarchyData.findIndex((item) => item['entityName'] === entityName);
    newHierarchyData[findIndx]['rowData'][index]['product'] = selectedList;
    setHiearchyData(newHierarchyData);
  };

  const handleProductMenuScrollToBottom = (index) => {
    // Your function to be called when the user reaches the bottom
    // Call your custom function here
    // console.log('at bottom');
    // console.log('index', index);

    setProductIndex(index);
    if (index == productIndex) {
      setPageNum((prev) => prev + 1);
    }
    if (index !== productIndex) {
      setPageNum(1);
    }
  };

  useEffect(() => {
    // console.log('index', productIndex);
    // console.log('pageNum', pageNum);
    if (hierarchyData.length) {
      const newHierarchyData = [...hierarchyData];
      const categories = newHierarchyData[tabValue]['rowData'][productIndex]['mapCategories'];
      const entityName = newHierarchyData[tabValue]['entityName'];

      if (categories.length > 0) {
        fetchProductsByCategory(categories, productIndex, entityName); //func. to generate the product list from the -> category list
      } else {
        const newHierarchyDat = [...hierarchyData];
        newHierarchyDat[productIndex]['rowData'][productIndex]['mapProduct'] = [];
        newHierarchyDat[productIndex]['rowData'][productIndex]['product'] = [];
        newHierarchyDat[productIndex]['rowData'][productIndex] = [];
        setHiearchyData(newHierarchyDat);
      }
    }
  }, [pageNum, productIndex]);

  const fetchCategoryForLayout = () => {
    getCategoryForLayout()
      .then((res) => {
        // console.log('res-category', res.data.data);
        const response = res.data.data;
        const responseFilter = response
          .filter((item) => item.categoryName !== 'All Category')
          .map((item) => ({
            label: item.categoryName,
            value: item.mainCategoryId,
          }));

        responseFilter.unshift({
          value: 'NOT DEFINED',
          label: 'NOT DEFINED',
        });
        setCategories(responseFilter);
      })
      .catch((err) => {});
  };

  const fetchAllLayoutComponents = async () => {
    try {
      const resp = await fetchLayoutComponents(orgId, locId, layoutId);
      const totalSavedComponents = resp.data.data.object;
      const hierarchyDataDetails = totalSavedComponents.map((item) => ({
        entityName: item.definitionName,
        definitionId: item.definitionId,
        rowData: [
          {
            id: 1,
            entityName: '',
            totalCapacity: '',
            capacityUnit: '',
            storageType: '',
            // inUse: false,
            // storageCap: false,
            mapCategories: [],
            mapProduct: [],
            product: [],
          },
        ],
      }));
      setHiearchyData(hierarchyDataDetails);
      setTotalSavedComponents(totalSavedComponents);
    } catch (err) {}
  };

  useEffect(() => {
    fetchCategoryForLayout();
    fetchAllLayoutComponents();
  }, []);

  const getSavedLayoutComponents = async () => {
    hierarchyData.slice(0, tabValue).map(async (item, index) => {
      const defId = item.definitionId;
      try {
        const res = await getSubEntitiesForLayout(defId, layoutId);

        const subEntitiesdata = res.data.data.object.entityList.map((item) => ({
          value: item.mapId,
          label: item.entityName,
        }));
        const definitionId = res.data.data.object.definitionId;
        const typeName = res.data.data.object.typeName;
        const subEntitiesMessage = res.data.data.message;

        // if (typeName === 'BUILDING')
        if (index == 0) {
          setSubEntities((prev) => [
            ...prev,
            {
              list: [
                // {
                //   value: null,
                //   label: 'None',
                // },
                ...subEntitiesdata,
              ],
              definitionId: definitionId,
              typeName: typeName,
              message: subEntitiesMessage,
            },
          ]);
        } else {
          setSubEntities((prev) => [
            ...prev,
            {
              list: [],
              definitionId: definitionId,
              typeName: typeName,
              message: subEntitiesMessage,
            },
          ]);
        }
      } catch (err) {}
    });
  };

  useEffect(() => {
    setMapId(null);
    if (tabValue !== 0) {
      entityArrDef = hierarchyData.slice(0, tabValue).map((item) => ({
        value: '',
        label: item.entityName,
      }));
      setValueEntity(entityArrDef);
      setSubEntities([]);
      getSavedLayoutComponents();
    }
  }, [tabValue]);

  const handleComponents = (item, index, option) => {
    setSubEntityIndex(index); // storing this index for listing the components from its previous parent list selected to generate the list in the consecutive following child component.

    if (subEntities.length > 1 && subEntities.length - 1 == index) {
      setMapId(option);
      setMapSubEntity(null);
      const vaueSubEntitySelectOption = [...valueEntity];
      vaueSubEntitySelectOption[index] = option;
      for (let i = index + 1; i < vaueSubEntitySelectOption.length; i++) {
        vaueSubEntitySelectOption[i] = {
          value: '',
          label: hierarchyData[i]['entityName'],
        };
      }
      setValueEntity(vaueSubEntitySelectOption);
      return;
    } else if (subEntities.length == 1) {
      setMapSubEntity(option.value);
      const vaueSubEntitySelectOption = [...valueEntity];
      vaueSubEntitySelectOption[index] = option;

      for (let i = index + 1; i < vaueSubEntitySelectOption.length; i++) {
        vaueSubEntitySelectOption[i] = {
          value: '',
          label: hierarchyData[i]['entityName'],
        };
      }

      setValueEntity(vaueSubEntitySelectOption);
      setMapId(option);
      setMapSubEntity(null);
      return;
    } else {
      setMapSubEntity(option.value);
      const vaueSubEntitySelectOption = [...valueEntity];
      vaueSubEntitySelectOption[index] = option;
      for (let i = index + 1; i < vaueSubEntitySelectOption.length; i++) {
        vaueSubEntitySelectOption[i] = {
          value: '',
          label: hierarchyData[i]['entityName'],
        };
      }
      setValueEntity(vaueSubEntitySelectOption);
    }
  };

  const fetchSubEntities = async () => {
    const resp = await fetchCreatedSubEntitiesForLayout(layoutId, mapSubEntity);
    const result = resp.data.data.object;
    if (result.length) {
      // for showing the list of data in the subsequent component(child) list with subEntity index.
      const newSubEntities = [...subEntities];
      const index = subEntityIndex + 1;
      newSubEntities[index]['list'] = result.map((item) => ({
        value: item.mapId,
        label: item.entityName,
      }));
      //
      const valEntity = [...valueEntity];
      for (let i = subEntityIndex + 1; i < entityArrDef.length; i++) {
        valEntity[i] = entityArrDef[i];
      }
      for (let i = subEntityIndex + 2; i < newSubEntities.length; i++) {
        newSubEntities[i]['list'] = [];
        //
      }
      //
      setValueEntity(valEntity);
      setSubEntities(newSubEntities);
      const name2 = newSubEntities[index]['typeName'];

      toast.success(resp.data.data.message + ' e.g. ' + ' ' + result.length + ` ${name2} found`, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
    } else {
      //
      const newSubEntities = [...subEntities];
      //
      const index = subEntityIndex + 1;
      newSubEntities[index]['list'] = result;
      for (let i = subEntityIndex + 2; i < newSubEntities.length; i++) {
        newSubEntities[i]['list'] = [];
        //
      }
      const name1 = newSubEntities[subEntityIndex]['typeName'];
      const name2 = newSubEntities[index]['typeName'];

      setMapId(null);
      setSubEntities(newSubEntities);
      toast.success(resp.data.data.message + ` or add ${name2} to this ${name1}`, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      return;
    }
  };

  useEffect(() => {
    // mapSubEntity -> the value which fetches the subEntity to the following child components e.g Building (mapId) -> Zone(list)

    if (mapSubEntity !== null) {
      fetchSubEntities();
    }
  }, [mapSubEntity]);

  const validateDataOnSave = (data) => {
    const newRw = [...data];
    for (let i = 0; i < newRw.length; i++) {
      const row = newRw[i];
      if (row.entityName == '') {
        toast.warning(`Please fill entityName for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.totalCapacity == '') {
        toast.warning(`Please fill totalCapacity for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.capacityUnit == '') {
        toast.warning(`Please fill totalCapacity unit for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }

      if (row.storageType == '') {
        toast.warning(`Please fill storageType for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.mapCategories.length == 0) {
        toast.warning(`Please select categories for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }

      // if (row.product.length == 0) {
      //   toast.warning(`Please select product for row ${i + 1}`, {
      //     position: 'bottom-left',
      //     autoClose: 2000,
      //     theme: 'light',
      //   });
      //   return;
      // }

      // if (row.inUse == false) {
      //   toast.warning(`Please select In Use for row ${i + 1}`, {
      //     position: 'bottom-left',
      //     autoClose: 2000,
      //     theme: 'light',
      //   });
      //   return;
      // }

      // if (row.inUse == false && row.storageCap == true) {
      //   toast.warning(`Please select In Use for row ${i + 1}`, {
      //     position: 'bottom-left',
      //     autoClose: 2000,
      //     theme: 'light',
      //   });
      //   return;
      // }
    }

    return data;
  };

  const handleCancel = () => {
    navigate('/setting/layout-table');
  };

  const entityDataList = (newFinalEntityModelRelationModel) => {
    newFinalEntityModelRelationModel.map(function (item) {
      delete item.mapCategories;
      return item;
    });
    return newFinalEntityModelRelationModel;
  };

  const handleSave = () => {
    const currentHierarchyData = hierarchyData[tabValue]['rowData'];

    const finalEntityModelRelationModel = validateDataOnSave(currentHierarchyData);

    if (finalEntityModelRelationModel !== undefined && finalEntityModelRelationModel.length) {
      finalEntityModelRelationModel.forEach((item) => {
        delete item.id;
        delete item.mapProduct;
      });

      const newFinalEntityModelRelationModel = finalEntityModelRelationModel.map((item, index) => ({
        ...item,
        storageCap: true,
        inUse: true,
        classificationCapModelList: item.mapCategories.map((item) => ({
          type: 'MAIN_CATEGORY',
          classificationId: item.value,
        })),
        product: item.product,
      }));

      const defId = hierarchyData[tabValue]['definitionId'];

      const payload = {
        userId: uidx,
        ownerId: locId,
        definitionId: defId,
        mapId: mapId == null ? null : mapId.value,
        entityModelRelationModel: entityDataList(newFinalEntityModelRelationModel),
      };

      // console.log('payloadOnSaveHierarchy', payload);

      // setLoader(true);
      // createSubEntitiesHierarchyForLayout(payload)
      //   .then((res) => {
      //     const newHierarchyData = [...hierarchyData];
      //     newHierarchyData[tabValue]['rowData'] = [
      //       {
      //         id: 1,
      //         entityName: '',
      //         totalCapacity: '',
      //         storageType: '',
      //         inUse: false,
      //         storageCap: false,
      //       },
      //     ];
      //     setHiearchyData(newHierarchyData);
      //     setLoader(false);
      //     setMapId(null);
      //     toast.success(res.data.data.message, {
      //       position: 'bottom-left',
      //       autoClose: 2000,
      //       theme: 'light',
      //     });

      //     if (tabValue == hierarchyData.length - 1) {
      //       setTimeout(() => {
      //         navigate('/setting/layout-table');
      //       }, 1000);
      //     } else {
      //       setTabValue((prev) => prev + 1);
      //     }
      //   })
      //   .catch((err) => {
      //     setLoader(false);
      //   });
    }
  };

  const handleEditComponents = () => {
    const defId = hierarchyData[tabValue]['definitionId'];
    // console.log('defId', defId);
  };

  const componentsTypeName = (str) => {
    return str
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="components-tab-view">
        <Box
          className="components-tabs"
          sx={{
            marginTop: '1rem',
          }}
        >
          <Tabs
            onChange={handleTabsChange}
            value={tabValue}
            TabIndicatorProps={{ style: { backgroundColor: '#0562FB' } }}
          >
            {hierarchyData.map((item, index) => (
              <Tab
                label={
                  <SoftBox
                    py={0.5}
                    px={2}
                    sx={{
                      color: tabValue == index ? 'white !important' : null,
                    }}
                  >
                    {componentsTypeName(item.entityName)}
                  </SoftBox>
                }
              />
            ))}
          </Tabs>

          <Box className="tab-contents">
            {hierarchyData?.length && hierarchyData[tabValue]['entityName'] !== 'BUILDING' && tabValue !== 0 ? (
              <SoftBox
                className="top-box"
                // sx={tabValue !== 0 ? { display: 'block' } : { display: 'none' }}
              >
                {/* <Box
                  className="edit-components"
                  sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                >
                  <SoftButton
                    onClick={() => handleEditComponents()}
                    sx={{
                      backgroundColor: '#0562fb',
                      color: 'white !important',
                    }}
                  >
                    {hierarchyData[tabValue]['entityName']}
                  </SoftButton>
                </Box> */}

                <Grid container spacing={3}>
                  {subEntities
                    .sort((a, b) => a.definitionId.localeCompare(b.definitionId))
                    .map((item, index) => (
                      <Grid item xs={12} md={3} lg={3} xl={4}>
                        <SoftTypography
                          className="components-text"
                          // fontWeight="bold"
                        >
                          {componentsTypeName(item.typeName)}
                        </SoftTypography>
                        <SoftSelect
                          className="softselect-box"
                          value={item.list.length === 0 ? entityArrDef[index] : valueEntity[index]}
                          placeholder={
                            item.list.length == 0
                              ? componentsTypeName(item.typeName)
                              : componentsTypeName(valueEntity[index]['label'])
                          }
                          options={item.list}
                          onChange={(option) => handleComponents(item, index, option)}
                        />
                      </Grid>
                    ))}
                </Grid>
              </SoftBox>
            ) : null}
            {hierarchyData.map((tab, tabIndex) => (
              <SoftBox
                key={tabIndex}
                sx={{
                  overflow: 'auto',
                  paddingBottom: '1rem',
                  display: tabValue === tabIndex ? 'block' : 'none',
                }}
                className="tab-form"
              >
                {tab?.rowData.map((e, index) => (
                  <SoftBox
                    sx={{
                      // overflow: 'auto',
                      paddingBottom: '1rem',
                      minHeight: '10rem',
                    }}
                  >
                    <>
                      <Grid
                        key={e.id}
                        container
                        spacing={4}
                        sx={{
                          marginTop: '1rem',
                        }}
                      >
                        <Grid item xs={12} md={2} lg={2} xl={2}>
                          <SoftBox className="flex-row-item">
                            <SoftTypography variant="caption" fontWeight="bold">
                              Entity Name
                            </SoftTypography>
                            <SoftInput
                              // placeholder={`e.g.: ${component}${index + 1}`}
                              placeholder={componentsTypeName(hierarchyData[tabIndex]['entityName'])}
                              name="entityName"
                              onChange={(e) => handleChange(e, index, hierarchyData[tabIndex]['entityName'])}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} md={2.5} lg={2.5} xl={2.5}>
                          <SoftBox className="flex-row-item">
                            <SoftTypography variant="caption" fontWeight="bold">
                              Total Capacity
                            </SoftTypography>
                            <SoftBox className="boom-box">
                              <SoftBox className="boom-soft-box">
                                <SoftSelect
                                  className="boom-soft-select"
                                  // value={minOrderQtyUnit}
                                  // onChange={(option) => setMinOrderQtyUnit(option)}
                                  onChange={(option) =>
                                    handleUnits(option, index, hierarchyData[tabIndex]['entityName'])
                                  }
                                  placeholder="Units"
                                  options={[
                                    { value: 'SQ_FEET', label: 'Sq. Feet' },
                                    { value: 'SQ_METER', label: 'Sq. Meter' },
                                    { value: 'SQ_YARDS', label: 'Sq. Yards' },
                                    { value: 'KGS', label: 'Kgs' },
                                  ]}
                                  menuPortalTarget={document.body}
                                />
                              </SoftBox>
                              <SoftInput
                                placeholder="e.g: 9000"
                                name="totalCapacity"
                                type="number"
                                onChange={(e) => handleChange(e, index, hierarchyData[tabIndex]['entityName'])}
                              />
                            </SoftBox>
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} md={2} lg={2} xl={2}>
                          <SoftBox className="flex-row-item">
                            <SoftTypography variant="caption" fontWeight="bold">
                              Storage Type
                            </SoftTypography>
                            <SoftSelect
                              options={[
                                { value: 'FROZEN', label: 'Frozen' },
                                { value: 'CHILLED/COOLER', label: 'Chilled/Cooler' },
                                { value: 'DRY', label: 'Dry' },
                                { value: 'WET', label: 'Wet' },
                              ]}
                              onChange={(option) =>
                                handleSelectForStorage(option, index, hierarchyData[tabIndex]['entityName'])
                              }
                              menuPortalTarget={document.body}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} md={2.5} lg={2.5} xl={2.5}>
                          {/* <SoftBox className="flex-row-item" id="in-use">
                            <SoftTypography variant="caption" fontWeight="bold">
                              In Use
                            </SoftTypography>
                            <Checkbox
                              size="small"
                              checked={e.inUse}
                              onChange={(e) => handleCheckBox(e, index, hierarchyData[tabIndex]['entityName'])}
                              sx={{
                                marginTop: '0.8rem',
                                height: '1.5rem',
                                width: '1.5rem',
                              }}
                            />
                          </SoftBox> */}
                          <SoftBox className="flex-row-item">
                            <SoftTypography variant="caption" fontWeight="bold">
                              Map Category
                            </SoftTypography>
                            {/* <Multiselect
                              options={categories || []}
                              showCheckbox={true}
                              displayValue="label"
                              menuPortalTarget={document.body}
                              selectedValues={e?.mapCategories || []}
                              onSelect={(selectedList, selectedItem) =>
                                handleOnSelectForCategory(
                                  selectedList,
                                  selectedItem,
                                  index,
                                  hierarchyData[tabIndex]['entityName'],
                                )
                              }
                              onRemove={(selectedList, removedItem) =>
                                handleOnRemoveForCategory(
                                  selectedList,
                                  removedItem,
                                  index,
                                  hierarchyData[tabIndex]['entityName'],
                                )
                              }
                              valueRenderer={(selected) => `${selected.length} item(s) selected`}
                              placeholder={
                                e?.mapCategories.length > 0 ? `${e?.mapCategories.length} selected` : 'Select category'
                              }
                            /> */}

                            <MultiSelect
                              options={categories || []}
                              value={e?.mapCategories || []}
                              onChange={(newSelected) =>
                                handleSelectCategory(newSelected, index, hierarchyData[tabIndex]['entityName'])
                              }
                              labelledBy={'Select'}
                              isCreatable={true}
                              valueRenderer={(select) => `${select.length} selected`}
                              hideSearch={true}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} md={2.4} lg={2.4} xl={2.4}>
                          {/* <SoftBox
                            className="flex-row-item"
                            sx={{
                              position: 'relative',
                              bottom: '1rem',
                            }}
                          >
                            <SoftTypography variant="caption" fontWeight="bold">
                              For Storage
                            </SoftTypography>
                            <Checkbox
                              size="small"
                              checked={e.storageCap}
                              onChange={(e) => handleCheckBoxStorage(e, index, hierarchyData[tabIndex]['entityName'])}
                              sx={{
                                marginTop: '0.8rem',
                                height: '1.5rem',
                                width: '1.5rem',
                              }}
                            />
                          </SoftBox> */}
                          <SoftBox className="flex-row-item">
                            <SoftTypography variant="caption" fontWeight="bold">
                              Map Product
                            </SoftTypography>
                            {/* <Multiselect
                              options={e?.mapProduct || []}
                              showCheckbox={true}
                              displayValue="label"
                              menuPortalTarget={document.body}
                              selectedValues={e?.product || []}
                              onSelect={(selectedList, selectedItem) =>
                                handleOnSelectProduct(
                                  selectedList,
                                  selectedItem,
                                  index,
                                  hierarchyData[tabIndex]['entityName'],
                                )
                              }
                              onRemove={(selectedList, removedItem) =>
                                handleOnRemoveProduct(
                                  selectedList,
                                  removedItem,
                                  index,
                                  hierarchyData[tabIndex]['entityName'],
                                )
                              }
                              placeholder={e?.product.length > 0 ? `${e?.product.length} selected` : 'Select product'}
                            /> */}
                            <MultiSelect
                              options={e?.mapProduct || []}
                              value={e?.product || []}
                              onChange={(newSelected) =>
                                handleSelectProduct(newSelected, index, hierarchyData[tabIndex]['entityName'])
                              }
                              labelledBy={'Select'}
                              isCreatable={true}
                              valueRenderer={(select) => `${select.length} selected`}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={12} md={0.6} lg={0.6} xl={0.6}>
                          <SoftBox>
                            <CloseIcon
                              onClick={() => handleRemove(e.id, hierarchyData[tabIndex]['entityName'])}
                              sx={{
                                marginTop: '1.8rem',
                                cursor: 'pointer',
                              }}
                            />
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </>
                  </SoftBox>
                ))}
                <SoftBox className="add-more">
                  <Button onClick={() => handleAddRow(hierarchyData[tabIndex]['entityName'])}>Add more +</Button>
                </SoftBox>
                <SoftBox className="cancel-save">
                  <SoftButton
                    sx={{
                      marginRight: '1rem',
                    }}
                    onClick={handleCancel}
                  >
                    cancel
                  </SoftButton>
                  {mapId == null && hierarchyData[tabValue]['rowData'].length > 0 && tabValue !== 0 ? (
                    // hierarchyData[tabValue]['entityName'] !== 'BUILDING'
                    <SoftButton variant="gradient" disabled style={{ backgroundColor: '#f0f0f0', color: 'black' }}>
                      save
                    </SoftButton>
                  ) : // hierarchyData[tabValue]['entityName'] == 'BUILDING' ||
                    tabValue == 0 ? (
                      <SoftButton variant="gradient" color="info" onClick={loader ? null : handleSave}>
                        {loader ? <Spinner /> : 'Save'}
                      </SoftButton>
                    ) : (
                      <SoftButton variant="gradient" color="info" onClick={loader ? null : handleSave}>
                        {loader ? <Spinner /> : 'Save'}
                      </SoftButton>
                    )}
                </SoftBox>
              </SoftBox>
            ))}
          </Box>
        </Box>
      </SoftBox>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </DashboardLayout>
  );
};

export default AddHierarchyNew;
