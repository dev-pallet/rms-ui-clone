import Filter from '../../../../../Common/Filter';
import SoftSelect from '../../../../../../../components/SoftSelect';

export default function PutawayFilter() {
  // Status, Location, Vendor

  const statusSelect = (
    <>
      <SoftSelect placeholder="Select Status" name="status" />
    </>
  );

  const locationSelect = (
    <>
      <SoftSelect placeholder="Select Location" name="location" />
    </>
  );

  const vendorSelect = (
    <>
      <SoftSelect placeholder="Select Vendor" name="vendor" />
    </>
  );

  const selectBoxArray = [statusSelect, locationSelect, vendorSelect];

  return (
    <>
      <Filter selectBoxArray={selectBoxArray} />
    </>
  );
}
