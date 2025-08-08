import '../../all-products.css';
import './CategoryLevel1Select.css';
import { CategoryLevel2Select } from './CategoryLevel2Select';
import { getAllLevel1Category } from '../../../../../../config/Services';
import React, { useEffect, useRef, useState } from 'react';
import SoftSelect from '../../../../../../components/SoftSelect';

export const CategoryLevel1Select = ({
  pageState,
  setPageState,
  mainCategorySelected,
  catlevel1Selected,
  catlevel2Selected,
  setCatLevel1Selected,
  setCatLevel2Selected,
  // to persisting in redux category level 1
  categoryLevel1Selected,
  setCategoryLevel1Selected,
  // to persisting in redux category level 2
  categoryLevel2Selected,
  setCategoryLevel2Selected,
}) => {
  // category level 1 main arr received when passed mainCategory
  const [categoryLevel1Arr, setCategoryLevel1Arr] = useState([]);

  const [categoryLevel1ArrOptions, setCategoryLevel1ArrOptions] = useState([]);

  // const [categoryLevel1Selected, setCategoryLevel1Selected] = useState({});

  const handleMainCatLevel1 = (option) => {
    // console.log('category level 1', option);
    setCategoryLevel1Selected(option);

    // set value of category level 1 to display as chip
    setCatLevel1Selected([option.label]);
    // console.log('cl1', option);

    // whenever the category is changed, set page = 1 in pageState
    setPageState && setPageState({ ...pageState, page: 1 });
  };

  const payload = {
    page: 1,
    pageSize: 100,
    mainCategoryId: [mainCategorySelected.id],
    active: [true],
  };

  useEffect(() => {
    mainCategorySelected.id !== undefined &&
      getAllLevel1Category(payload).then((response) => {
        // setArr(response.data.data);
        setCategoryLevel1Arr(response.data.data.results);
      });
  }, [mainCategorySelected]);

  useEffect(() => {
    const categoryLevel1 = [];
    categoryLevel1Arr.map((e) => {
      categoryLevel1.push({ value: e.mainCategoryId, label: e.categoryName, level1Id: e.level1Id });
    });
    setCategoryLevel1ArrOptions(categoryLevel1);
    // console.log('categoryLevel1ArrOptions', categoryLevel1);
  }, [categoryLevel1Arr]);

  //   if category level 2 is applied and removed from the chip update its value
  useEffect(() => {
    if (catlevel1Selected.length === 0) {
      setCategoryLevel1Selected({});
    }
  }, [catlevel1Selected]);

  const inputRef = useRef(null);

  return (
    <>
      {!categoryLevel1Selected.level1Id && (
        <SoftSelect
          // menuIsOpen={true}
          sx={{ zIndex: 100 }}
          autoFocus
          className="all-products-filter-soft-select-box"
          placeholder={
            categoryLevel1Selected.label
              ? categoryLevel1Selected.label
              : // mainCategorySelected.label
                'Select Category Level 1'
          }
          name="categoryLevel1"
          // {...(categoryLevel1Selected.label
          //   ? {
          //       value: {
          //         value: categoryLevel1Selected.label,
          //         label: categoryLevel1Selected.label,
          //       },
          //     }
          //   : {
          //       value: {
          //         value: mainCategorySelected.label,
          //         label: mainCategorySelected.label,
          //       },
          //     })}
          options={categoryLevel1ArrOptions}
          onChange={(option, e) => {
            // handleMainCat(option);
            handleMainCatLevel1(option);
          }}
        />
      )}

      {/* display category level 2  */}
      {categoryLevel1Selected.level1Id && (
        <CategoryLevel2Select
          pageState={pageState && pageState}
          setPageState={setPageState && setPageState}
          catlevel1Selected={catlevel1Selected}
          catlevel2Selected={catlevel2Selected}
          categoryLevel1Selected={categoryLevel1Selected}
          setCatLevel2Selected={setCatLevel2Selected}
          // to persisting in redux category level 2
          categoryLevel2Selected={categoryLevel2Selected}
          setCategoryLevel2Selected={setCategoryLevel2Selected}
        />
      )}

      {/* </Box> */}
      {/* </Box> */}
    </>
  );
};
