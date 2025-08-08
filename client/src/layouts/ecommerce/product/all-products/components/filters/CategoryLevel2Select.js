import '../../all-products.css';
import './CategoryLevel1Select.css';
import { getAllLevel2Category } from '../../../../../../config/Services';
import React, { useEffect, useState } from 'react';
import SoftSelect from '../../../../../../components/SoftSelect';

export const CategoryLevel2Select = ({
  catlevel1Selected,
  catlevel2Selected,
  categoryLevel1Selected,
  setCatLevel2Selected,
  // to persisting in redux category level 2
  categoryLevel2Selected,
  setCategoryLevel2Selected,
}) => {
  // category level 2 main arr received when passed category level 1 "level1Id"
  const [categoryLevel2Arr, setCategoryLevel2Arr] = useState([]);

  const [categoryLevel2ArrOptions, setCategoryLevel2ArrOptions] = useState([]);

  // const [categoryLevel2Selected, setCategoryLevel2Selected] = useState({});

  const handleMainCatLevel2 = (option) => {
    // console.log('category level 2', option);
    setCategoryLevel2Selected(option);
    // console.log('clv2', option);

    // set value of category level 1 to display as chip
    setCatLevel2Selected([option.label]);
    // console.log('cl2', option.label);

    // whenever the category is changed, set page = 1 in pageState
    // setPageState({ ...pageState, page: 1 });
  };

  const payload = {
    page: 1,
    pageSize: 100,
    level1Id: [categoryLevel1Selected.level1Id],
    active: [true],
  };

  useEffect(() => {
    categoryLevel1Selected.level1Id !== undefined &&
      getAllLevel2Category(payload).then((response) => {
        // setArr(response.data.data);
        setCategoryLevel2Arr(response.data.data.results);
      });
  }, [categoryLevel1Selected]);
  //   console.log(categoryLevel1Selected);

  useEffect(() => {
    const categoryLevel2 = [];
    categoryLevel2Arr.map((e) => {
      categoryLevel2.push({ value: e.level2Id, label: e.categoryName, level1Id: e.level1Id });
    });
    setCategoryLevel2ArrOptions(categoryLevel2);
    // console.log('arr', arr);
  }, [categoryLevel2Arr]);

  //   if category level 2 is applied and removed from the chip update its value
  useEffect(() => {
    if (catlevel2Selected.length === 0) {
      // setCategoryLevel1Selected([]);
      setCategoryLevel2Selected({});
    }
  }, [catlevel2Selected]);

  return (
    <>
      {/* <Box sx={{position:"relative"}}> */}
      {!categoryLevel2Selected.value && (
        <SoftSelect
          // menuIsOpen={true}
          sx={{ zIndex: 100 }}
          autoFocus
          className="all-products-filter-soft-select-box"
          placeholder={
            // categoryLevel1Selected.label
            'Select Category Level 2'
          }
          name="categoryLevel1"
          // {...(categoryLevel2Selected.value
          //   ? {
          //       value: {
          //         value: categoryLevel2Selected.value,
          //         label: categoryLevel2Selected.label,
          //       },
          //     }
          //   : {
          //       value: {
          //         value: categoryLevel1Selected.value,
          //         label: categoryLevel1Selected.label,
          //       },
          //     })}
          options={categoryLevel2ArrOptions}
          onChange={(option, e) => {
            // handleMainCat(option);
            handleMainCatLevel2(option);
          }}
        />
      )}

      {/* show single selected value when the category level 2 is selected  */}
      {categoryLevel2Selected.value && (
        <SoftSelect
          // menuIsOpen={true}
          sx={{ zIndex: 100 }}
          autoFocus
          className="all-products-filter-soft-select-box"
          placeholder="Category Level 1"
          name="categoryLevel1"
          {...(categoryLevel2Selected.value
            ? {
                value: {
                  value: categoryLevel2Selected.value,
                  label: categoryLevel2Selected.label,
                },
              }
            : {
                value: {
                  value: categoryLevel1Selected.value,
                  label: categoryLevel1Selected.label,
                },
              })}
          options={[{ value: categoryLevel2Selected.value, label: categoryLevel2Selected.label }]}
          // onChange={(option, e) => {
          //   // handleMainCat(option);
          //   handleMainCatLevel2(option);
          // }}
        />
      )}

      {/* </Box> */}
      {/* </Box> */}
    </>
  );
};
