import { Box } from '@mui/material';
import {
  FilterChipDisplayBox,
  filterStateAndFiltersAppliedHandleFn,
} from '../../../Common/Filter Components/filterComponents';
import { getAllOrgUsers } from '../../../../../config/Services';
import {
  getFiltersStateData,
  setFilterStateData,
  setFilters,
  setPage,
} from '../../../../../datamanagement/Filters/commonFilterSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Filter from '../../../Common/Filter';
import React, { useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';

export default function PurchaseIndentFilter({ filterObject, setOnClear, allPiList, filterObjectMain }) {
  const [status, setStatus] = useState(filterObjectMain?.status || '');
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(filterObjectMain?.selectedUser || '');
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
    user: persistedFilterStateData?.selectedUser || 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  const filterChipData = useMemo(
    () => [
      { heading: 'Status', label: status.label, key: 'status', condition: filterState.status === 1 },
      { heading: 'User', label: selectedUser.label, key: 'user', condition: filterState.user === 1 },
    ],
    [status, selectedUser, filterState],
  );

  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      status: setStatus,
      user: setSelectedUser,
    };

    if (filterMap[filterType]) {
      filterMap[filterType]('');
      setFilterState((prevState) => ({ ...prevState, [filterType]: 0 }));
    }
  };
  const filterChipBoxes = (
    <>
      {filterChipData.map(
        ({ heading, label, key, condition }) =>
          condition && (
            <FilterChipDisplayBox
              key={key}
              heading={heading}
              label={label}
              objKey={key}
              removeSelectedFilter={removeSelectedFilter}
            />
          ),
      )}
    </>
  );
  // purchase indent status selectbox
  const statusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Status"
          {...(status.label
            ? {
                value: {
                  value: status.value,
                  label: status.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Status',
                },
              })}
          options={[
            { value: 'DRAFT', label: 'Draft' },
            { value: 'CREATED', label: 'Pending Approval' },
            { value: 'APPROVED', label: 'Approved' },
            // { value: 'CLOSED', label: 'Closed' },
          ]}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );

  // select user
  const userSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="User"
          name="user"
          {...(selectedUser?.label
            ? {
                value: {
                  value: selectedUser?.value,
                  label: selectedUser?.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select User',
                },
              })}
          options={userList}
          onChange={(option, e) => {
            // handleMainCat(option);
            handleUser(option);
          }}
        />
      </Box>
    </>
  );

  // functions
  const getUserList = () => {
    // vendor payload
    const organizationId = localStorage.getItem('orgId');
    const payload = {
      orgId: organizationId,
      contextId: localStorage.getItem('locId'),
    };

    getAllOrgUsers(payload)
      .then((res) => {
        const data = res?.data?.data;

        const userArr = [];
        userArr.push(
          data
            ?.map((row) => ({
              value: row?.uidx,
              label: row?.firstName + ' ' + row?.secondName,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        );

        setUserList(userArr[0] || []);
      })
      .catch((e) => {
        // console.log(e);
      });
  };

  // handle status fn
  const handleStatus = (option) => {
    setStatus(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('status');
    }
  };

  // handle user
  const handleUser = (option) => {
    const label = option.label;
    const value = option.value;
    const isValidSelection = label && value;

    setSelectedUser(isValidSelection ? { label, value } : {});

    handleFilterStateAndFiltersApplied('user');
    // }
    // whenever the user is changed, set page = 1 in pageState
    // setPageState({ ...pageState, page: 1 });
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    // Apply the filter while preserving the selected status and user
    dispatch(
      setFilters({
        status: status,
        selectedUser: selectedUser,
      }),
    );
    // Preserve the current filter state after applying the filter
    setFilterState({
      status: status.label ? 1 : 0,
      user: selectedUser.label ? 1 : 0,
    });
    dispatch(
      setFilterStateData({
        status: status.label ? 1 : 0,
        selectedUser: selectedUser.label ? 1 : 0,
      }),
    );
    dispatch(setPage(0));
  };

  // fn to  clear the  filter
  const handleClearPurchaseIndentFilter = () => {
    setStatus({});
    setSelectedUser({});
    // setShippingMethod({});

    // reset filterState
    setFilterState({
      status: 0,
      user: 0,
      // shippingMethod: 0,
    });
    // set on clear to true
    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    // dispatch(setStockCountSearchValue(''));
    dispatch(setPage(0));
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    statusSelect,
    userSelect,
    // shippingMethodSelect
  ];

  useEffect(() => {
    getUserList();
  }, []);

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <Filter
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearPurchaseIndentFilter}
    />
  );
}
