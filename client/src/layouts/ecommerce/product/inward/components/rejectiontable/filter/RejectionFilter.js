import Filter from '../../../../../Common/Filter';
import SoftSelect from '../../../../../../../components/SoftSelect';

export default function RejectionFilter() {
  // PO number, Barcode, Reason,  Session ID, Vendor

  const poNumberSelect = (
    <>
      <SoftSelect placeholder="Select PO Number" name="poNumber" />
    </>
  );

  const barcodeSelect = (
    <>
      <SoftSelect placeholder="Select Barcode" name="barcode" />
    </>
  );

  const reasonSelect = (
    <>
      <SoftSelect placeholder="Select Reason" name="reason" />
    </>
  );

  const sessionIdSelect = (
    <>
      <SoftSelect placeholder="Select Session ID" name="sessionId" />
    </>
  );

  const vendorSelect = (
    <>
      <SoftSelect placeholder="Select Vendor" name="vendor" />
    </>
  );

  const selectBoxArray = [poNumberSelect, barcodeSelect, reasonSelect, sessionIdSelect, vendorSelect];

  return (
    <>
      <Filter selectBoxArray={selectBoxArray} />
    </>
  );
}
