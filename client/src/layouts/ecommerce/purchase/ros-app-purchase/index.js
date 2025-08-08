import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PurchaseIndent from '../../purchase-indent';
import Purchasemain from '../../purchase-main';
import './ros-app-purchase.css';
import PurchaseAdditionalDetails from './components/purchase-additional-details';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MobileFilterComponent from '../../Common/mobile-new-ui-components/mobile-filter';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import { fetchReturnSummary, getAllOrgUsers, purchaseTodaySummary } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { textFormatter } from '../../Common/CommonFunction';
import Vendor from '../../vendor';
import Purchasebills from '../../purchase-bills';
import PurchaseExclusive from '../../purchase-exclusive';
import CommonMobileTabs from '../../Common/mobile-new-ui-components/Common-mobile-tabs';
import PurchaseReturns from '../../purchase-returns';
import CreditNoteTransferListing from '../../credit-note-transfer';
import CreditNoteTransfer from '../../vendor/components/vendor-details-page/credit-note-transfer-creation';
import { useDispatch } from 'react-redux';
import { resetCommonReduxState } from '../../../../datamanagement/Filters/commonFilterSlice';

const RosAppPurchasePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('purchaseId') || '');
  const [activePurchaseTab, setActivePurchaseTab] = useState(searchParams.get('value'));
  const orgId = useMemo(() => localStorage.getItem('orgId'), []);
  const locId = useMemo(() => localStorage.getItem('locId'), []);
  const contextId = useMemo(() => localStorage.getItem('locId'), []);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [billsAdditionalDetails, setBillsAdditionalDetails] = useState();
  const [purchaseAdditionalDetails, setPurchaseAdditionalDetails] = useState();
  const [returnSummaryData, setReturnSummaryData] = useState();
  const [OpenCreditTransferModalMob, setOpenCreditTransferModalMob] = useState(false);

  useEffect(() => {
    const tabValue = searchParams.get('value');
    if (tabValue !== activePurchaseTab) {
      setActivePurchaseTab(tabValue);
      setMainSelectedFilter('');
      setSelectedSubFilters({});
    }
  }, [searchParams]);

  const purchaseTabs = useMemo(
    () => [
      {
        tabName: 'Purchase Indent (PI)',
        tabValue: 'purchaseIndent',
        active: activePurchaseTab === 'purchaseIndent' ? true : false,
      },
      {
        tabName: 'Purchase Order (PO)',
        tabValue: 'purchaseOrder',
        active: activePurchaseTab === 'purchaseOrder' ? true : false,
      },
      { tabName: 'Vendors', tabValue: 'vendors', active: activePurchaseTab === 'vendors' ? true : false },
      { tabName: 'Bills', tabValue: 'bills', active: activePurchaseTab === 'bills' ? true : false },
      { tabName: 'GRN', tabValue: 'grn', active: activePurchaseTab === 'grn' ? true : false },
      { tabName: 'Return', tabValue: 'return', active: activePurchaseTab === 'return' ? true : false },
      {
        tabName: 'Credit Note Transfer',
        tabValue: 'creditNoteTransfer',
        active: activePurchaseTab === 'creditNoteTransfer' ? true : false,
      },
    ],
    [activePurchaseTab, searchParams.get('value')],
  );

  const tabChangeHandler = (tabValue) => {
    setActivePurchaseTab(tabValue);
    searchParams.set('value', tabValue);
    searchParams.delete('purchaseId');
    searchParams.delete('page');
    searchParams.delete('modal');
    setSearchParams(searchParams);
    setSearchValue('');
    setMainSelectedFilter('');
    setSelectedSubFilters({});
    // reset the redux state of filter
    dispatch(resetCommonReduxState());
  };

  const fetchPurchaseSummaryDetails = async () => {
    try {
      const response = await purchaseTodaySummary(contextId);
      setPurchaseAdditionalDetails(response?.data?.data);
    } catch (error) {}
  };

  const fetchReturnSummaryDetails = async () => {
    try {
      const response = await fetchReturnSummary(orgId, locId);
      setReturnSummaryData(response?.data?.data);
    } catch (error) {}
  };
  const additionalDetailsArray = useMemo(
    () =>
      activePurchaseTab === 'bills'
        ? [
            {
              title: `Total Outstanding Payables`,
              value: `₹${billsAdditionalDetails?.totalOutstanding ?? 'NA'}`,
            },
            {
              title: `Due Today`,
              value: `₹${billsAdditionalDetails?.dueToday ?? 'NA'}`,
            },
            {
              title: `Due Within 7 days`,
              value: `₹${billsAdditionalDetails?.dueIn7days ?? 'NA'}`,
            },
            {
              title: `Due Withing 30 days`,
              value: `₹${billsAdditionalDetails?.dueIn30Days ?? 'NA'}`,
            },
            {
              title: `Overdue`,
              value: `₹${billsAdditionalDetails?.overdue ?? 'NA'}`,
            },
          ]
        : activePurchaseTab === 'return'
        ? [
            {
              title: `Total Outstanding Receivable`,
              value: `₹${returnSummaryData?.totalOutstanding ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">
                  From {returnSummaryData?.totalOutstandingCount ?? '0'} returns
                </span>
              ),
            },
            {
              title: `Open debit notes`,
              value: `₹${returnSummaryData?.openDebitNote ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">
                  From {returnSummaryData?.openDebitNoteCount ?? '0'} returns
                </span>
              ),
            },
            {
              title: `Replacements`,
              value: `₹${returnSummaryData?.replacement ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">
                  From {returnSummaryData?.replacementCount || '0'} returns
                </span>
              ),
            },
            {
              title: `Material pickup`,
              value: `₹${returnSummaryData?.materialPickUp ?? '0'}`,
              description: <span className="additional-tab-description-mob">pending pickup</span>,
            },
            {
              title: `Material delivery`,
              value: `₹${returnSummaryData?.materialDelivery ?? '0'}`,
              description: <span className="additional-tab-description-mob">pending delivery</span>,
            },
          ]
        : [
            {
              title: `Today's Purchase Order`,
              value: `₹${purchaseAdditionalDetails?.todayPurchase ?? 'NA'}`,
              description: (
                <span className="additional-tab-description-mob">
                  <TrendingUpIcon fontSize="small" />
                  10% compared to yesterday
                </span>
              ),
            },
            {
              title: `Today's Total Inward`,
              value: `₹${purchaseAdditionalDetails?.todayInward ?? 'NA'}`,
              description: (
                <span className="additional-tab-description-mob">
                  <TrendingUpIcon fontSize="small" />
                  10% compared to yesterday
                </span>
              ),
            },
            {
              title: `Total Return`,
              value: `₹${purchaseAdditionalDetails?.todayReturn ?? 'NA'}`,
              description: (
                <span className="additional-tab-description-mob">
                  <TrendingUpIcon fontSize="small" />
                  10% compared to yesterday
                </span>
              ),
            },
            {
              title: `Credit Note`,
              value: `₹${purchaseAdditionalDetails?.todayCreditNote ?? 'NA'}`,
              description: (
                <span className="additional-tab-description-mob">
                  <TrendingUpIcon fontSize="small" />
                  10% compared to yesterday
                </span>
              ),
            },
            {
              title: `Return Rejected`,
              value: `₹${purchaseAdditionalDetails?.todayReturnRejected ?? 'NA'}`,
              description: (
                <span className="additional-tab-description-mob">
                  <TrendingUpIcon fontSize="small" />
                  10% compared to yesterday
                </span>
              ),
            },
          ],
    [activePurchaseTab, billsAdditionalDetails, purchaseAdditionalDetails, returnSummaryData],
  );

  const filters = useMemo(
    () =>
      activePurchaseTab === 'purchaseIndent'
        ? [
            { filterLabel: 'Users', filterValue: 'users' },
            { filterLabel: 'Status', filterValue: 'status' },
            // { filterLabel: 'Date', filterValue: 'date' },
          ]
        : activePurchaseTab === 'purchaseOrder'
        ? [
            { filterLabel: 'Status', filterValue: 'status' },
            // { filterLabel: 'Vendor', filterValue: 'vendor' },
            { filterLabel: 'Start Date', filterValue: 'startDate' },
            { filterLabel: 'End Date', filterValue: 'endDate' },
          ]
        : activePurchaseTab === 'vendors'
        ? [
            { filterLabel: 'Vendor Status', filterValue: 'vendorStatus' },
            { filterLabel: 'Vendor Type', filterValue: 'vendorType' },
          ]
        : activePurchaseTab === 'bills'
        ? [
            { filterLabel: 'Status', filterValue: 'status' },
            // { filterLabel: 'Vendor', filterValue: 'vendor' },
          ]
        : activePurchaseTab === 'return'
        ? [{ filterLabel: 'Status', filterValue: 'status' }]
        : null,
    [activePurchaseTab],
  );

  const [userOptions, setUserOptions] = useState([]);
  const fetchUsers = async () => {
    try {
      const payload = {
        orgId: orgId,
        contextId: contextId,
      };
      const response = await getAllOrgUsers(payload);
      const users = response?.data?.data?.map((user) => ({
        value: user?.uidx,
        label: textFormatter(user?.firstName || 'NA'),
      }));
      setUserOptions(users);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || error?.data?.message || 'Something went wrong while fetching users',
        'error',
      );
    }
  };

  const filterOptions = useMemo(
    () =>
      activePurchaseTab === 'purchaseIndent'
        ? {
            // date: [
            //   { value: 'today', label: 'Today' },
            //   { value: 'yesterday', label: 'Yesterday' },
            //   { value: 'thisWeek', label: 'This Week' },
            //   { value: 'thisMonth', label: 'This Month' },
            //   { value: 'custom', label: 'Custom' },
            // ],
            status: [
              { value: 'DRAFT', label: 'Draft' },
              { value: 'CREATED', label: 'In Process' },
              { value: 'APPROVED', label: 'Approved' },
              // { value: 'CLOSED', label: 'Closed' },
            ],
            users: userOptions || [],
          }
        : activePurchaseTab === 'purchaseOrder'
        ? {
            status: [
              { label: 'Created', value: 'CREATED' },
              { label: 'Accepted', value: 'ACCEPTED' },
              { label: 'In Transit', value: 'IN_TRANSIT' },
              { label: 'Partially Inwarded', value: 'PARTIALLY_INWARDED' },
              { label: 'Inwarded', value: 'INWARDED' },
              { label: 'Closed', value: 'CLOSED' },
              { label: 'Rejected', value: 'REJECTED' },
            ],
            // vendor: [],
            startDate: [{ value: 'custom', label: 'Custom' }],
            endDate: [{ value: 'custom', label: 'Custom' }],
          }
        : activePurchaseTab === 'vendors'
        ? {
            vendorStatus: [
              { value: 'CREATED', label: 'Created' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'BLACKLISTED', label: 'Blacklisted' },
            ],
            vendorType: [
              { value: 'MANUFACTURER', label: 'Manufacturer' },
              { value: 'WHOLESALER', label: 'Wholesaler' },
              { value: 'DISTRIBUTOR', label: 'Distributor' },
              { value: 'RETAILER', label: 'Retailer' },
              { value: 'INDIVIDUAL', label: 'Individual' },
              { value: 'RESELLER', label: 'Reseller' },
            ],
          }
        : activePurchaseTab === 'bills'
        ? {
            status: [
              { label: 'Created', value: 'CREATED' },
              { label: 'Accepted', value: 'ACCEPTED' },
              { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
              { label: 'Paid', value: 'PAID' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'Closed', value: 'CLOSED' },
            ],
            // vendor: [],
          }
        : activePurchaseTab === 'return'
        ? {
            status: [
              { value: 'DRAFT', label: 'Draft' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Reject' },
            ],
            // vendor: [],
          }
        : null,
    [userOptions, activePurchaseTab],
  );

  useEffect(() => {
    if (activePurchaseTab === 'purchaseIndent' && isFilterOpened && userOptions?.length === 0) {
      fetchUsers();
    }
    if (activePurchaseTab === 'return') {
      fetchReturnSummaryDetails();
    }
  }, [activePurchaseTab, isFilterOpened]);

  useEffect(() => {
    fetchPurchaseSummaryDetails();
  }, []);

  const onSearchFunction = (e) => {
    setSearchValue(e.target.value);
    if (activePurchaseTab === 'creditNoteTransfer') {
      return;
    }

    if (e.target.value === '') {
      searchParams.delete('purchaseId');
      setSearchParams(searchParams);
    } else {
      searchParams.set('purchaseId', e.target.value);
      setSearchParams(searchParams);
    }
  };

  const titleHandler = useCallback(() => {
    let title =
      activePurchaseTab === 'purchaseIndent'
        ? 'Purchase Indent'
        : activePurchaseTab === 'purchaseOrder'
        ? 'Purchase Order'
        : activePurchaseTab === 'vendors'
        ? 'Vendors'
        : activePurchaseTab === 'bills'
        ? 'Bills'
        : activePurchaseTab === 'grn'
        ? 'Inward (GRN)'
        : activePurchaseTab === 'return'
        ? 'Return'
        : activePurchaseTab === 'creditNoteTransfer'
        ? 'Credit Note Transfers'
        : 'NA';

    return title;
  }, [activePurchaseTab]);

  const filter_CreateHandler = useCallback(() => {
    let title =
      activePurchaseTab === 'purchaseIndent'
        ? {
            filter: true,
            create: true,
          }
        : activePurchaseTab === 'purchaseOrder'
        ? {
            filter: true,
            create: true,
          }
        : activePurchaseTab === 'vendors'
        ? {
            filter: true,
            create: false,
          }
        : activePurchaseTab === 'bills'
        ? {
            filter: true,
            create: false,
          }
        : activePurchaseTab === 'grn'
        ? {
            filter: false,
            create: false,
          }
        : activePurchaseTab === 'return'
        ? {
            filter: false,
            create: false,
          }
        : activePurchaseTab === 'creditNoteTransfer'
        ? {
            filter: false,
            create: true,
          }
        : 'NA';

    return title;
  }, [activePurchaseTab]);

  const createButtonFunction = useCallback(() => {
    if (activePurchaseTab === 'creditNoteTransfer') {
      setOpenCreditTransferModalMob(true);
      return;
    }

    let navigation =
      activePurchaseTab === 'purchaseIndent' || activePurchaseTab === 'purchaseOrder'
        ? '/purchase/purchase-indent/create-purchase-indent'
        : activePurchaseTab === 'vendors'
        ? '/upcoming-feature'
        : activePurchaseTab === 'grn'
        ? '/upcoming-feature'
        : activePurchaseTab === 'return'
        ? '/upcoming-feature'
        : null;

    if (activePurchaseTab === 'purchaseIndent' || activePurchaseTab === 'purchaseOrder') {
      localStorage.removeItem('piNum');
    }
    navigate(navigation);
  }, [activePurchaseTab]);

  const getSearchPlaceholder = () => {
    return activePurchaseTab === 'purchaseIndent'
      ? 'PI'
      : activePurchaseTab === 'purchaseOrder'
      ? 'PO'
      : activePurchaseTab === 'vendors'
      ? 'Vendor'
      : activePurchaseTab === 'bills'
      ? 'Bills'
      : activePurchaseTab === 'grn'
      ? 'GRN'
      : activePurchaseTab === 'return'
      ? 'Return'
      : activePurchaseTab === 'creditNoteTransfer'
      ? 'Credit Note Transfer'
      : null;
  };

  return (
    <div className="ros-purchase-app-parent-container">
      <div className="purchase-tabs-main-div">
        <CommonMobileTabs tabs={purchaseTabs} onTabChange={tabChangeHandler} />
      </div>
      <div>
        {activePurchaseTab !== 'creditNoteTransfer' && (
          <PurchaseAdditionalDetails additionalDetailsArray={additionalDetailsArray} />
        )}
      </div>
      <div>
        <MobileSearchBar
          placeholder={`Search ${getSearchPlaceholder()}`}
          onChangeFunction={onSearchFunction}
          value={searchValue}
        />
      </div>
      <div>
        <MobileFilterComponent
          filters={filters}
          filterOptions={filterOptions}
          createButtonTitle={titleHandler()}
          createButtonFunction={createButtonFunction}
          mainSelecetedFilter={mainSelecetedFilter}
          setMainSelectedFilter={setMainSelectedFilter}
          selectedSubFilters={selectedSubFilters}
          setSelectedSubFilters={setSelectedSubFilters}
          applyFilter={applyFilter}
          setApplyFilter={setApplyFilter}
          isFilterOpened={isFilterOpened}
          setIsFilterOpened={setIsFilterOpened}
          filterCreateExist={filter_CreateHandler()}
        />
      </div>

      <div className="ros-app-purchase-component-main-div">
        {activePurchaseTab === 'purchaseIndent' && (
          <PurchaseIndent
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            applyFilter={applyFilter}
            setApplyFilter={setApplyFilter}
            mobileSearchedValue={activePurchaseTab === 'purchaseIndent' && searchValue}
          />
        )}
        {activePurchaseTab === 'purchaseOrder' && (
          <Purchasemain
            mobileSearchedValue={activePurchaseTab === 'purchaseOrder' && searchValue}
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            applyFilter={applyFilter}
            setApplyFilter={setApplyFilter}
          />
        )}
        {activePurchaseTab === 'vendors' && (
          <Vendor
            mobileSearchedValue={activePurchaseTab === 'vendors' ? searchValue : ''}
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            applyFilter={applyFilter}
            setApplyFilter={setApplyFilter}
          />
        )}
        {activePurchaseTab === 'bills' && (
          <Purchasebills
            mobileSearchedValue={activePurchaseTab === 'bills' && searchValue}
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            applyFilter={applyFilter}
            setApplyFilter={setApplyFilter}
            setBillsAdditionalDetails={setBillsAdditionalDetails}
          />
        )}
        {activePurchaseTab === 'grn' && (
          // <
          <PurchaseExclusive
            mobileSearchedValue={activePurchaseTab === 'grn' ? searchValue : ''}
            // filters={selectedSubFilters}
            // setIsFilterOpened={setIsFilterOpened}
            // applyFilter={applyFilter}
            // setApplyFilter={setApplyFilter}
          />
        )}
        {activePurchaseTab === 'return' && (
          // <
          <PurchaseReturns
            mobileSearchedValue={activePurchaseTab === 'return' ? searchValue : ''}
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            applyFilter={applyFilter}
            setApplyFilter={setApplyFilter}
          />
        )}
        {activePurchaseTab === 'creditNoteTransfer' && (
          <CreditNoteTransferListing
            mobileSearchedValue={activePurchaseTab === 'creditNoteTransfer' ? searchValue : ''}
            OpenCreditTransferModalMob={OpenCreditTransferModalMob}
            setOpenCreditTransferModalMob={setOpenCreditTransferModalMob}
          />
        )}
      </div>
    </div>
  );
};

export default RosAppPurchasePage;
