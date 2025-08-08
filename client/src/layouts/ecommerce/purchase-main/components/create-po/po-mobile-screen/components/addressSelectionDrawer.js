import { Typography } from '@mui/material';
import SoftBox from '../../../../../../../components/SoftBox';
import MobileDrawerCommon from '../../../../../Common/MobileDrawer';
import SoftTypography from '../../../../../../../components/SoftTypography';

const MobPOAddressDrawer = ({
  drawerOpen,
  drawerClose,
  title,
  addressList,
  selectedAddress,
  handleChangeAddress,
  addressKey,
}) => {
  return (
    <MobileDrawerCommon
      anchor="bottom"
      drawerOpen={drawerOpen}
      drawerClose={drawerClose}
      paperProps={{
        height: 'auto',
        width: '100%',
      }}
    >
      <SoftBox className="loyalty-drawer-main-div">
        <Typography id="modal-modal-title" fontSize="16px" fontWeight={700} sx={{ textAlign: 'center' }} m={2}>
          {title}
        </Typography>
        <SoftBox m={1} p={1} className="address-bg-div po-box-shadow">
          {addressList?.map((address) => {
            return (
              <SoftBox key={address[addressKey]} onClick={() => handleChangeAddress(address)}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '5px',
                  }}
                >
                  <input
                    type="radio"
                    checked={selectedAddress?.[addressKey] === address?.[addressKey]}
                    onChange={() => handleChangeAddress(address)}
                    value={address?.[addressKey]}
                  />
                  <div>
                    <SoftTypography className="add-pi-font-size">
                      {address?.name || address?.addressLine1}
                    </SoftTypography>
                    <SoftTypography className="add-pi-font-size">{address?.addressLine1}</SoftTypography>
                    <SoftTypography className="add-pi-font-size">{address?.addressLine2}</SoftTypography>
                    <SoftTypography className="add-pi-font-size">{address?.state}</SoftTypography>
                    <SoftTypography className="add-pi-font-size">
                      {address?.city} {address?.pinCode}
                    </SoftTypography>
                    <SoftTypography className="add-pi-font-size">{address?.country}</SoftTypography>
                  </div>
                </div>
                <hr />
              </SoftBox>
            );
          })}
        </SoftBox>
      </SoftBox>
    </MobileDrawerCommon>
  );
};

export default MobPOAddressDrawer;
