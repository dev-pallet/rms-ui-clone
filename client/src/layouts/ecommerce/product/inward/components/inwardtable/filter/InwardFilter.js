import Filter from '../../../../../Common/Filter';
import SoftSelect from '../../../../../../../components/SoftSelect';

export default function InwardFilter() {
  // PO number, Session ID, Status, Vendor, Location
  // const PONumberSelect
  //

  // po number
  const poNumberSelect = (
    <>
      <SoftSelect placeholder="Select PO Number" name="poNumber" />
    </>
  );

  // session id select
  const sessionIdSelect = (
    <>
      <SoftSelect placeholder="Select Session ID" name="sessionId" />
    </>
  );

  //   status
  const statusSelect = (
    <>
      <SoftSelect
        placeholder="Select Status"
        name="status"
        // {...(selectedVendor.label
        //   ? {
        //       value: {
        //         value: selectedVendor.value,
        //         label: selectedVendor.label,
        //       },
        //     }
        //   : {
        //       value: {
        //         value: '',
        //         label: 'Select Vendor',
        //       },
        //     })}
        // options={vendorList}
        // onChange={(option, e) => {
        //   handleVendor(option);
        // }}
      />
    </>
  );

  //   vendor
  const vendorSelect = (
    <>
      <SoftSelect
        placeholder="Select Vendor"
        name="vendor"
        // {...(selectedVendor.label
        //   ? {
        //       value: {
        //         value: selectedVendor.value,
        //         label: selectedVendor.label,
        //       },
        //     }
        //   : {
        //       value: {
        //         value: '',
        //         label: 'Select Vendor',
        //       },
        //     })}
        // options={vendorList}
        // onChange={(option, e) => {
        //   handleVendor(option);
        // }}
      />
    </>
  );

  //   location
  const locationSelect = (
    <>
      <SoftSelect
        placeholder="Select Location"
        name="location"
        // {...(selectedVendor.label
        //   ? {
        //       value: {
        //         value: selectedVendor.value,
        //         label: selectedVendor.label,
        //       },
        //     }
        //   : {
        //       value: {
        //         value: '',
        //         label: 'Select Vendor',
        //       },
        //     })}
        // options={vendorList}
        // onChange={(option, e) => {
        //   handleVendor(option);
        // }}
      />
    </>
  );

  const selectBoxArray = [poNumberSelect, sessionIdSelect, statusSelect, vendorSelect, locationSelect];

  return (
    <>
      <Filter selectBoxArray={selectBoxArray} />
    </>
  );
}
