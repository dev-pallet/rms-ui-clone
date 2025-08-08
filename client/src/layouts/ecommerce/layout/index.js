import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

import { fetchCreatedSubEntitiesForLayout } from '../../../config/Services';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftTypography from '../../../components/SoftTypography';

import { Tree, TreeNode } from 'react-organizational-chart';

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import './layout.css';
import { injectStyle } from 'react-toastify/dist/inject-style';

const Layout = () => {
  sideNavUpdate();
  injectStyle();

  const navigate = useNavigate();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const layoutId = localStorage.getItem('layout_id');

  const [savedComponents, setSavedComponents] = useState([]);
  const [totalSavedComponents, setTotalSavedComponents] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [mapId, setMapId] = useState(null);

  /****    get saved  layout components */

  // const getSavedLayoutComponents = async () => {
  //   const layoutId = localStorage.getItem('layout_id');
  //   const resp = await fetchLayoutComponents(orgId, locId, layoutId);
  //   const totData = resp.data.data.object;
  //   const totSavedComponents = resp.data.data.object.map((item) => ({
  //     value: item.definitionName,
  //     label: item.definitionName,
  //   }));
  //   setTotalSavedComponents(totSavedComponents);
  //   setSavedComponents(totData);
  // };

  /*** handle layout creation of layout components in hierarchy */

  // const handleComponents = (option) => {
  //   let arrDefintions = [];
  //   const component = savedComponents.find((comp) => comp.definitionName == option.value);

  //   for (let i = 0; i < savedComponents.length; i++) {
  //     if (savedComponents[i].definitionName == option.value) {
  //       break;
  //     } else {
  //       arrDefintions.push(savedComponents[i]);
  //     }
  //   }

  //   localStorage.setItem('arrDefinitions', JSON.stringify(arrDefintions));

  //   localStorage.setItem('definitionName', component.definitionName);

  //   localStorage.setItem('definitionId', component.definitionId);

  //   navigate('/setting/layout/add-hierarchy');
  // };

  // useEffect(() => {
  //   getSavedLayoutComponents();
  // }, []);

  const CardComponent = ({ entity, setMapId }) => {
    const handleClick = (entity) => {
      setMapId(entity.mapId);
    };

    return (
      <SoftBox
        sx={{ width: '10rem', height: '10rem', display: 'inline-block', padding: '1rem' }}
        onClick={() => handleClick(entity)}
      >
        <SoftBox className="card-entities">
          <SoftTypography
            sx={{
              color: 'black',
              fontSize: '1rem',
            }}
          >
            {entity.entityName}
          </SoftTypography>
          {/* {entity.collapsed && entity.list.length ? '▶' : !entity.collapsed && entity.list.length ? '▼' : null} */}
          {entity.collapsed && entity.list.length ? (
            <ExpandMoreIcon fontSize="medium" className="expand-more" />
          ) : !entity.collapsed && entity.list.length ? (
            <ExpandLessIcon fontSize="medium" className="expand-less" />
          ) : null}
        </SoftBox>
      </SoftBox>
    );
  };

  function collapseExpand(data, id) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.mapId == id) {
        item.collapsed = !item.collapsed;
        return data;
      } else if (item.list.length > 0) {
        item.list = collapseExpand(item.list, id);
      }
    }
    return data;
  }

  const handleToggle = (entity) => {
    if (treeData?.length) {
      const updatedData = collapseExpand([...treeData], entity.mapId);
      setTreeData(updatedData);
    }
  };

  const renderOrgChartNode = (entity, setMapId, treeData, setTreeData) => {
    return (
      <TreeNode
        label={
          <SoftBox onClick={() => handleToggle(entity)}>
            <CardComponent entity={entity} setMapId={setMapId} />
          </SoftBox>
        }
        key={entity.mapId}
        className={entity.mapId}
      >
        {!entity.collapsed && entity.list.map((child) => renderOrgChartNode(child, setMapId))}
        {/* {entity.list.map((child) => renderOrgChartNode(child, setMapId))} */}
      </TreeNode>
    );
  };

  function insertListByMapId(data, targetMapId, newList) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.mapId === targetMapId) {
        const unique = [];
        item.list = item.list.concat(newList);
        item.list.map((x) => (unique.filter((a) => a.mapId == x.mapId).length > 0 ? null : unique.push(x)));
        item.list = unique;
        // item.list = [...item.list, newList];
        return data;
      } else if (item.list.length > 0) {
        item.list = insertListByMapId(item.list, targetMapId, newList);
      }
    }
    return data;
  }

  const fetchSubEntities = async () => {
    try {
      const result = await fetchCreatedSubEntitiesForLayout(layoutId, mapId);
      const res = await result;
      toast.success(res.data.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      const list = res.data.data.object.map((item) => ({
        entityName: item.entityName,
        mapId: item.mapId,
        collapsed: true,
        list: [],
      }));
      setTreeData(list);
    } catch (err) {}
  };

  const fetchSubEntitiesToAddNewEntities = async () => {
    try {
      let newList = [];
      const result = await fetchCreatedSubEntitiesForLayout(layoutId, mapId);
      const res = await result;
      //
      toast.success(res.data.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      newList = res.data.data.object.map((item) => ({
        entityName: item.entityName,
        mapId: item.mapId,
        collapsed: true,
        list: [],
      }));
      const updatedData = insertListByMapId([...treeData], mapId, newList);
      setTreeData(updatedData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSubEntities();
  }, []);

  useEffect(() => {
    if (mapId !== null) {
      fetchSubEntitiesToAddNewEntities();
    }
  }, [mapId]);

  useEffect(() => {}, [savedComponents]);

  const handleNavigationHierarchyTable = () => {
    navigate('/setting/layout-table');
  };

  useEffect(() => {}, [treeData]);

  useEffect(() => {
    if (localStorage.getItem('definitionName')) {
      localStorage.removeItem('definitionName');
    }
    if (localStorage.getItem('arrDefinitions')) {
      localStorage.removeItem('arrDefinitions');
    }
    if (localStorage.getItem('definitionId')) {
      localStorage.removeItem('definitionId');
    }
    if (localStorage.getItem('mapId')) {
      localStorage.removeItem('mapId');
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <Box
        // className="category-top-box"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <SoftButton
          color="info"
          onClick={handleNavigationHierarchyTable}
          sx={{
            backgroundColor: '#0562FB',
          }}
        >
          View hierarchy Table
        </SoftButton>

        {/* <SoftSelect
          placeholder="Add layout components"
          options={totalSavedComponents}
          onChange={(option) => handleComponents(option)}
        /> */}
      </Box>

      <SoftBox
        sx={{
          overflow: 'scroll',
          // minWidth: '80rem',
          minHeight: '50rem',
        }}
      >
        <Tree
          lineWidth={'2px'}
          lineColor={'#bbc'}
          lineBorderRadius={'12px'}
          label={
            <SoftTypography
              variant="button"
              // fontWeight="medium"
              color="text"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              {localStorage.getItem('layout_name')}
            </SoftTypography>
          }
        >
          {treeData.length
            ? treeData.map((entity) => renderOrgChartNode(entity, setMapId, treeData, setTreeData))
            : null}
        </Tree>
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
export default Layout;
