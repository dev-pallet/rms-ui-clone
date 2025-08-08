import { FilterChipDisplayBox, filterStateAndFiltersAppliedHandleFn } from '../../../../Common/Filter Components/filterComponents';
import { getFiltersStateData, setFilterStateData, setFilters, setPage } from '../../../../../../datamanagement/Filters/commonFilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import Filter from '../../../../Common/Filter';
import SoftBox from '../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../components/SoftSelect';
import ABCAnalysisMobileFilter from './mobile';

export default function ABCAnalysisFilter({ filterObjectMain, categoryOptionsLabel, tab, isMobileDevice, pageState }) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [category, setCategory] = useState(filterObjectMain?.category || '');
  // switchTabs = clearFilterOnSwitchingTabs;

  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [applyMobileFilter, setApplyMobileFilter] = useState(false);

  // filters
  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    category: persistedFilterStateData?.category || 0,
  });

  // select category selectbox
  const CategorySelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Category"
          {...(category.label
            ? {
              value: {
                value: category.value,
                label: category.label,
              },
            }
            : {
              value: {
                value: '',
                label: 'Select Category',
              },
            })}
          options={[
            { value: '', label: 'All' },
            { value: 'A', label: `A - ${categoryOptionsLabel[0]}` },
            { value: 'B', label: `B - ${categoryOptionsLabel[1]}` },
            { value: 'C', label: `C - ${categoryOptionsLabel[2]}` },
          ]}
          onChange={(option, e) => handleCategory(option)}
        />
      </SoftBox>
    </>
  );

  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // handle category fn
  const handleCategory = (option) => {
    setCategory(option);

    if (option !== '') {
      handleFilterStateAndFiltersApplied('category');
    }
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      category: setCategory
    };

    if (filterMap[filterType]) {
      filterMap[filterType]('');
      setFilterState((prevState) => ({ ...prevState, [filterType]: 0 }));
    }
  };  

  // chipBoxes for filter
  const filterChipData = useMemo(
    () => [
      { heading: 'Category', label: category.label, key: 'category', condition: filterState.category === 1 },
    ],
    [category],
  );

  const filterChipBoxes = (
    <>
      {filterChipData.map(
        ({ heading, label, key, condition }) =>
          condition && (
            <FilterChipDisplayBox
              key={key}
              heading={heading}
              label={label}
              objKey={key}
              removeSelectedFilter={removeSelectedFilter}
            />
          ),
      )}
    </>
  );  

  //   apply filter function
  const applyFilter = async () => {
    dispatch(
      setFilters({
        category,
      }),
    );
    dispatch(setFilterStateData(filterState));
    dispatch(setPage(0));    
  };

  const handleClearFilter = async () => {
    setCategory('');

    // reset filterState
    setFilterState({
      category: 0,
    });

    // reset filtersApplied
    // filterFunction({ pageNo: 0, category: '' });
    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    dispatch(setPage(0));
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [CategorySelect];

  // Update filterState when persistedFilterStateData changes
  useEffect(() => {
    setFilterState({
      category: persistedFilterStateData?.category || 0,
    });
    setCategory(filterObjectMain?.category || '');
  }, [persistedFilterStateData]);

  // applied filters count
  const filterLength = Object.values(filterState).filter(value => value === 1).length;   

  useEffect(() => {
    if (pageState?.loading === false && isMobileDevice) {
      setApplyMobileFilter(false);
      setIsFilterOpened(false);
    }
  }, [pageState?.loading]);

  return (
    <>
      {isMobileDevice ? (
        <ABCAnalysisMobileFilter
          {...{
            isFilterOpened,
            setIsFilterOpened,
            applyFilter,
            handleClearFilter,
            applyMobileFilter,
            setApplyMobileFilter,
            setCategory,
            categoryOptions: [
              { value: '', label: 'All' },
              { value: 'A', label: `A - ${categoryOptionsLabel[0]}` },
              { value: 'B', label: `B - ${categoryOptionsLabel[1]}` },
              { value: 'C', label: `C - ${categoryOptionsLabel[2]}` },
            ],
          }}
        />
      ) : (
        <Filter
          filtersApplied={filterLength}
          filterChipBoxes={filterChipBoxes}
          selectBoxArray={selectBoxArray}
          handleApplyFilter={applyFilter}
          handleClearFilter={handleClearFilter}
        />
      )}
    </>
  );
}
