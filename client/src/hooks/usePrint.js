import { transforms } from '@react-thermal-printer/image';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Cashdraw, Cut, Image, Line, Printer, Row, Text, render } from 'react-thermal-printer';
import recycleLogo from 'assets/images/recycle_logo3.svg';
import { getRetailDetailsByBranch, getUserFromUidx, getsalesorderdetailsvalue } from '../config/Services';
import { useSnackbar } from './SnackbarProvider';

const formatDate = (date) => moment(date).format('DD/MM/YYYY, LT');

const usePrint = () => {
  const showSnackbar = useSnackbar();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reprint, setReprint] = useState(false);
  const [isB2cOrder, setIsB2cOrder] = useState(false);
  const [printType, setPrintType] = useState('invoice');
  const [pickerName, setPickerName] = useState('');
  const [key, setKey] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [baseOrderResponse, setBaseOrderResponse] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [baseDetails, setBaseDetails] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [orderTokenDetails, setOrderTokenDetails] = useState({});
  const [gstBreakupDetails, setGstBreakupDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [freeProducts, setFreeProducts] = useState([]);
  const [noGst, setNoGst] = useState([]);
  const [gst2slab, setGst2slab] = useState([]);
  const [gst5slab, setGst5slab] = useState([]);
  const [gst6slab, setGst6slab] = useState([]);
  const [gst9slab, setGst9slab] = useState([]);
  const [gst14slab, setGst14slab] = useState([]);
  const [loggedUser, setLoggedUser] = useState('');
  const [date, setDate] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [retailDetails, setRetailDetails] = useState([]);

  const [locationData, setLocationData] = useState(JSON.parse(localStorage.getItem('locationData')));
  const [printerConfig, setPrinterConfig] = useState(JSON.parse(localStorage.getItem('printerConfig')));
  const [retailUserDetails, setRetailUserDetails] = useState(JSON.parse(localStorage.getItem('retailUserDetails')));

  const convertUTCDateToLocalDate = (dat) => {
    var date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    var stillUtc = moment.utc(date).toDate();
    setDate(moment(stillUtc).local().format('L, LT'));
  };

  const fetchDetails = async (orderId) => {
    if (drawerOpen) {
      setLoggedUser('Test User');
      return;
    }
    const rtBrId = localStorage.getItem('locId');
    try {
      const response = await getsalesorderdetailsvalue(orderId);
      setBaseOrderResponse(response?.data?.data?.baseOrderResponse);
      setDeliveryAddress(response?.data?.data?.addressEntityModel?.shippingAddress);
      convertUTCDateToLocalDate(response?.data?.data?.baseOrderResponse?.createdAt);
      setInvoiceId(response?.data?.data?.baseOrderResponse?.invoiceId);
      setBaseDetails(response?.data?.data?.orderBillingDetails);
      setGstBreakupDetails(response?.data?.data?.gstBreakupDetails);
      setOrderDetails(response?.data?.data?.orderBillingDetails);
      setOrderTokenDetails(response?.data?.data?.orderTokenDetails);
      setFreeProducts(response?.data?.data?.freeProducts);
      setOrderItems(response?.data?.data?.baseOrderResponse?.orderItemList);
      setNoGst(response?.data?.data?.gstWiseOrderItems['No Gst slab'] || []);
      setGst2slab(response?.data?.data?.gstWiseOrderItems['2.5 cgst and 2.5 sgst slab'] || []);
      setGst5slab(response?.data?.data?.gstWiseOrderItems['5 cgst and 5 sgst slab'] || []);
      setGst6slab(response?.data?.data?.gstWiseOrderItems['6 cgst and 6 sgst slab'] || []);
      setGst9slab(response?.data?.data?.gstWiseOrderItems['9 cgst and 9 sgst slab'] || []);
      setGst14slab(response?.data?.data?.gstWiseOrderItems['14 cgst and 14 sgst slab'] || []);
      setGstBreakupDetails(response?.data?.data?.gstBreakupDetails);
      setTotalQuantity(
        response?.data?.data?.baseOrderResponse?.orderItemList?.map((item) => item.quantity).reduce((a, b) => a + b, 0),
      );

      let locationDetails = {};
      if (!locationData) {
        try {
          const response = await getRetailDetailsByBranch(rtBrId);
          if (response?.data?.data) {
            localStorage.setItem('locationData', JSON.stringify(response?.data?.data));
            locationDetails = response.data.data;
          }
        } catch (e) {}
      } else {
        locationDetails = locationData;
      }
      setRetailDetails(locationDetails);

      if (!retailUserDetails) {
        try {
          const res = await getUserFromUidx(response.data.data.baseOrderResponse?.loggedInUserId);
          setLoggedUser(res.data.data.firstName + ' ' + res.data.data.secondName);
          setKey((prevKey) => prevKey + 1);
        } catch (error) {
          triggerSnackbar(error?.response?.data?.message, 'error');
        }
      } else {
        setLoggedUser(`${retailUserDetails.firstName} ${retailUserDetails.secondName}`);
        setKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.message, 'error');
    }
  };

  // const openPort = async () => {
  // const port = await window.navigator.serial.requestPort();
  // await port.open({ baudRate: 115200 });
  // setPortData(port);
  // return port;
  // };

  const renderPicklist = async (printerWidth) => {
    return await render(
      <Printer type="epson" width={printerWidth}>
        <Text bold={true} align="center">
          Pick List
        </Text>
        <Line />
        <Text align="center" bold={true} size={{ width: 2, height: 2 }}>
          Token #{orderTokenDetails?.token || 'N/A'}
        </Text>
        <Text align="center">Order #{orderId || 'N/A'}</Text>
        <Text align="center">Picker: {pickerName?.label || 'N/A'}</Text>
        <Line />
        <Text>Customer Name: {baseOrderResponse?.customerName || 'N/A'}</Text>
        <Text>Customer No: {baseOrderResponse?.mobileNumber || 'N/A'}</Text>
        <Text>Order time: {formatDate(date) || 'N/A'}</Text>
        <Line />
        <Text bold={true}>{'#   Items    Qty    MRP       SP     Batch'}</Text>
        <Line />
        {orderItems?.map((e, i) => (
          <>
            <Text>{`${`${i + 1}`.slice(0, 3).padEnd(3)} ${e.productName.slice(0, 23).padEnd(23)}${`<${e.gtin}>`
              .slice(0, 15)
              .padStart(15)}`}</Text>
            <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
              .toString()
              .slice(0, 7)
              .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${
              e.batchNumber || 'N/A'.toString().slice(0, 9).padStart(9)
            }`}</Text>
          </>
        ))}
        <Line />
        <Text bold={true} align="center" size={{ width: 2, height: 2 }}>
          {`Total Qty: ${totalQuantity}`}
        </Text>
        <Line />
        <Cut />
      </Printer>,
    );
  };

  const renderInvoice = async (printerWidth) => {
    return await render(
      <Printer type="epson" width={printerWidth}>
        {/* <Text align="center">Evernest Private Limited</Text>
        <Text align="center">Level 4, No 3, Narayani Arcade</Text>
        <Text align="center">ITPL Main Rd, Kundalahalli</Text>
        <Text align="center">Bengaluru, Karnataka 560037</Text>
        <Text align="center">Phone: +91 7558890052</Text>
        <Text align="center">GSTIN: 27AACCA8432H1ZQ</Text> */}

        <Text align="center" bold={true} size={{ width: 2, height: 2 }}>
          {retailDetails?.displayName || 'Store Name'}
        </Text>
        <Text align="center">{retailDetails?.address?.addressLine1 || 'AddressLine1'}</Text>

        <Text align="center">{retailDetails?.address?.addressLine2 || 'AddressLine2'}</Text>

        <Text align="center">
          Phone:{' '}
          {`${retailDetails?.contacts?.map(({ phoneNo }) => phoneNo).join(' / ') || 'PhoneNo'} GSTIN: ${
            retailDetails?.gst || 'GSTIN'
          }`}
        </Text>
        <Text align="center">{`FSSAI: ${retailDetails?.fssaiNumber || ''}`}</Text>
        <Line />
        <Text align="center" bold={true}>
          {`${isB2cOrder ? 'TAX INVOICE (DELIVERY)' : 'TAX INVOICE'}`}
        </Text>
        <Line />
        <Row left={`Bill No ${isB2cOrder ? orderId : invoiceId}`} right={loggedUser} />
        <Row left={date.toLocaleString()} right={baseDetails?.paymentMethod || 'N/A'} />
        <Line />
        <Text bold={true}>{'HSN   Particulars'.padEnd(42)}</Text>
        <Text bold={true}>{'             Qty    MRP     Rate     Value'}</Text>
        <Line />
        {noGst?.length && (
          <>
            <Text bold={true}>{'          No CGST + No SGST'}</Text>
            {noGst?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        {gst2slab?.length && (
          <>
            <Text bold={true}>{'          2.5% CGST and 2.5% SGST'}</Text>
            {gst2slab?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        {gst5slab?.length && (
          <>
            <Text bold={true}>{'          5% CGST and 5% SGST'}</Text>
            {gst5slab?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        {gst6slab?.length && (
          <>
            <Text bold={true}>{'          6% CGST and 6% SGST'}</Text>
            {gst6slab?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        {gst9slab?.length && (
          <>
            <Text bold={true}>{'          9% CGST and 9% SGST'}</Text>
            {gst9slab?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        {gst14slab?.length && (
          <>
            <Text bold={true}>{'          14% CGST and 14% SGST'}</Text>
            {gst14slab?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        {freeProducts?.length && (
          <>
            <Text bold={true}>{'          Free Products'}</Text>
            {freeProducts?.map((e) => (
              <>
                <Text>{`${e.hsnCode.slice(0, 4).padEnd(4)}  ${e.productName.slice(0, 36).padEnd(36)}`}</Text>
                <Text>{`             ${e.quantityBySpecs.toString().slice(0, 3).padStart(3)}${e.mrp
                  .toString()
                  .slice(0, 7)
                  .padStart(7)}${e.sellingPrice.toString().slice(0, 9).padStart(9)} ${e.subTotal
                  .toString()
                  .slice(0, 9)
                  .padStart(9)}`}</Text>
              </>
            ))}
          </>
        )}
        <Line />
        <Row
          left={<Text>{`Redeemed Pts: ${orderDetails?.redeemedLoyaltyPoints || 0}`}</Text>}
          right={<Text>{`Redeemed Value: -${orderDetails?.loyaltyPointsValue || 0}`}</Text>}
        />
        <Row
          left={<Text>{`Earned Pts: ${orderDetails?.loyaltyPointsEarned || 0}`}</Text>}
          right={<Text>{`Coupons: -${orderDetails?.couponValue || 0}`}</Text>}
        />
        {isB2cOrder && <Text>{`Delivery Charges: ${orderDetails?.deliveryCharges || 0}`}</Text>}
        <Line />
        <Row
          left={<Text bold={true}>{`Items: ${baseOrderResponse?.orderItemList.length}  Qty: ${totalQuantity}`}</Text>}
          right={<Text bold={true}>{`Total Amount: ${orderDetails?.grandTotal}`}</Text>}
        />
        <Line />
        {Number(baseOrderResponse?.tender) && (
          <>
            <Row
              left={<Text bold={true}>{`Tender: ${baseOrderResponse?.tender}`}</Text>}
              right={<Text bold={true}>{`Change: ${baseOrderResponse?.balance}`}</Text>}
            />
            <Line />
          </>
        )}

        {baseDetails?.payments.length > 1 && (
          <>
            {orderDetails?.payments.map((e) => (
              <Text>{`${e.paymentMethod}: ${e.amountPaid}`}</Text>
            ))}
            <Line />
          </>
        )}
        <Text align="center" bold={true}>
          {'<--------- GST Breakup Details --------->'}
        </Text>
        <Line />
        <Text bold={true}>{'SNo   TaxableAmt    CGST   SGST   TotalAmt'}</Text>
        <Line />
        {gstBreakupDetails?.length &&
          gstBreakupDetails
            ?.filter((item) => item.taxableAmt != null)
            ?.map((e, i) => (
              <Text>{`${i + 1}     ${e.taxableAmt.toFixed(2).toString().slice(0, 10).padEnd(10)}  ${e.cgst
                .toFixed(2)
                .toString()
                .slice(0, 6)
                .padStart(6)}${e.sgst.toFixed(2).toString().slice(0, 7).padStart(7)}${
                e.totalAmt ? e.totalAmt.toFixed(2).toString().slice(0, 11).padStart(11) : '---'
              }`}</Text>
            ))}
        <Line />
        <Text align="center" bold={true}>
          Items sold cannot be returned or refunded
        </Text>
        <Line character="=" />
        <Row
          left={
            <Text bold={true} size={{ width: 2, height: 2 }}>
              Total Savings
            </Text>
          }
          right={<Text bold={true} size={{ width: 2, height: 2 }}>{`${orderDetails.totalSavings || 0}`}</Text>}
        />
        <Line character="=" />
        {isB2cOrder && (
          <>
            <Text align="center" bold={true} underline="1dot-thick">
              DELIVERY DETAILS
            </Text>
            <Text>{`Customer Name: ${baseOrderResponse?.customerName || 'N/A'}`}</Text>
            <Text>{`Mobile: ${baseOrderResponse?.mobileNumber || 'N/A'}`}</Text>
            <Text>{`Address: ${deliveryAddress?.addressLine1 || ''}, `}</Text>
            <Text>
              {`${deliveryAddress?.addressLine2 || ''}, ${deliveryAddress?.city || ''}, ${
                deliveryAddress?.state || ''
              }`}
            </Text>
            <Line />
          </>
        )}
        {!isB2cOrder && (
          <>
            <Text align="center" bold={true}>
              Please bring your own shopping bags and
            </Text>
            <Text align="center" bold={true}>
              Help Save Environment
            </Text>
            <Image align="center" src={recycleLogo} transforms={[transforms.floydSteinberg]} />
          </>
        )}

        <Text align="center">Thank you for shopping with us!</Text>
        <Text align="center">@Powered by Pallet</Text>
        {!reprint && <Cashdraw pin="2pin" />}
        {/* <Text>text</Text>
        <Text>fragment is {"allowed"}</Text>
        <Text align="center">center text</Text>
        <Text align="right">right text</Text>
        <Text bold={true}>bold text</Text>
        <Text underline="1dot-thick">underline text</Text>
        <Text invert={true}>invert text</Text>
        <Text size={{ width: 2, height: 2 }}>big size text</Text>
        <Br />
        <Row left="left" right="right" />
        <Row left="left" right="right" gap={2} />
        <Row left={<Text>left</Text>} right="right" />
        <Row left={<Text>left</Text>} right="very very long text will be multi line placed." />
        <Br />
        <Line />
        <Line character="=" />
        <Br />
        <Barcode type="UPC-A" content="111111111111" />
        <Barcode type="CODE39" content="A000$" />
        <Barcode align="center" type="UPC-A" content="111111111111" />
        <Br />
        <QRCode content="https://github.com/seokju-na/react-thermal-printer" />
        <QRCode align="center" content="https://github.com/seokju-na/react-thermal-printer" />
        <Br /> */}
        <Cut />
      </Printer>,
    );
  };

  const billData = async (drawerOpen) => {
    const printerWidth = (await printerConfig?.printer) === 'TVS' ? 46 : 42;
    if (drawerOpen) {
      return await render(
        <Printer type="epson" width={printerWidth}>
          <Cashdraw pin="2pin" />
        </Printer>,
      );
    }

    if (printType === 'picklist') {
      return await renderPicklist(printerWidth);
    } else {
      return await renderInvoice(printerWidth);
    }
  };

  const printSerial = async () => {
    // if (!portData) {
    //   await openPort();
    // }
    try {
      const prevPort = await navigator.serial.getPorts();
      const port = prevPort[0]?.readable ? prevPort[0] : await window.navigator.serial.requestPort();
      prevPort[0]?.readable ? console.log('Port already open') : await port.open({ baudRate: 115200 });
      // if (!prevPort[0]?.readable) {
      //   const port = await window.navigator.serial.requestPort();
      //   await port.open({ baudRate: 115200 });
      //   setPortData(port);
      // }

      const data = await billData();

      const writer = port.writable?.getWriter();
      // const data = [
      //   0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, // 'Hello'
      //   0x77, 0x6f, 0x72, 0x6c, 0x64, 0x0a, // 'world'

      //   0x0a, // New line
      //   //cut paper

      //   0x1b, 0x69, 0x0a, // Cut paper
      //   // 0x1b, 0x40, // Cut paper
      // ]
      if (writer != null) {
        await writer.write(new Uint8Array(data));
        writer.releaseLock();
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      localStorage.removeItem('CartId');
    }
  };

  const printUSB = async (drawerOpen = false) => {
    try {
      const data = await billData(drawerOpen);

      const findOpenedDevice = async () => {
        const devices = await navigator.usb.getDevices();
        return devices.find((d) => d.opened);
      };

      const openedDevice = await findOpenedDevice();

      const usbDevice =
        openedDevice || (await navigator.usb.requestDevice({ filters: [{ vendorId: 3386 }, { vendorId: 5455 }] }));
      !openedDevice && (await usbDevice.open());
      // const usbDevice = await navigator.usb.requestDevice({ filters: [{ vendorId: 3386 }] });
      // const usbDevice = await navigator.usb.requestDevice({ filters: [] });

      if (usbDevice.configuration === null) {
        await usbDevice.selectConfiguration(1);
      }
      await usbDevice.claimInterface(usbDevice.configuration.interfaces[0].interfaceNumber);

      await usbDevice.transferOut(
        usbDevice.configuration.interfaces[0].alternate.endpoints.find((obj) => obj.direction === 'out').endpointNumber,
        data,
      );
    } catch (error) {
      console.error('Error connecting to the printer: ', error);
      setIsError(true);
    } finally {
      setIsPrinting(false);
      if (drawerOpen || reprint) return;
    }
  };

  useEffect(() => {
    if (isPrinting) {
      fetchDetails(orderId);
    }
  }, [isPrinting, orderId]);

  useEffect(() => {
    if (loggedUser) {
      let printButton = document.createElement('button');
      printButton.addEventListener('click', function () {
        printerConfig?.label === 'Serial port' ? printSerial() : printUSB();
      });
      printButton.click();
    }
  }, [key]);

  const startPrint = ({
    orderId,
    drawerOpen = false,
    reprint = false,
    printType = 'invoice',
    b2c = false,
    pickerName = '',
  } = {}) => {
    setIsPrinting(true);
    setDrawerOpen(drawerOpen);
    setReprint(reprint);
    setOrderId(orderId);
    setPrintType(printType);
    setIsB2cOrder(b2c);
    setPickerName(pickerName);
  };

  const openDrawer = () => {
    printUSB(true);
  };

  return { startPrint, isPrinting, openDrawer, isError };
};

export default usePrint;
