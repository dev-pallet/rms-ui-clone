import SoftBox from '../../../../components/SoftBox';
import CustomMobileButton from '../../Common/mobile-new-ui-components/button';

export const CustomerHeader = ({ selected, handleCustomerType, isMobileDevice }) => {
  const filters = [
    { label: 'App', value: '' },
    { label: 'B2B', value: 'org' },
    { label: 'POS', value: 'pos' },
  ];

  return (
    <>
      <SoftBox style={{ display: 'flex', marginTop: '10px', width: '100%' }}>
        {/* desktop view && mobile view */}
        {!isMobileDevice ? (
          <></>
        ) : (
          <div className="listing-order-name-main">
            {filters.map((filter) => (
              <CustomMobileButton
                key={filter.label}
                variant={filter.value === selected ? 'black-D' : 'black-S'}
                title={filter.label}
                onClickFunction={() => handleCustomerType(filter)}
                flex={1}
                justifyContent={'center'}
              >
                {filter.label}
              </CustomMobileButton>
            ))}
          </div>
        )}
      </SoftBox>
    </>
  );
};

