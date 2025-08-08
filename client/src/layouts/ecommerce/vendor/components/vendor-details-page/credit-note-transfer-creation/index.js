import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftAsyncPaginate from '../../../../../../components/SoftSelect/SoftAsyncPaginate';
import SoftTypography from '../../../../../../components/SoftTypography';
import { createCreditNoteTransfer, getAllVendors, getVendorVendorCredit } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../../../Common/buttonColor';
import './index.css';

export default function CreditNoteTransfer({
  orgId,
  vendorId,
  displayName,
  vendorCredits,
  OpenCreditTransfer,
  setOpenCreditTransfer,
  handleCreditNoteTransferModal,
  isMobileDevice,
  reloadFn,
  setCreditTransferCreated
}) {
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : null;
  const showSnackbar = useSnackbar();
  const [openModal, setOpenModal] = useState(OpenCreditTransfer);

  const [selectedSourceVendor, setSelectedSourceVendor] = useState({ value: vendorId, label: displayName } || '');
  const [selectedDestinationVendor, setSelectedDestinationVendor] = useState('');

  const [fetchedVendorCredits, setFetchedVendorCredits] = useState('');
  const [creditsToTransfer, setCreditsToTransfer] = useState(null);

  const handleCloseModal = () => {
    setOpenCreditTransfer && setOpenCreditTransfer(false);
    handleCreditNoteTransferModal && handleCreditNoteTransferModal();
    setOpenModal(false);
  };

  const handleVendor = (option, selected) => {
    if (selected === 'destinationVendor') {
      if (selectedSourceVendor?.value && selectedSourceVendor?.value === option?.value) {
        showSnackbar("Source and destination vendor can't be same", 'warning');
      } else {
        setSelectedDestinationVendor(option);
      }
    } else {
      if (selectedDestinationVendor?.value && selectedDestinationVendor?.value === option?.value) {
        showSnackbar("Source and destination vendor can't be same");
      } else {
        setSelectedSourceVendor(option);
      }
    }
    // }
  };

  const handleCreditsToTransfer = ({ target }) => {
    const value = target.value;

    // Ensure the value is greater than 0 and less than or equal to the available credits
    if (value === "" || (Number(value) > 0 && Number(value) <= Number(fetchedVendorCredits)) || (Number(value) > 0 && Number(value) <= Number(vendorCredits))) {
      setCreditsToTransfer(value);
    } else {
      showSnackbar('Value should be greater than 0 and less than or equal to available credits');
      target.value = creditsToTransfer;
    }
  };

  const loadVendorOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      filterVendor: {
        searchText: searchQuery,
        startDate: '',
        endDate: '',
        locations: [],
        type: [],
        productName: [],
        // status: ['APPROVED'],
        status: [],
        productGTIN: [],
        vendorType: [],
      },
    };

    try {
      const res = await getAllVendors(payload, orgId);
      const data = res?.data?.data?.vendors || [];

      let vendorsArr = data?.map((e) => ({
        value: e?.vendorId,
        label: e?.vendorName,
      }));

      return {
        options: vendorsArr,
        hasMore: data?.length >= 50, // Check if there are more results
        additional: { page: page + 1 }, // Increment page for the next load
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const getSourceVendorCredits = async (vendor_id) => {
    try {
      const response = await getVendorVendorCredit(vendor_id);

      if (response?.data?.status === 'ERROR') {
        showSnackbar(response?.data?.message || 'Something went wrong', 'error');
        return;
      }
      setFetchedVendorCredits(response?.data?.data?.availableCredits);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  const creditNoteTransferValidation = () => {
    if (
      creditsToTransfer === 0 ||
      creditsToTransfer > fetchedVendorCredits ||
      creditsToTransfer > vendorCredits ||
      creditsToTransfer === null ||
      creditsToTransfer === undefined ||
      creditsToTransfer === ''
    ) {
      showSnackbar('transferred credits cannot be 0', 'error');
      return false;
    }

    if (!selectedDestinationVendor?.value || !selectedSourceVendor?.value) {
      showSnackbar('source and destination vendor cannot be empty', 'error');
      return false;
    }

    if (selectedDestinationVendor?.value === selectedSourceVendor?.value) {
      showSnackbar('source and destination vendor cannot be same', 'error');
      return false;
    }

    return true;
  };

  const handleCreditNoteTransfer = async () => {
    const payload = {
      sourceVendorId: vendorId || selectedSourceVendor?.value,
      destinationVendorId: selectedDestinationVendor?.value,
      orgId: orgId,
      transferredByUidx: userInfo?.uidx,
      amount: Number(creditsToTransfer),
      transferredByName: userInfo?.firstName + ' ' + userInfo?.secondName,
    };

    try {
      // ensure credits to transfer should not be 0, or greater than avilable credits and source and destination vendor cannot be same
      const isValidated = creditNoteTransferValidation();
      if (!isValidated) {
        return;
      }

      const response = await createCreditNoteTransfer(payload);

      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message || 'Something went wrong', 'error');
        handleCloseModal();
        return;
      }
      showSnackbar(response?.data?.data?.message, 'success');
      if(reloadFn){
        reloadFn();
      }
      if(setCreditTransferCreated){
        setCreditTransferCreated(true);
      }
      handleCloseModal();
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  useEffect(() => {
    if (selectedSourceVendor?.value) {
      getSourceVendorCredits(selectedSourceVendor?.value);
    }
  }, [selectedSourceVendor]);

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SoftBox
        sx={{ padding: '20px' }}
        className={isMobileDevice ? 'credit-note-transfer-modal-mobile' : 'credit-note-transfer-modal-desktop '}
      >
        <SoftTypography fontSize="16px" fontWeight="bold" className="credit-note-transfer-title">
          Transfer Credit Note
        </SoftTypography>
        <SoftBox className="mtop">
          <SoftTypography fontSize="14px">
            <span className="fw-bold"> Source Vendor: </span>
            {displayName ? displayName : null}
            {!displayName && (
              <>
                <SoftBox className="all-products-filter-product">
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-select-box"
                    placeholder="Vendor"
                    name="vendor"
                    loadOptions={(searchQuery, loadedOptions, additional) => {
                      return loadVendorOptions(searchQuery, loadedOptions, additional);
                    }}
                    additional={{ page: 1 }} // Start with page 1
                    value={
                      selectedSourceVendor?.label
                        ? { value: selectedSourceVendor.value, label: selectedSourceVendor.label }
                        : { value: '', label: 'Select Vendor' }
                    }
                    onChange={(option) => {
                      handleVendor(option, 'sourceVendor');
                    }}
                  />
                </SoftBox>
              </>
            )}
            {/* vendor credits  */}
            {(vendorCredits || fetchedVendorCredits) && (
              <SoftBox className="margin-t-12">
                <span className="fw-bold"> Available Credits: </span>
                {vendorCredits || fetchedVendorCredits || 'N/A'}
              </SoftBox>
            )}
          </SoftTypography>
          {/* credits to transfer  */}
          <SoftBox className="margin-t-12">
            <SoftTypography fontSize="14px" fontWeight="bold">
              Enter Credits to Transfer:
            </SoftTypography>
            <SoftInput placeholder="Enter" value={creditsToTransfer} onChange={handleCreditsToTransfer} type="number" />
          </SoftBox>
          <SoftBox className="margin-t-12">
            <SoftTypography fontSize="14px" fontWeight="bold">
              Destination Vendor
            </SoftTypography>
            <SoftBox className="all-products-filter-product">
              <SoftAsyncPaginate
                className="all-products-filter-soft-select-box"
                placeholder="Vendor"
                name="vendor"
                loadOptions={(searchQuery, loadedOptions, additional) =>
                  loadVendorOptions(searchQuery, loadedOptions, additional)
                }
                additional={{ page: 1 }} // Start with page 1
                value={
                  selectedDestinationVendor?.label
                    ? { value: selectedDestinationVendor.value, label: selectedDestinationVendor.label }
                    : { value: '', label: 'Select Vendor' }
                }
                onChange={(option) => {
                  handleVendor(option, 'destinationVendor');
                }}
              />
            </SoftBox>
          </SoftBox>
        </SoftBox>
        <br />
        <br />
        <SoftBox className="content-right">
          <SoftButton variant="outlined" className="outlined-softbutton" onClick={handleCloseModal}>
            Cancel
          </SoftButton>
          <SoftButton
            variant={buttonStyles.primaryVariant}
            onClick={handleCreditNoteTransfer}
            className="vendor-add-btn contained-softbutton"
          >
            Save
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </Modal>
  );
}
