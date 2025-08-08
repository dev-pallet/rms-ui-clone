import './layout-table.css';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useEffect } from 'react';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import Table1 from './table1';
import Table2 from './table2';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';

import { fetchLayoutComponents, fetchSecondLevelHierarchy, fetchTopHierarchy } from '../../../../../config/Services';

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { injectStyle } from 'react-toastify/dist/inject-style';
import Filter from '../../../Common/Filter';

const LayoutTable = () => {
  sideNavUpdate();
  injectStyle();
  const navigate = useNavigate();
  const [totalSavedComponents, setTotalSavedComponents] = useState([]);
  const [savedComponents, setSavedComponents] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [topHierarchyList, setTopHierarchyList] = useState([]);

  const [topHierarchyMapId, setTopHierarchyMapId] = useState(null);
  const [topHierarchy, setTopHierarchy] = useState('');
  const [topHierarchyLabel, setTopHierarchyLabel] = useState('');
  const [topHierarchyListData, setTopHierarchyListData] = useState([]);
  const [topHierarchyData, setTopHierarchyData] = useState('');
  const [pageNo, setPageNo] = useState(0);
  const [totalPage, setTotalPage] = useState();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const layoutId = localStorage.getItem('layout_id');

  const handleComponents = (option) => {
    const arrDefintions = [];
    const component = savedComponents.find((comp) => comp.definitionName == option.value);

    for (let i = 0; i < savedComponents.length; i++) {
      if (savedComponents[i].definitionName == option.value) {
        break;
      } else {
        arrDefintions.push(savedComponents[i]);
      }
    }

    localStorage.setItem('arrDefinitions', JSON.stringify(arrDefintions));

    localStorage.setItem('definitionName', component.definitionName);

    localStorage.setItem('definitionId', component.definitionId);

    navigate('/setting/layout/add-hierarchy');
  };

  const getSavedLayoutComponents = async () => {
    const resp = await fetchLayoutComponents(orgId, locId, layoutId);

    const totData = resp.data.data.object;
    const totSavedComponents = resp.data.data.object.map((item) => ({
      value: item.definitionName,
      label: item.definitionName,
    }));

    const topLevel = totSavedComponents.splice(0, 1);
    setTopHierarchyLabel(topLevel);

    //
    setTotalSavedComponents(totSavedComponents);
    setSavedComponents(totData);
  };

  const handlePageNext = () => {
    setPageNo((prev) => prev + 1);
  };

  const handlePageBack = () => {
    if (pageNo <= 0) {
      setPageNo(0);
    } else {
      setPageNo((prev) => prev - 1);
    }
  };

  const secondLevelHierarchyData = async () => {
    const payload = {
      pageNo: pageNo,
      pageSize: 1,
    };
    const resp = await fetchSecondLevelHierarchy(topHierarchyMapId, payload);

    //
    toast.success(resp.data.data.message, {
      position: 'bottom-left',
      autoClose: 2000,
      theme: 'light',
    });
    if (resp.data.data.object == null) {
      setTableData([]);
    } else {
      const response = resp.data.data.object.data;
      const totPage = resp.data.data.object.totalPage;
      setTableData(response);
      setTotalPage(totPage);
    }
  };

  const fetchTopHierarchyList = async () => {
    const resp = await fetchTopHierarchy(layoutId);
    toast.success(resp.data.data.message, {
      position: 'bottom-left',
      autoClose: 2000,
      theme: 'light',
    });
    const result = resp.data.data.object;

    // console.log('resp', resp.data.data);
    const totList = result.map((item) => ({
      value: item.mapId,
      label: item.entityName,
    }));

    const finalTopHierarchyDat = {
      mapId: result[0]['mapId'],
      entityName: result[0]['entityName'],
      entityDefinitionId: result[0]['definitionId'],
    };

    //
    setTopHierarchyData(finalTopHierarchyDat);
    setPageNo(0);
    setTopHierarchyMapId(totList[0].value);
    setTopHierarchyList(totList);
    setTopHierarchyListData(result);
    setTopHierarchy(totList[0]);
  };

  const handleTopHierarchyChange = (option) => {
    setTopHierarchy(option);
    setTopHierarchyMapId(option.value);

    const index = topHierarchyList.findIndex((item) => item.label == option.label);
    const topHierarchyDat = topHierarchyList.find((item) => item.label == option.label);

    const finalTopHierarchyDat = {
      mapId: topHierarchyDat.value,
      entityName: topHierarchyDat.label,
      entityDefinitionId: topHierarchyListData[index]['definitionId'],
    };

    // console.log('topHierarchy', topHierarchyList);
    setTopHierarchyData(finalTopHierarchyDat);
    setPageNo(0);
  };

  useEffect(() => {
    getSavedLayoutComponents();
  }, []);

  useEffect(() => {
    fetchTopHierarchyList();
  }, []);

  useEffect(() => {
    if (topHierarchyMapId !== null) {
      secondLevelHierarchyData();
    }
  }, [topHierarchyMapId, pageNo]);

  const handleNavigationHierarchyTreeTable = () => {
    navigate('/setting/layout/hierarchy');
  };

  const addNewComponents = (
    <>
      <SoftSelect
        // className="all-products-filter-soft-select-box"
        placeholder="Add layout components"
        options={totalSavedComponents}
        onChange={(option) => handleComponents(option)}
        // insideHeader={true}
      />
    </>
  );

  const viewLayoutHierarchy = (
    <>
      <SoftSelect
        // className="all-products-filter-soft-select-box"
        value={topHierarchy}
        options={topHierarchyList}
        onChange={(option) => handleTopHierarchyChange(option)}
        // insideHeader={true}
      />
    </>
  );

  const selectBoxArray = [viewLayoutHierarchy];

  const handleAddComponents = () => {
    navigate('/setting/layout/add-hierarchy-components');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {/* <SoftBox>Table</SoftBox> */}

      <Box
        // className="category-top-box"
        style={{
          margin: '1rem 0 1rem 0',
        }}
      >
        <SoftButton
          color="info"
          onClick={handleNavigationHierarchyTreeTable}
          sx={{
            backgroundColor: '#0562fb',
          }}
        >
          View hierarchy Tree Table
        </SoftButton>
      </Box>

      <SoftBox
        className="search-bar-filter-and-table-container"
        sx={{
          overflowX: 'auto',
        }}
      >
        <SoftBox
          className="search-bar-filter-container"
        >
          <Grid container spacing={2} justifyContent={'space-between'}>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <Box className="all-products-filter-product">
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search"
                  icon={{ component: 'search', direction: 'left' }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Box className="layout-table-right-header">
                <SoftButton onClick={handleAddComponents}> + components</SoftButton>
                <Filter selectBoxArray={selectBoxArray} />
              </Box>
            </Grid>
          </Grid>

          {/* <SoftBox
            className="top-hierarchy-options"
            sx={{
              gap: '1rem',
            }}
          >
            <SoftSelect
              className="all-products-filter-soft-select-box"
              placeholder="Add layout components"
              options={totalSavedComponents}
              onChange={(option) => handleComponents(option)}
              insideHeader={true}
            />
            <SoftSelect
              className="all-products-filter-soft-select-box"
              value={topHierarchy}
              options={topHierarchyList}
              onChange={(option) => handleTopHierarchyChange(option)}
              insideHeader={true}
            />
          </SoftBox> */}
        </SoftBox>

        {/* {tableData.length ? <Table tableData={tableData} /> : null} */}
        {tableData.length && totalSavedComponents.length ? (
          <Table1
            tableData={tableData}
            setTableData={setTableData}
            totalSavedComponents={totalSavedComponents}
            topHierarchy={topHierarchy}
            topHierarchyLabel={topHierarchyLabel}
            topHierarchyData={topHierarchyData}
            pageNo={pageNo}
            handlePageNext={handlePageNext}
            handlePageBack={handlePageBack}
            totalPage={totalPage}
          />
        ) : tableData.length == 0 && totalSavedComponents.length && topHierarchyLabel.length ? (
          // <>
          //   <div>NO data Found</div>
          // </>
          // <SoftBox className="no-data-found">No data found choose hierarchy option from the list</SoftBox>
          <Table2
            totalSavedComponents={totalSavedComponents}
            topHierarchy={topHierarchy}
            topHierarchyLabel={topHierarchyLabel}
            topHierarchyData={topHierarchyData}
          />
        ) : null}
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

export default LayoutTable;
