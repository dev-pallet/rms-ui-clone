import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import CustomMobileButton from '../button';

export const CommonSubTabs = ({ selected, handleSelectTab, isMobileDevice, filters }) => {
  return (
    <>
      <SoftBox style={{ display: 'flex', marginTop: '10px', width: '100%' }}>
        {/* desktop view && mobile view */}
        {!isMobileDevice ? (
          filters?.map((filter) => (
            <SoftTypography
              key={filter?.name}
              className={selected === filter?.value ? 'filter-div-tag' : 'filter-div-paid'}
              varient="h6"
              onClick={() => handleSelectTab(filter?.value)}
              sx={{ color: '#000000', borderBottomColor: 'rgb(0,100,254) !important', cursor: 'pointer' }}
            >
              {filter?.name}
            </SoftTypography>
          ))
        ) : (
          <div className="listing-order-name-main">
            {filters?.map((filter) => (
              <CustomMobileButton
                key={filter?.name}
                variant={filter.value === selected ? 'black-D' : 'black-S'}
                title={filter?.name}
                onClickFunction={() => handleSelectTab(filter?.value)}
                flex={1}
                justifyContent={'center'}
              >
                {filter?.name}
              </CustomMobileButton>
            ))}
          </div>
        )}
      </SoftBox>
    </>
  );
};
