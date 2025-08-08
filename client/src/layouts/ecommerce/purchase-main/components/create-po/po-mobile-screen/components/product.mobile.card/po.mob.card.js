import { MoPoProductDetails } from './po.mob.details';
import { MoPoProductFooter } from './po.mob.footer';
import { MoPoProductHeader } from './po.mob.header';

const MobPoProductCard = ({
  rowData,
  onInputValueChange,
  onDelete,
  handleProductNavigation,
  setRowData,
  index,
  piNumber,
  vendorid,
  allData,
  setValuechange,
}) => {
  const row = rowData[index];
  const price =
    row?.previousPurchasePrice && row?.previousPurchasePrice !== '0' && row?.previousPurchasePrice !== 0
      ? parseFloat(row?.previousPurchasePrice)
      : 0;
  const qtyFulfilled = Number(row?.quantityOrdered || 0) - Number(row?.quantityLeft || 0);
  const isGreater = Number(row?.previousPurchasePrice) > Number(row?.finalPrice);
  const isZero = Number(row?.previousPurchasePrice) === 0;
  const isLeftQuantZero = row?.quantityLeft === 0 || row?.quantityLeft === '0';
  return (
    <div className="mob-address-box">
      <MoPoProductHeader
        code={row?.itemCode}
        itemName={row?.itemName}
        piNumber={piNumber}
        vendorid={vendorid}
        isLeftQuantZero={isLeftQuantZero}
        allData={allData}
        isApproved={row?.isApproved}
        index={index}
        onDelete={onDelete}
        row={row}
        setRowData={setRowData}
        setValuechange={setValuechange}
        handleProductNavigation={handleProductNavigation}
        rowData={rowData}
      />
      <MoPoProductDetails
        spec={row?.spec}
        finalPrice={row?.finalPrice}
        qtyFulfilled={qtyFulfilled}
        price={price}
        amount={row?.amount}
        quantityOrdered={row?.quantityOrdered}
        availableStock={row?.availableStock}
        salesPerWeek={row?.salesPerWeek}
      />
      <MoPoProductFooter
        price={price}
        amount={row?.amount}
        row={row}
        index={index}
        onInputValueChange={onInputValueChange}
        isApproved={row?.isApproved}
        quantityLeft={row?.quantityLeft}
        quantityAccepted={row?.quantityAccepted}
      />
    </div>
  );
};

export default MobPoProductCard;
