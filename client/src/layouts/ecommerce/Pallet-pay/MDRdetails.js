import './PalletPay.css';
import { Box } from '@mui/material';
import { getMdrRates, mdrUpdates } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import Checkbox from '@mui/material/Checkbox';
import Collapsible from './Collapsible';
import CollapsibleEdit from './CollapsibleEdit';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import React, { memo, useEffect, useRef, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from '../../../components/Spinner';

const MDRdetails = () => {
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const [passTransactionCheck, setPassTransactionCheck] = useState(false);

  const [loader, setLoader] = useState(false);
  const [transactionChargeType, setTransactionChargeType] = useState(null);
  const [gst, setGst] = useState('');

  const [isTransactionChargeSame, setIsTransactionChargeSame] = useState(true);
  const [creditCardList, setCreditCardList] = useState([]);
  const [isExpandedCredit, setIsExpandedCredit] = useState(true);
  const [heightCredit, setHeightCredit] = useState(null);
  const [debitCardList, setDebitCardList] = useState([]);
  const [isExpandedDebit, setIsExpandedDebit] = useState(true);
  const [height, setHeight] = useState(null);

  const [editDebitCardList, setEditDebitCardList] = useState([]);
  const [isExpandedEditDebit, setIsExpandedEditDebit] = useState(true);
  const [editHeightDebit, setEditHeightDebit] = useState(null);
  const [editCreditCardList, setEditCreditCardList] = useState([]);
  const [isExpandedEditCredit, setIsExpandedEditCredit] = useState(true);
  const [editHeightCredit, setEditHeightCredit] = useState(null);

  const [dataFound, setDataFound] = useState(false);

  const ref = useRef();

  const currentHeightCredit = isExpandedCredit ? heightCredit : 0;

  const handleToggleCredit = () => {
    setIsExpandedCredit(!isExpandedCredit);
    setHeightCredit(isExpandedCredit ? 0 : ref.current.clientHeight);
  };

  const handleToggleDebit = () => {
    setIsExpandedDebit(!isExpandedDebit);
    setHeight(isExpandedDebit ? 0 : ref.current.clientHeight);
  };

  const currentHeight = isExpandedDebit ? height : 0;

  //for edit credit-debit charges
  const currentEditHeightCredit = isExpandedEditCredit ? editHeightCredit : 0;

  const handleToggleEditCredit = (e) => {
    e.stopPropagation();
    setIsExpandedEditCredit(!isExpandedEditCredit);
    setEditHeightCredit(isExpandedEditCredit ? 0 : ref.current.clientHeight);
  };

  const handleEditCreditRate = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const rate = e.target.value;
    const newEditCreditList = [...editCreditCardList];
    // console.log(rate, index, newEditCreditList);
    newEditCreditList[index]['merchantRate'] = rate;
    console.log({ newEditCreditList, creditCardList });
    setEditCreditCardList(newEditCreditList);
  };

  const currentEditHeightDebit = isExpandedEditDebit ? editHeightDebit : 0;

  const handleToggleEditDebit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpandedEditDebit(!isExpandedEditDebit);
    setEditHeightDebit(isExpandedEditDebit ? 0 : ref.current.clientHeight);
  };

  const handleEditDebitRate = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const rate = e.target.value;

    const newEditDebitList = [...editDebitCardList];
    // console.log(rate, index, newEditDebitList);
    newEditDebitList[index]['merchantRate'] = rate;
    // console.log({ newEditDebitList, debitCardList });
    // console.log({ newEditDebitList, debitCardList });
    setEditDebitCardList(newEditDebitList);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '16px',
  };

  const boxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    marginBottom: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    width: '300px',
  };

  const leftTextStyle = {
    marginRight: '16px',
  };

  const rightTextStyle = {
    fontWeight: 'bold',
  };

  const handlePassTransactionCheck = (e) => {
    const isChecked = e.target.checked;
    setPassTransactionCheck(isChecked);
  };

  const handleSameTransactionCharges = (e) => {
    const isChecked = e.target.checked;
    setIsTransactionChargeSame(isChecked);
  };

  const deepCloneArrayOfObjects = (arr) => {
    return arr.map((obj) => {
      return { ...obj };
    });
  };

  const filterCardMethod = (data, method) => {
    return data.filter((item) => item.method === method);
  };

  const fetchMdrDetails = async () => {
    try {
      const response = await getMdrRates(orgId);
      // console.log('response', response);

      if (response?.data?.data?.es == 0) {
        const paymentMethod = response.data.data.data;
        // console.log('result', paymentMethod);

        // separate lists for Credit Card and Debit Card data
        const creditCardData = [
          ...filterCardMethod(paymentMethod['American Express'], 'CREDIT_CARD'),
          ...filterCardMethod(paymentMethod['Master Card'], 'CREDIT_CARD'),
          ...filterCardMethod(paymentMethod['Rupay'], 'CREDIT_CARD'),
          ...filterCardMethod(paymentMethod['Sodexo'], 'CREDIT_CARD'),
          ...filterCardMethod(paymentMethod['Upi'], 'CREDIT_CARD'),
          ...filterCardMethod(paymentMethod['Visa'], 'CREDIT_CARD'),
        ];

        const debitCardData = [
          ...filterCardMethod(paymentMethod['American Express'], 'DEBIT_CARD'),
          ...filterCardMethod(paymentMethod['Master Card'], 'DEBIT_CARD'),
          ...filterCardMethod(paymentMethod['Rupay'], 'DEBIT_CARD'),
          ...filterCardMethod(paymentMethod['Sodexo'], 'DEBIT_CARD'),
          ...filterCardMethod(paymentMethod['Upi'], 'DEBIT_CARD'),
          ...filterCardMethod(paymentMethod['Visa'], 'DEBIT_CARD'),
        ];

        const copyDebitData = deepCloneArrayOfObjects(debitCardData);
        const copyCreditData = deepCloneArrayOfObjects(creditCardData);

        // console.log({ debitCardData, creditCardData });
        setDebitCardList(debitCardData);
        setCreditCardList(creditCardData);
        setEditCreditCardList(copyCreditData);
        setEditDebitCardList(copyDebitData);
      }
      if (response?.data?.data?.es == 1) {
        setDataFound(true);
      }
    } catch (e) {
      setDataFound(true);
    }
  };

  useEffect(() => {
    fetchMdrDetails();
  }, []);

  const handleTransactionInTaxInvoice = (option) => {
    // console.log('transactionInvoice', option);
    setTransactionChargeType(option);
  };
  const handleGst = (e) => {
    const value = e.target.value;
    // console.log(value);
    setGst(e.target.value);
  };

  const handleSave = async () => {
    if (transactionChargeType == null) {
      showSnackbar('Please include transaction charges in your tax invoice', 'warning');
      return;
    }
    if (gst == '' || gst.length == 0) {
      showSnackbar('Please enter gst', 'warning');
      return;
    }

    const updateMdr = [...editDebitCardList, ...editCreditCardList].map((item) => ({
      ...item,
      transactionChargeType: transactionChargeType.value,
      gstRate: gst,
    }));
    // console.log('save', updateMdr);

    setLoader(true);
    try {
      const resp = await mdrUpdates(updateMdr);
      setLoader(false);
      const message = resp?.data?.data?.message;
      // console.log('message', message);
      showSnackbar(message, 'success');
      setTransactionChargeType(null);
      setGst('');
      // console.log({ resp });
    } catch (err) {
      setLoader(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftTypography
        sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        MDR Details
      </SoftTypography>

      {!dataFound ? (
        <SoftBox className="mdr-details-data">
          <SoftBox className="mdr-details">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {/* <SoftTypography className="mdr-card-header">Transaction type</SoftTypography> */}
              <SoftTypography className="mdr-card-header">Charges</SoftTypography>
            </Box>

            <Collapsible
              data={debitCardList}
              title={'Debit Card'}
              handleToggle={handleToggleDebit}
              isExpanded={isExpandedDebit}
              currentHeight={currentHeight}
              ref={ref}
            />

            <Collapsible
              data={creditCardList}
              title={'Credit Card'}
              handleToggle={handleToggleCredit}
              isExpanded={isExpandedCredit}
              currentHeight={currentHeightCredit}
              ref={ref}
            />
          </SoftBox>

          <SoftBox className="pass-transaction">
            <Box className="pass-transaction-check">
              <Checkbox checked={passTransactionCheck} onChange={handlePassTransactionCheck} />
              <SoftTypography className="transaction-check-description">
                Pass transaction charges to your customer
              </SoftTypography>
            </Box>
            {passTransactionCheck ? (
              <Box className="caution">
                <SoftTypography
                  className="caution-description"
                  sx={{
                    color: 'red',
                  }}
                >
                  Caution:
                </SoftTypography>
                <SoftTypography
                  className="caution-description"
                  sx={{
                    fontSize: '16px !important',
                    lineHeight: '22.85px !important',
                    color: '#7c7c7c !important',
                  }}
                >
                  As per Govt. Of india mandate,merchant should not charge customers/cardholders for making payment
                  through any digital channel viz QR code,BHIM/UPI,POS,Aadhar-pay. If any such instance is observed, the
                  digital facility will be deactivated and legal action can also be initiated.
                </SoftTypography>
              </Box>
            ) : null}
          </SoftBox>

          <SoftBox className="pass-transaction">
            <Box className="pass-transaction-check">
              <Checkbox checked={isTransactionChargeSame} onChange={handleSameTransactionCharges} />
              <SoftTypography className="transaction-check-description">
                Charge the same transaction charges to your customer
              </SoftTypography>
            </Box>

            {isTransactionChargeSame ? null : (
              <SoftBox className="mdr-details">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* <SoftTypography className="mdr-card-header">Transaction type</SoftTypography> */}
                  <SoftTypography className="mdr-card-header">Charges</SoftTypography>
                </Box>

                <CollapsibleEdit
                  data={editDebitCardList}
                  title={'Debit Card'}
                  handleToggle={handleToggleEditDebit}
                  isExpanded={isExpandedEditDebit}
                  currentHeight={currentEditHeightDebit}
                  handleEditRate={handleEditDebitRate}
                  // ref={ref}
                />

                <CollapsibleEdit
                  data={editCreditCardList}
                  title={'Credit Card'}
                  handleToggle={handleToggleEditCredit}
                  isExpanded={isExpandedEditCredit}
                  currentHeight={currentEditHeightCredit}
                  handleEditRate={handleEditCreditRate}
                  // ref={ref}
                />
              </SoftBox>
            )}
          </SoftBox>

          <SoftBox className="invoice-transaction">
            <Box className="invoice-charges">
              <SoftTypography
                sx={{
                  fontSize: '1rem',
                }}
              >
                Include transaction charges in your tax invoice
              </SoftTypography>
              <SoftSelect
                value={transactionChargeType}
                options={[
                  { value: 'CONVENIENCE', label: 'Convenience' },
                  { value: 'TRANSACTION', label: 'Transaction' },
                ]}
                onChange={(option) => handleTransactionInTaxInvoice(option)}
              />
            </Box>
            <Box className="gst-charges">
              <SoftTypography
                sx={{
                  fontSize: '1rem',
                }}
              >
                GST
              </SoftTypography>
              <SoftInput
                value={gst}
                placeholder="Enter gst %"
                type="number"
                sx={{
                  width: '10rem !important',
                }}
                onChange={(e) => handleGst(e)}
              />
            </Box>
          </SoftBox>

          <SoftBox className="save-btn-box">
            {loader ? (
              <Spinner />
            ) : (
              <SoftButton className="save-btn-mdr" onClick={handleSave}>
                Save
              </SoftButton>
            )}
          </SoftBox>
        </SoftBox>
      ) : (
        <SoftBox className="mdr-no-data-found">
          <SoftTypography
            sx={{
              fontSize: '1rem',
            }}
          >
            No MDR data found!
          </SoftTypography>
        </SoftBox>
      )}
    </DashboardLayout>
  );
};

export default memo(MDRdetails);
