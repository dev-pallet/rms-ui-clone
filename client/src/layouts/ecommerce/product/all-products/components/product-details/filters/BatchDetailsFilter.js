import Filter from '../../../../../Common/Filter';
import SoftSelect from '../../../../../../../components/SoftSelect';

export default function BatchDetailsFilter() {
  //   Quantity (min-max), Available Units (min-max), Expiry Date, Selling Price (min-max),
  // MRP (min-max), Purchase Price (min-max)

  const quantitySelect = (
    <>
      <SoftSelect placeholder="Select Quantity" name="quantity" />
    </>
  );

  const availableUnitSelect = (
    <>
      <SoftSelect placeholder="Select Available Units" name="availableUnits" />
    </>
  );

  const expiryDateSelect = (
    <>
      <SoftSelect placeholder="Select Expiry Date" name="expiryDate" />
    </>
  );

  const sellingPriceSelect = (
    <>
      <SoftSelect placeholder="Select Selling Price" name="sellingPrice" />
    </>
  );

  const mrpSelect = (
    <>
      <SoftSelect placeholder="Select MRP" name="mrp" />
    </>
  );

  const purchasePriceSelect = (
    <>
      <SoftSelect placeholder="Select Purchase Price" name="purchasePrice" />
    </>
  );

  const selectBoxArray = [
    quantitySelect,
    availableUnitSelect,
    expiryDateSelect,
    sellingPriceSelect,
    mrpSelect,
    purchasePriceSelect,
  ];

  return (
    <>
      <Filter color="#344767" selectBoxArray={selectBoxArray} />
    </>
  );
}
