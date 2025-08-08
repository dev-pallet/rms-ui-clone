import { AdjustmentsVerticalIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import CustomMobileButton from '../button';
import './mobile-filter.css';
import { useState } from 'react';
import MobileDrawerCommon from '../../MobileDrawer';
import CommonStaticDatePicker from '../static-datepicker';

const MobileFilterComponent = ({
  filters,
  filterOptions,
  clearButton,
  createButtonTitle,
  createButtonFunction,
  mainSelecetedFilter,
  setMainSelectedFilter,
  selectedSubFilters,
  setSelectedSubFilters,
  applyFilter,
  setApplyFilter,
  isFilterOpened,
  setIsFilterOpened,
  filterCreateExist,
}) => {
  const [staticCalendarFocus, setStaticCalendarFocus] = useState(false);
  const [applyLoader, setApplyLoader] = useState(false);
  const [clearLoader, setClearLoader] = useState(false);

  const filterOpenHandler = () => {
    setIsFilterOpened(true);
  };

  const handleSelectedFilter = (value) => {
    setMainSelectedFilter(value);
  };

  const removeSingleFilter = (mainFilter, item) => {
    if (mainFilter) {
      const updatedFilters = { ...selectedSubFilters };
      delete updatedFilters[mainFilter];
      setSelectedSubFilters(updatedFilters);
    }
    // const filteredItems = selectedSubFilters?.[mainSelecetedFilter]?.filter((fliter) => fliter?.value !== item?.value);
    // setSelectedSubFilters((prev) => ({
    //   ...prev,
    //   [mainFilter]: filteredItems,
    // }));
  };

  //setting custom date picker values into main filter object
  const handleCustomDateFilterValues = (value) => {
    setSelectedSubFilters((prev) => ({
      ...prev,
      [mainSelecetedFilter]: [{ label: value, value: value }],
    }));
  };

  const handleSubFilters = (item, mainFilter, type) => {
    if (
      mainSelecetedFilter === 'date' ||
      mainSelecetedFilter === 'startDate' ||
      (mainSelecetedFilter === 'endDate' && item?.value === 'custom')
    ) {
      setStaticCalendarFocus(true);
      return;
    }
    if (type === 'single') {
      setSelectedSubFilters((prev) => ({
        ...prev,
        [mainFilter]: [item],
      }));
    } else {
      if (!selectedSubFilters?.[mainSelecetedFilter]?.includes(item)) {
        setSelectedSubFilters((prev) => ({
          ...prev,
          [mainFilter]: [item, ...(prev[mainFilter] || [])],
        }));
      } else {
        removeSingleFilter(mainFilter, item);
      }
    }
  };

  const handleCloserFilter = () => {
    setIsFilterOpened(false);
  };

  const resetFilters = () => {
    setMainSelectedFilter('');
    setSelectedSubFilters({});
    setApplyFilter(true);
    setClearLoader(true);
    setApplyLoader(false);
  };

  const handleApplyFilter = () => {
    setApplyFilter(true);
    setClearLoader(false);
    setApplyLoader(true);
  };

  const handleDrawerClose = () => {
    setClearLoader(false);
    setApplyLoader(false);
    handleCloserFilter();
  };

  return (
    <div className="filter-icon-main-div">
      <div className="filter-add-buttons">
        {filterCreateExist?.filter && (
          <div className="filter-main-btn-div">
            {/* <div className="filter-count-ros-app">
            <span className="filter-count-number">2</span>
          </div> */}

            <CustomMobileButton
              variant={'black-D'}
              iconOnLeft={
                <AdjustmentsVerticalIcon
                  style={{
                    height: '1rem',
                    width: '1rem',
                  }}
                />
              }
              onClickFunction={filterOpenHandler}
            />
          </div>
        )}
        {filterCreateExist?.create ? (
          <CustomMobileButton
            variant={'black-D'}
            iconOnLeft={
              <PlusCircleIcon
                style={{
                  height: '1rem',
                  width: '1rem',
                }}
              />
            }
            title={`Create ${createButtonTitle}`}
            flex={1}
            width="100%"
            onClickFunction={createButtonFunction}
          />
        ) : (
          <div className="width-100">
            <span
              className="purchase-title-ros-app"
              style={{ background: 'var(--Surface-Black, #0b0b0b)', color: 'rgb(254, 254, 254)', height: '36px' }}
            >
              {createButtonTitle}
            </span>
          </div>
        )}
      </div>
      {/* {filterCreateExist?.create && (
        <div>
          <span className="purchase-title-ros-app">{createButtonTitle}</span>
        </div>
      )} */}
      <MobileDrawerCommon
        drawerOpen={isFilterOpened}
        // drawerOpen={true}
        anchor="bottom"
        drawerClose={handleDrawerClose}
        className="filter-values-main-div"
      >
        <div>
          <div>
            <span className="common-filter-title">Filter</span>
            {selectedSubFilters && (
              <div className="filter-title-main-container">
                {/* Its an nested objected thats why flatMap */}
                {Object.keys(selectedSubFilters)?.flatMap((mainFilter) =>
                  selectedSubFilters?.[mainFilter]?.map((item) => (
                    <CustomMobileButton
                      rightIconFunction={() => removeSingleFilter(mainFilter, item)}
                      variant={'black-D'}
                      title={item?.label}
                      iconOnRight={
                        <XCircleIcon
                          style={{
                            height: '1rem',
                            width: '1rem',
                          }}
                        />
                      }
                    />
                  )),
                )}
              </div>
            )}
          </div>
          <hr className="filter-divider-mob" />
        </div>
        <div className="filters-main-container">
          <div className="main-filters-mob">
            {filters?.map((filter) => (
              <CustomMobileButton
                variant={mainSelecetedFilter === filter?.filterValue ? 'black-D' : 'white-D'}
                title={filter?.filterLabel}
                onClickFunction={() => handleSelectedFilter(filter?.filterValue)}
              />
            ))}
          </div>
          <div className="sub-filters-mob">
            <div className="sub-filters-child-div">
              {mainSelecetedFilter &&
                filterOptions?.[mainSelecetedFilter]?.map((item) => (
                  <>
                    <CustomMobileButton
                      variant={
                        selectedSubFilters?.[mainSelecetedFilter]?.some(
                          (filterItem) => filterItem?.label === item?.label && filterItem?.value === item?.value,
                        )
                          ? 'black-D'
                          : 'black-S'
                      }
                      title={item?.label}
                      onClickFunction={(e) => handleSubFilters(item, mainSelecetedFilter, 'single')}
                    />
                  </>
                ))}
            </div>
          </div>
        </div>
        <hr className="filter-divider-mob" />
        <div className="filter-action-btns-main-div">
          <CustomMobileButton
            variant={'black-S'}
            title={'Clear'}
            loading={applyFilter && clearLoader}
            onClickFunction={resetFilters}
          />
          <CustomMobileButton
            variant={'blue-D'}
            title={'Apply'}
            onClickFunction={handleApplyFilter}
            loading={applyFilter && applyLoader}
          />
        </div>
        <CommonStaticDatePicker
          openDatePicker={staticCalendarFocus}
          onCloseFunction={() => setStaticCalendarFocus(false)}
          datePickerOnAccpetFunction={handleCustomDateFilterValues}
        />
      </MobileDrawerCommon>
    </div>
  );
};

export default MobileFilterComponent;

const Filter = ({ value }) => {};
