import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Box } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import { getTicketList, ticketFilter, ticketSummary } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { useDebounce } from '../../../../hooks/useDebounce';
import Filter from '../../Common/Filter';
import TableSummaryDiv from '../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import TicketListing from '../TicketListing';
import { fetchAssignee, fetchFeatureData, fetchProjectData } from './apiCall';
import './style.css';
import { FilterChipDisplayBox } from './ticketFilter';

const Ticket = () => {
  const [openCreatePage, setOpenCreatePage] = useState(false);
  const createByval = localStorage.getItem('user_details');
  const userDetails = JSON.parse(createByval);
  const uidxVal = userDetails?.uidx;
  const contactNumber = userDetails?.mobileNumber;
  const storeName = localStorage.getItem('orgName');
  const source_location_Id = localStorage.getItem('locId'); //RLC_40
  const source_location_name = localStorage.getItem('locName');
  const org_Id = localStorage.getItem('orgId'); //RET_39
  const createByNameVal = localStorage.getItem('user_name');
  const showSnackbar = useSnackbar();
  const [search, setSearch] = useState('');
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(false);
  const [ticketList, setTicketList] = useState({
    loader: false,
    dataRows: [],
    total: 0,
    page: 0,
    pageSize: 10,
    sortOrder: 'DESCENDING',
    sortBy: 'created',
    search: '',
  });
  const [filters, setFilters] = useState({
    product: null,
    feature: null,
    status: null,
    createdByName: null,
  });
  const [totalTicketSummary, setTotalTicketSummary] = useState({});
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const debounceSearch = useDebounce(search, 300);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleOpen = () => {
    navigate('/project/create');
  };

  // useEffect(() => {

  //   fetchTicketList(source_location_Id, org_Id, ticketList.page);
  // }, [ticketList?.page]);

  useEffect(() => {
    const fetchData = async () => {
      if (filters?.product || filters?.feature || filters?.status || filters?.createdByName) {
        await handleApplyFilter(source_location_Id, org_Id, ticketList?.page + 1);
      } else {
        await fetchTicketList(source_location_Id, org_Id, ticketList?.page);
      }
    };
    fetchData();
  }, [ticketList.page, ticketList.search]);

  const fetchTicketList = async (sourceLocationId, orgId, pageNumber = ticketList.page) => {
    const apiPayload = {
      pageNumber,
      pageSize: 10,
      sortOrder: ticketList?.sortOrder,
      sortBy: ticketList?.sortBy,
      search: ticketList?.search,
    };
    setTicketList((prevState) => ({ ...prevState, loader: true }));
    try {
      const response = await getTicketList(sourceLocationId, orgId, apiPayload);
      if (response?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      const rowData = response?.data?.data?.tickets?.map((ticketData, index) => {
        return {
          id: index,
          title: ticketData?.title,
          ticketId: ticketData?.ticketId,
          product: ticketData?.product,
          feature: ticketData?.feature,
          status: ticketData?.status,
          storeName: ticketData?.storeName,
          created: ticketData?.created,
          createdByName: ticketData?.createdByName,
        };
      });

      const formattedData = rowData?.map((task) => ({
        ...task,
        created: formatDate(task?.created),
      }));

      setTicketList((prevState) => ({
        ...prevState,
        dataRows: formattedData || [],
        total: response?.data?.data?.count || 0,
        loader: false,
      }));
      showSnackbar(response?.data?.data?.message, 'success');
    } catch (error) {
      showSnackbar(response?.data?.data?.message, 'error');
      setTicketList((prevState) => ({ ...prevState, loader: false }));
    }
  };

  useEffect(() => {
    // if (debounceSearch) {
    setTicketList((prevTask) => ({
      ...prevTask,
      search: debounceSearch || '',
      page: 0,
    }));
    // }
  }, [debounceSearch]);

  useEffect(() => {
    if (source_location_Id && org_Id) {
      fetchTicketSummary();
    }
  }, []);

  const fetchTicketSummary = async () => {
    const payload = {
      locationId: source_location_Id,
      organizationId: org_Id,
    };
    try {
      setSummaryLoader(true);
      const response = await ticketSummary(payload);
      if (response?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }

      setTotalTicketSummary(response?.data?.data?.data);

      setSummaryLoader(false);
    } catch (err) {
      setSummaryLoader(false);
      showSnackbar(err?.data?.data?.message, 'error');
    }
  };

  const handleChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    setIsFilterApplied(true);

    if (name === 'product') {
      setSelectedProject(value?.value);
    }
  };

  const handlePageChange = (newPage) => {
    setTicketList((prevTask) => ({
      ...prevTask,
      page: newPage,
    }));

    // if (isFilterApplied) {
    //   handleApplyFilter(source_location_Id, org_Id, newPage + 1);
    // } else {
    //   fetchTicketList(source_location_Id, org_Id, newPage);
    // }
  };

  const handleSizeChange = (newPageSize) => {
    setTicketList((prevTask) => ({
      ...prevTask,
      pageSize: newPageSize,
      page: 0,
    }));

    // if (isFilterApplied) {
    //   handleApplyFilter(source_location_Id, org_Id, newPage + 1);
    // } else {
    //   fetchTicketList(source_location_Id, org_Id, newPage);
    // }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchFilter = (query) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
  };

  const handleApplyFilter = async (locId, orgId, page = ticketList.page + 1) => {
    // setOpenFilterDialog(false);
    setIsFilterApplied(true);
    try {
      const payload = {
        page,
        pageSize: 10,
        product: filters?.product?.value && [filters?.product?.value],
        feature: filters?.feature?.value && [filters?.feature?.value],
        status: filters?.status?.label && [filters?.status?.label],
        createdByName: filters?.createdByName?.map((val) => val?.label),
        //createdByName: filters?.createdByName?.label && [filters?.createdByName?.label],
      };
      const response = await ticketFilter(locId, orgId, payload);
      const rowData = response?.data?.data?.data?.results?.map((ticketData, index) => {
        return {
          id: index,
          title: ticketData?.taskName,
          ticketId: ticketData?.taskId,
          product: ticketData?.project?.projectName,
          feature: ticketData?.feature?.featureName,
          status: ticketData?.status,
          storeName: ticketData?.selectStore,
          created: ticketData?.created,
          createdByName: ticketData?.createdByName,
        };
      });
      const formattedData = rowData?.map((task) => ({
        ...task,
        created: formatDate(task?.created),
      }));

      setTicketList((prevState) => ({
        ...prevState,
        dataRows: formattedData || [],
        total: response?.data?.data?.data?.totalResults || 0,
        loader: false,
      }));
      showSnackbar(response?.data?.data?.message, 'success');
    } catch (error) {
      showSnackbar(error?.data?.data?.message, 'error');
    }
  };

  const clearData = false;
  const handleClearAllFiltersDynamic = () => {
    setFilters({
      product: null,
      feature: null,
      status: null,
      createdByName: null,
      clearData: null,
    });
  };
  useEffect(() => {
    if (filters?.clearData === null) {
      handleApplyFilter(source_location_Id, org_Id, ticketList?.page + 1);
      setFilters({
        product: null,
        feature: null,
        status: null,
        createdByName: null,
      });
    }
  }, [filters?.clearData]);

  const removeSelectedFilter = (key) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: [],
    }));
  };

  const filterChipData = useMemo(
    () => [
      {
        heading: 'Product',
        label: filters?.product?.label,
        key: 'product',
        condition: filters?.product?.label ? true : false,
      },
      {
        heading: 'Feature',
        label: filters?.feature?.label,
        key: 'feature',
        condition: filters?.feature?.label ? true : false,
      },
      {
        heading: 'User List',
        label: filters?.createdByName?.map((value) => value.label),
        key: 'createdByName',
        condition: filters?.createdByName?.length > 0,
      },
      {
        heading: 'Status',
        label: filters?.status?.label,
        key: 'status',
        condition: filters?.status?.label ? true : false,
      },
    ],
    [filters],
  );

  const filterChipBoxes = (
    <>
      {filterChipData?.map(({ heading, label, key, condition }) => {
        return (
          condition && (
            <FilterChipDisplayBox
              key={key}
              heading={heading}
              label={label}
              objKey={key}
              removeSelectedFilter={removeSelectedFilter}
            />
          )
        );
      })}
    </>
  );
  const filterLength = Object.values(filters).filter((value) => {
    if (Array?.isArray(value)) {
      return value?.length > 0;
    }
    // return value !== null && value !== undefined;
    return value !== null && value !== undefined && value !== '';
  }).length;

  const queries = useQueries({
    queries: [
      {
        queryKey: ['projectData', currentPage, debouncedQuery],
        queryFn: () => fetchProjectData(currentPage, debouncedQuery),
        staleTime: 50000,
      },
      {
        queryKey: ['featureDropdown', selectedProject, currentPage, debouncedQuery],
        queryFn: () =>
          selectedProject ? fetchFeatureData(selectedProject, currentPage, debouncedQuery) : Promise.resolve([]),
        enabled: !!selectedProject,
      },
      { queryKey: ['userList'], queryFn: fetchAssignee },
    ],
  });

  const [projectData, featureData, userList] = queries?.map((q) => q.data);
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  let openTicket = ticketList?.dataRows?.filter((item) => {
    let val = item?.status === 'OPEN';

    return val;
  });

  const summaryArray = useMemo(
    () => [
      {
        title: 'Total Tickets',
        value: (
          <>
            <AssignmentTurnedInIcon fontSize="medium" p={12} />

            {totalTicketSummary?.totalTicket}
          </>
        ),
      },
      {
        title: 'Open Tickets',
        value: <>{totalTicketSummary?.openTickets}</>,
      },
      {
        title: 'In Progress',
        value: <>{totalTicketSummary?.inProgressTickets}</>,
      },
      {
        title: 'Closed',
        value: <>{totalTicketSummary?.closedTickets}</>,
      },
    ],
    [totalTicketSummary],
  );

  const projectSelect = (
    <>
      <SoftBox>
        <SoftSelect
          name="product"
          placeholder="Product"
          options={projectData}
          value={filters?.product}
          onChange={(e) => handleChange('product', e)}
        />
      </SoftBox>
    </>
  );

  const featureSelect = (
    <>
      <SoftBox>
        <SoftSelect
          name="feature"
          placeholder="Feature"
          options={featureData}
          value={filters?.feature}
          onChange={(e) => handleChange('feature', e)}
          isDisabled={!filters?.product}
        />
      </SoftBox>
    </>
  );
  const userSelect = (
    <>
      <SoftBox>
        <SoftSelect
          name="createdByName"
          placeholder="User List"
          options={userList}
          value={filters?.createdByName}
          onChange={(e) => handleChange('createdByName', e)}
          isMulti
        />
      </SoftBox>
    </>
  );
  const statusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          name="status"
          placeholder="Status"
          options={[
            { label: 'OPEN', value: 'OPEN' },
            { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
            { label: 'CLOSED', value: 'CLOSED' },
          ]}
          value={filters?.status}
          onChange={(e) => handleChange('status', e)}
        />
      </SoftBox>
    </>
  );
  const selectBoxArray = [projectSelect, featureSelect, userSelect, statusSelect];
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox className="search-bar-filter-and-table-container">
        <SoftBox className="search-bar-filter-container">
          <SoftBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <input
              className="ticket-searchbar"
              name="search"
              value={search}
              placeholder={placeholderVisible ? '' : 'Search by Ticket ID or Ticket Name'}
              onFocus={() => setPlaceholderVisible(true)}
              onBlur={() => setPlaceholderVisible(false)}
              onChange={handleSearch}
            />
            <SoftBox
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 1,
                gap: '9px',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SoftButton color="info" variant="solidWhiteBackground" onClick={handleOpen}>
                  Add Ticket
                </SoftButton>
              </Box>
              <div className="ticket-filters-page">
                <Filter
                  selectBoxArray={selectBoxArray}
                  // [
                  //   <TicketFilters
                  //     isLoading={isLoading}
                  //     filters={filters}
                  //     projectData={projectData}
                  //     featureData={featureData}
                  //     userList={userList}
                  //     onFilterChange={handleChange}
                  //     onInputChange={handleSearchFilter}
                  //   />,
                  // ]

                  filtersApplied={filterLength}
                  filterChipBoxes={filterChipBoxes}
                  handleClearFilter={handleClearAllFiltersDynamic}
                  handleApplyFilter={() => handleApplyFilter(source_location_Id, org_Id)}
                />
              </div>
            </SoftBox>
          </SoftBox>
          <TableSummaryDiv
            summaryHeading={'Ticket Summary'}
            summaryArray={summaryArray}
            loader={summaryLoader}
            // length={summaryArray.length}
          />
        </SoftBox>

        <TicketListing
          ticketList={ticketList}
          handlePageChange={handlePageChange}
          handleSizeChange={handleSizeChange}
          fetchTicketList={fetchTicketList}
          fetchTicketSummary={fetchTicketSummary}
        />
      </SoftBox>
    </DashboardLayout>
  );
};

export default Ticket;
