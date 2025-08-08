import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import {
  createMarketingSegment,
  getAllMainCategory,
  getAllMarketingFilters,
  getFirstLevelMarketingFilters,
  getLocationwarehouseData,
  getRetailUserLocationDetails,
  getSingleSegmentById,
} from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const CreateCustomAudience = () => {
  const [openSave, setOpenSave] = useState(false);
  const [listName, setListName] = useState('');
  const [rows, setRows] = useState([]);
  const [secondFilterOptions, setSecondFilterOptions] = useState([]);
  const [thirdFilterOptions, setThirdFilterOptions] = useState([]);
  const [filterBoxes, setFilterBoxes] = useState([
    { id: 1, conjunction: null, firstFilter: null, secondFilter: null, thirdFilter: null, fourthFilter: null },
  ]);

  const [isAfterDateAdded, setIsAfterDateAdded] = useState(null);
  const [isBeforeDateAdded, setIsBeforeDateAdded] = useState(null);
  const [isWithinDateAdded, setIsWithinDateAdded] = useState(null);
  const [isNotWithinDateAdded, setIsNotWithinDateAdded] = useState(null);
  const [loyaltyExpiredOn, setLoyaltyExpiredOn] = useState(null);
  const [loyaltyExpiredBefore, setLoyaltyExpiredBefore] = useState(null);
  const [loyaltyExpiredAfter, setLoyaltyExpiredAfter] = useState(null);
  const [customVisitedStore, setCustomVisitedStore] = useState(null);
  const [customNotVisitedStore, setCustomNotVisitedStore] = useState(null);
  const [customHasMadePurchase, setCustomHasMadePurchase] = useState(null);
  const [customNotHasMadePurchasee, setCustomNotHasMadePurchase] = useState(null);
  const [renderKey, setRenderKey] = useState(0);
  const [selectedOperator, setSelectedOperator] = useState({ id: 1, conjunction: null });

  const [locOp, setLocOp] = useState([]);

  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');

  useEffect(() => {
    if (contextType == 'RETAIL') {
      getRetailUserLocationDetails(orgId).then((res) => {
        const loc = res?.data?.data?.branches.map((e) => {
          return {
            value: e.branchId,
            label: e.displayName,
          };
        });
        setLocOp(loc);
      });
    } else if (contextType == 'WMS') {
      getLocationwarehouseData(orgId).then((res) => {
        const loc = res?.data?.data?.locationDataList.map((e) => {
          return {
            value: e.locationId,
            label: e.locationName,
          };
        });
        setLocOp(loc);
      });
    }
  }, []);

  const addFilterBox = () => {
    const newFilterBoxes = [
      ...filterBoxes,
      { id: filterBoxes.length + 1, conjunction: null, firstFilter: null, secondFilter: null, thirdFilter: null },
    ];
    setFilterBoxes(newFilterBoxes);
  };

  const removeFilterBox = (id) => {
    const newFilterBoxes = filterBoxes.filter((box) => box.id !== id);
    setFilterBoxes(newFilterBoxes);
  };

  // const handleConjunctionChange = (id, newConjunction) => {
  //   const updatedFilterBoxes = filterBoxes.map((box) =>
  //     box.id === id ? { ...box, conjunction: newConjunction } : box,
  //   );
  //   setFilterBoxes(updatedFilterBoxes);
  //   setSelectedOperator(newConjunction);
  // };

  // const handleConjunctionChange = (id, operator) => {
  //   const updatedFilterBoxes = filterBoxes.map((box) => (box.id === id ? { ...box, conjunction: operator } : box));
  //   setFilterBoxes(updatedFilterBoxes);
  //   setSelectedOperator((prevSelectedOperators) => ({
  //     ...prevSelectedOperators,
  //     [id]: operator,
  //   }));
  // };

  const handleConjunctionChange = (id, operator) => {
    const updatedFilterBoxes = filterBoxes.map((box, index) => {
      if (box.id === id) {
        return { ...box, conjunction: operator };
      }
      return box;
    });

    // Set conjunction for the first element and null for the last element
    if (updatedFilterBoxes.length > 0) {
      updatedFilterBoxes[0] = { ...updatedFilterBoxes[0], conjunction: operator };
      updatedFilterBoxes[updatedFilterBoxes.length - 1] = {
        ...updatedFilterBoxes[updatedFilterBoxes.length - 1],
        conjunction: null,
      };
    }

    setFilterBoxes(updatedFilterBoxes);
    setSelectedOperator((prevSelectedOperators) => ({
      ...prevSelectedOperators,
      [id]: operator,
    }));
  };

  const handleFirstFilterChange = (id, firstFilter) => {
    const updatedFilterBoxes = filterBoxes.map((box) => {
      if (box.id === id) {
        return { ...box, firstFilter, secondFilter: null, thirdFilter: null, fourthFilter: null }; // Set secondFilter to null
      } else {
        return box;
      }
    });
    setFilterBoxes(updatedFilterBoxes);
    const optionsForSecondFilter = getSecondFilterOptions(firstFilter?.value);
    setSecondFilterOptions(optionsForSecondFilter);

    setThirdFilterOptions([]);
  };

  const handleSecondFilterChange = (id, selectedOption) => {
    let label, value;

    // Check if selectedOption is an object or a primitive value
    if (typeof selectedOption === 'object' && selectedOption !== null) {
      ({ label, value } = selectedOption); // Destructure if it's an object
    } else {
      value = selectedOption; // Assign the value directly
      label = selectedOption; // Optionally, you can assign the label to the value or use a default label
    }

    setFilterBoxes((prevFilterBoxes) => {
      const updatedFilterBoxes = prevFilterBoxes.map((box) =>
        box.id === id
          ? { ...box, secondFilter: { label, value }, thirdFilter: null, fourthFilter: null } // Set thirdFilter to null
          : box,
      );
      const optionsForThirdFilter = getThirdFilterOptions(value);
      setThirdFilterOptions(optionsForThirdFilter);

      return updatedFilterBoxes;
    });
  };

  // const handleThirdFilterChange = (id, thirdFilter, type) => {
  //   setFilterBoxes((prevFilterBoxes) => {
  //     const updatedFilterBoxes = prevFilterBoxes.map((box) => {
  //       if (box.id === id) {
  //         if (type === 'select') {
  //           const { label, value } = thirdFilter;
  //           return { ...box, thirdFilter: { label, value }, fourthFilter: null };
  //         } else if (type === 'input') {
  //           return { ...box, thirdFilter: { label: thirdFilter, value: thirdFilter }, fourthFilter: null };
  //         }
  //       }
  //       return box;
  //     });
  //     return updatedFilterBoxes;
  //   });
  // };
  const handleThirdFilterChange = (id, thirdFilter) => {
    setFilterBoxes((prevFilterBoxes) => prevFilterBoxes?.map((box) => (box.id === id ? { ...box, thirdFilter } : box)));
  };

  const handleFourthFilterChange = (id, value) => {
    setFilterBoxes((prevFilterBoxes) => {
      const updatedFilterBoxes = prevFilterBoxes.map((box) => (box.id === id ? { ...box, fourthFilter: value } : box));
      return updatedFilterBoxes;
    });
  };

  const secondFilterLabel = '';

  const getSecondFilterOptions = (firstFilterValue) => {
    getFirstLevelMarketingFilters(firstFilterValue)
      .then((res) => {
        const filters = res?.data?.data.map((item) => ({
          label: formatLabel(item?.filterName),
          value: item?.filterName,
        }));
        setSecondFilterOptions(filters);
      })
      .catch((error) => {
        setSecondFilterOptions([]);
        showSnackbar('Error fetching second level marketing filters', 'error');
      });
  };

  const AdditionalComponentSecond = ({
    firstFilterLabel,
    firstFilterValue,
    secondFilterOptions,
    secondFilterLabel,
    handleSecondFilterChange,
  }) => {
    // Add your logic for rendering the additional component based on the selected value
    switch (firstFilterValue) {
      case 'TOTAL_SPENT':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );

      case 'AVERAGE_ORDER_VALUE':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );

      case 'STORE_VISIT':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );

      case 'CUSTOMER_BY_PINCODE':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'CUSTOMER_SOURCE':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'CUSTOMER_PHONE_NUMBER':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'CUSTOMER_ADDED':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'CUSTOMER_BY_CITY':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'APP_PURCHASE':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );

      case 'PRODUCT_CATEGORY':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );

      case 'WALLET_BALANCE':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Balance':
        return (
          <>
            <SoftInput placeholder="Enter Minimum points" />
            <SoftInput placeholder="Enter Maximum points" />
          </>
        );
      case 'Redeemed':
        return (
          <>
            <SoftInput placeholder="Enter Minimum points redeemed" />
            <SoftInput placeholder="Enter Maximum points" />
          </>
        );

      case 'Address':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Birthday':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Contact Rating':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Predicted Location':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Anniversary':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Date Added':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Signup Source':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Email Subscription Status':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Email Engagement':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Email Interaction':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'SMS Subscription Status':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'SMS Engagement':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'SMS Interaction':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Whatsapp Subscription Status':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Whatsapp Interaction':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Whatsapp Engagement':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Store Visit':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'App Purchase':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Fraudulent Activity':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Brand':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      case 'Expired':
        return (
          <>
            <SoftSelect
              options={secondFilterOptions}
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              onChange={(option) => handleSecondFilterChange(option)}
            />
          </>
        );
      default:
        return null;
    }
  };

  const getThirdFilterOptions = (secondFilterValue) => {
    switch (secondFilterValue) {
      case 'month_birthday':
        return [
          {
            label: 'January',
            value: 'jan_birthday',
          },
          {
            label: 'February',
            value: 'feb_birthday',
          },
          {
            label: 'March',
            value: 'march_birthday',
          },
          {
            label: 'April',
            value: 'april_birthday',
          },
          {
            label: 'May',
            value: 'may_birthday',
          },
          {
            label: 'June',
            value: 'june_birthday',
          },
          {
            label: 'July',
            value: 'july_birthday',
          },
          {
            label: 'August',
            value: 'aug_birthday',
          },
          {
            label: 'September',
            value: 'sept_birthday',
          },
          {
            label: 'October',
            value: 'oct_birthday',
          },
          {
            label: 'November',
            value: 'nov_birthday',
          },
          {
            label: 'December',
            value: 'dec_birthday',
          },
        ];
      case 'is_rating':
        return [
          {
            label: '1 star',
            value: '1_star_is',
          },
          {
            label: '2 star',
            value: '2_star_is',
          },
          {
            label: '3 star',
            value: '3_star_is',
          },
          {
            label: '4 star',
            value: '4_star_is',
          },
          {
            label: '5 star',
            value: '5_star_is',
          },
        ];
      case 'is_not_rating':
        return [
          {
            label: '1 star',
            value: '1_star_is_not',
          },
          {
            label: '2 star',
            value: '2_star_is_not',
          },
          {
            label: '3 star',
            value: '3_star_is_not',
          },
          {
            label: '4 star',
            value: '4_star_is_not',
          },
          {
            label: '5 star',
            value: '5_star_is_not',
          },
        ];
      case 'is_greater_than_rating':
        return [
          {
            label: '1 star',
            value: '1_star_is_greater_than',
          },
          {
            label: '2 star',
            value: '2_star_is_greater_than',
          },
          {
            label: '3 star',
            value: '3_star_is_greater_than',
          },
          {
            label: '4 star',
            value: '4_star_is_greater_than',
          },
          {
            label: '5 star',
            value: '5_star_is_greater_than',
          },
        ];
      case 'is_less_than_rating':
        return [
          {
            label: '1 star',
            value: '1_star_is_less_than',
          },
          {
            label: '2 star',
            value: '2_star_is_less_than',
          },
          {
            label: '3 star',
            value: '3_star_is_less_than',
          },
          {
            label: '4 star',
            value: '4_star_is_less_than',
          },
          {
            label: '5 star',
            value: '5_star_is_less_than',
          },
        ];
      case 'month_is_anniversary':
        return [
          {
            label: 'January',
            value: 'jan_birthday',
          },
          {
            label: 'February',
            value: 'feb_birthday',
          },
          {
            label: 'March',
            value: 'march_birthday',
          },
          {
            label: 'April',
            value: 'april_birthday',
          },
          {
            label: 'May',
            value: 'may_birthday',
          },
          {
            label: 'June',
            value: 'june_birthday',
          },
          {
            label: 'July',
            value: 'july_birthday',
          },
          {
            label: 'August',
            value: 'aug_birthday',
          },
          {
            label: 'September',
            value: 'sept_birthday',
          },
          {
            label: 'October',
            value: 'oct_birthday',
          },
          {
            label: 'November',
            value: 'nov_birthday',
          },
          {
            label: 'December',
            value: 'dec_birthday',
          },
        ];
      case 'was_signup_source':
        return [
          // {
          //   label: 'Admin',
          //   value: 'admin_was_signup',
          // },
          {
            label: 'POS',
            value: 'pos_was_signup',
          },
          {
            label: 'App',
            value: 'app_was_signup',
          },
        ];
      case 'was_not_signup_source':
        return [
          // {
          //   label: 'Admin',
          //   value: 'admin_was_not_signup',
          // },
          {
            label: 'POS',
            value: 'pos_was_not_signup',
          },
          {
            label: 'APP',
            value: 'app_was_not_signup',
          },
        ];
      case 'is_one_of_email':
        return [
          {
            label: 'Subscribed',
            value: 'subscribed_is_one_of_email',
          },
          {
            label: 'Unsubscribed',
            value: 'unsubscribed_is_one_of_email',
          },
          {
            label: 'Not subscribed',
            value: 'not_subscribed_is_one_of_email',
          },
          {
            label: 'Cleaned',
            value: 'cleaned_is_one_of_email',
          },
        ];
      case 'is_not_one_of_email':
        return [
          {
            label: 'Subscribed',
            value: 'subscribed_is_not_one_of_email',
          },
          {
            label: 'Unsubscribed',
            value: 'unsubscribed_is_not_one_of_email',
          },
          {
            label: 'Not subscribed',
            value: 'not_subscribed_is_not_one_of_email',
          },
          {
            label: 'Cleaned',
            value: 'cleaned_is_not_one_of_email',
          },
        ];
      case 'is_email_engagement':
        return [
          {
            label: 'New',
            value: 'new_is_email_engagement',
          },
          {
            label: 'Rarely',
            value: 'rarely_is_email_engagement',
          },
          {
            label: 'Sometimes',
            value: 'sometimes_is_email_engagement',
          },
          {
            label: 'Often',
            value: 'often_is_email_engagement',
          },
        ];
      case 'is_not_email_engagement':
        return [
          {
            label: 'New',
            value: 'new_is_not_email_engagement',
          },
          {
            label: 'Rarely',
            value: 'rarely_is_not_email_engagement',
          },
          {
            label: 'Sometimes',
            value: 'sometimes_is_not_email_engagement',
          },
          {
            label: 'Often',
            value: 'often_is_not_email_engagement',
          },
        ];
      case 'visited_in_store':
        return [
          {
            label: 'last 30 days',
            value: 'last_30_days_visited_in_store',
          },
          {
            label: 'last 90 days',
            value: 'last_90_days_visited_in_store',
          },
          {
            label: 'Custom',
            value: 'custom_visited_in_store',
          },
        ];
      case 'has_not_visited_store':
        return [
          {
            label: 'last 30 days',
            value: 'last_30_days_has_not_visited_store',
          },
          {
            label: 'last 90 days',
            value: 'last_90_days_has_not_visited_store',
          },
          {
            label: 'Custom',
            value: 'custom_has_not_visited_store',
          },
        ];
      case 'made_purchase':
        return [
          {
            label: 'last 30 days',
            value: 'last_30_days_made_purchase',
          },
          {
            label: 'last 90 days',
            value: 'last_90_days_made_purchase',
          },
          {
            label: 'Custom',
            value: 'custom_made_purchase',
          },
        ];
      case 'has_not_made_purchase':
        return [
          {
            label: 'last 30 days',
            value: 'last_30_days_has_not_made_purchase',
          },
          {
            label: 'last 90 days',
            value: 'last_90_days_has_not_made_purchase',
          },
          {
            label: 'Custom',
            value: 'custom_has_not_made_purchase',
          },
        ];
      case 'has_purchased_brand':
        return [
          {
            label: 'Brand 1',
            value: 'brand_1_has_purchased_brand',
          },
          {
            label: 'Brand 2',
            value: 'brand_2_has_purchased_brand',
          },
        ];
      case 'has_not_purchased_brand':
        return [
          {
            label: 'Brand 1',
            value: 'brand_1_has_not_purchased_brand',
          },
          {
            label: 'Brand 2',
            value: 'brand_2_has_not_purchased_brand',
          },
        ];
      case 'opened_email_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_openend_email_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_openend_email_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_openend_email_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_openend_email_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_openend_email_interaction',
          },
        ];
      case 'clicked_email_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_clicked_email_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_clicked_email_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_clicked_email_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_clicked_email_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_clicked_email_interaction',
          },
        ];
      case 'was_sent_email_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_sent_email_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_sent_email_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_sent_email_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_sent_email_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_sent_email_interaction',
          },
        ];
      case 'did_not_open_email_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_did_not_open_email_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_did_not_open_email_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_did_not_open_email_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_did_not_open_email_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_did_not_open_email_interaction',
          },
        ];
      case 'did_not_click_email_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_did_not_click_email_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_did_not_click_email_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_did_not_click_email_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_did_not_click_email_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_did_not_click_email_interaction',
          },
        ];
      case 'was_not_sent_email_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_not_sent_email_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_not_sent_email_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_not_sent_email_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_not_sent_email_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_not_sent_email_interaction',
          },
        ];
      case 'is_sms':
        return [
          {
            label: 'Subscribed',
            value: 'subscribed_is_sms',
          },
          {
            label: 'Unsubscribed',
            value: 'unsubscribed_is_sms',
          },
          {
            label: 'Non-subscribed',
            value: 'non_subscribed_is_sms',
          },
        ];
      case 'is_not_sms':
        return [
          {
            label: 'Subscribed',
            value: 'subscribed_is_not_sms',
          },
          {
            label: 'Unsubscribed',
            value: 'unsubscribed_is_not_sms',
          },
          {
            label: 'Non-subscribed',
            value: 'non_subscribed_is_not_sms',
          },
        ];
      case 'is_sms_engagement':
        return [
          {
            label: 'New',
            value: 'new_is_sms_engagement',
          },
          {
            label: 'Rarely',
            value: 'rarely_is_sms_engagement',
          },
          {
            label: 'Sometimes',
            value: 'sometimes_is_sms_engagement',
          },
          {
            label: 'Often',
            value: 'often_is_sms_engagement',
          },
        ];
      case 'is_not_sms_engagement':
        return [
          {
            label: 'New',
            value: 'new_is_not_sms_engagement',
          },
          {
            label: 'Rarely',
            value: 'rarely_is_not_sms_engagement',
          },
          {
            label: 'Sometimes',
            value: 'sometimes_is_not_sms_engagement',
          },
          {
            label: 'Often',
            value: 'often_is_not_sms_engagement',
          },
        ];
      case 'was_sent_sms_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_sent_sms_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_sent_sms_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_sent_sms_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_sent_sms_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_sent_sms_interaction',
          },
        ];
      case 'was_not_sent_sms_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_not_sent_sms_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_not_sent_sms_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_not_sent_sms_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_not_sent_sms_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_not_sent_sms_interaction',
          },
        ];
      case 'was_delivered_sms_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_delivered_sms_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_delivered_sms_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_delivered_sms_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_delivered_sms_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_delivered_sms_interaction',
          },
        ];
      case 'was_not_delivered_sms_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_not_delivered_sms_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_not_delivered_sms_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_not_delivered_sms_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_not_delivered_sms_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_not_delivered_sms_interaction',
          },
        ];
      case 'link_clicked_sms_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_link_clicked_sms_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_link_clicked_sms_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_link_clicked_sms_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_link_clicked_sms_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_link_clicked_sms_interaction',
          },
        ];
      case 'link_not_clicked_sms_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_link_not_clicked_sms_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_link_not_clicked_sms_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_link_not_clicked_sms_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_link_not_clicked_sms_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_link_not_clicked_sms_interaction',
          },
        ];
      case 'is_whatsapp':
        return [
          {
            label: 'Subscribed',
            value: 'subscribed_is_whatsapp',
          },
          {
            label: 'Unsubscribed',
            value: 'unsubscribed_is_whatsapp',
          },
          {
            label: 'Non-subscribed',
            value: 'non_subscribed_is_whatsapp',
          },
        ];
      case 'is_not_whatsapp':
        return [
          {
            label: 'Subscribed',
            value: 'subscribed_is_not_whatsapp',
          },
          {
            label: 'Unsubscribed',
            value: 'unsubscribed_is_not_whatsapp',
          },
          {
            label: 'Non-subscribed',
            value: 'non_subscribed_is_not_whatsapp',
          },
        ];
      case 'is_whatsapp_engagement':
        return [
          {
            label: 'New',
            value: 'new_is_whatsapp_engagement',
          },
          {
            label: 'Rarely',
            value: 'rarely_is_whatsapp_engagement',
          },
          {
            label: 'Sometimes',
            value: 'sometimes_is_whatsapp_engagement',
          },
          {
            label: 'Often',
            value: 'often_is_whatsapp_engagement',
          },
        ];
      case 'is_not_whatsapp_engagement':
        return [
          {
            label: 'New',
            value: 'new_is_not_whatsapp_engagement',
          },
          {
            label: 'Rarely',
            value: 'rarely_is_not_whatsapp_engagement',
          },
          {
            label: 'Sometimes',
            value: 'sometimes_is_not_whatsapp_engagement',
          },
          {
            label: 'Often',
            value: 'often_is_not_whatsapp_engagement',
          },
        ];
      case 'was_sent_whatsapp_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_sent_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_sent_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_sent_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_sent_whatsapp_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_sent_whatsapp_interaction',
          },
        ];
      case 'was_not_sent_whatsapp_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_not_sent_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_not_sent_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_not_sent_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_not_sent_whatsapp_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_not_sent_whatsapp_interaction',
          },
        ];
      case 'was_delivered_whatsapp_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_delivered_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_delivered_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_delivered_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_delivered_whatsapp_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_delivered_whatsapp_interaction',
          },
        ];
      case 'was_not_delivered_whatsapp_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_was_not_delivered_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_was_not_delivered_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_was_not_delivered_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_was_not_delivered_whatsapp_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_was_not_delivered_whatsapp_interaction',
          },
        ];
      case 'link_clicked_whatsapp_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_link_clicked_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_link_clicked_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_link_clicked_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_link_clicked_whatsapp_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_link_clicked_whatsapp_interaction',
          },
        ];
      case 'link_not_clicked_whatsapp_interaction':
        return [
          {
            label: 'any of last 5 campaigns',
            value: 'any_of_last_5_campaigns_link_not_clicked_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent within last 7 days',
            value: 'any_campaigns_sent_within_7_days_link_not_clicked_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 1 month',
            value: 'any_campaigns_sent_last_1_month_link_not_clicked_whatsapp_interaction',
          },
          {
            label: 'any campaigns sent last 3 month',
            value: 'any_campaigns_sent_last_3_month_link_not_clicked_whatsapp_interaction',
          },
          {
            label: 'all of last 5 campaigns',
            value: 'all_of_last_5_campaigns_link_not_clicked_whatsapp_interaction',
          },
        ];
      default:
        return [];
    }
  };

  const ThirdLevelFilterComponent = ({
    secondFilterValue,
    secondFilterLabel,
    thirdFilterOptions,
    thirdFilterValue,
    handleThirdFilterChange,
    handleFourthFilterChange,
    fourthFilterValue,
  }) => {
    switch (secondFilterValue) {
      case 'contains_address':
        return (
          <>
            <SoftInput placeholder="Search Keyword" />
          </>
        );
      case 'does_not_contain_address':
        return (
          <>
            <SoftInput placeholder="Search Keyword" />
          </>
        );

      case 'is_greater_than_order_value':
        return (
          <>
            <SoftInput
              placeholder="Enter value"
              value={thirdFilterValue}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
            />
          </>
        );
      case 'is_less_than_order_value':
        return (
          <>
            <SoftInput
              placeholder="Enter value"
              value={thirdFilterValue}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
            />
          </>
        );
      case 'is_equal_to_order_value':
        return (
          <>
            <SoftInput
              placeholder="Enter value"
              value={thirdFilterValue}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
            />
          </>
        );
      case 'is_greater_than_average_order_value':
        return (
          <>
            <SoftInput
              placeholder="Enter value"
              value={thirdFilterValue}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
            />
          </>
        );
      case 'is_less_than_average_order_value':
        return (
          <>
            <SoftInput
              placeholder="Enter value"
              value={thirdFilterValue}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
            />
          </>
        );
      case 'is_equal_to_average_order_value':
        return (
          <>
            <SoftInput
              placeholder="Enter value"
              value={thirdFilterValue}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
            />
          </>
        );
      case 'is_within_distance_address':
        return (
          <>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter Distance"
              icon={{ component: 'km', direction: 'right' }}
            />
            <SoftInput className="all-products-filter-soft-input-box" placeholder="Enter Pincode" />
          </>
        );
      //   case 'is_blank_address':
      //     return <></>;
      //   case 'is_not_blank_address':
      //     return <></>;
      case 'month_birthday':
        return (
          <>
            <SoftSelect placeholder="Select Month" options={thirdFilterOptions} />
          </>
        );
      case 'is_rating':
        return (
          <>
            <SoftSelect placeholder="Select stars" options={thirdFilterOptions} />
          </>
        );
      case 'is_not_rating':
        return (
          <>
            <SoftSelect placeholder="Select stars" options={thirdFilterOptions} />
          </>
        );
      case 'is_greater_than_rating':
        return (
          <>
            <SoftSelect placeholder="Select stars" options={thirdFilterOptions} />
          </>
        );
      case 'is_less_than_rating':
        return (
          <>
            <SoftSelect placeholder="Select stars" options={thirdFilterOptions} />
          </>
        );
      case 'month_is_anniversary':
        return (
          <>
            <SoftSelect placeholder="Select Month" options={thirdFilterOptions} />
          </>
        );
      case 'is_within_location':
        return (
          <div style={{ display: 'flex', gap: '10px', width: '200%' }}>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter Distance"
              icon={{ component: 'km', direction: 'right' }}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
              value={thirdFilterValue}
            />
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter Location"
              onChange={(e) => handleFourthFilterChange(e.target.value)}
              value={fourthFilterValue}
            />
          </div>
        );
      case 'is_not_within_location':
        return (
          <div style={{ display: 'flex', gap: '10px', width: '200%' }}>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter Distance"
              icon={{ component: 'km', direction: 'right' }}
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
              value={thirdFilterValue}
            />
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter Location"
              onChange={(e) => handleFourthFilterChange(e.target.value)}
              value={fourthFilterValue}
            />
          </div>
        );
      case 'is_in_city_location':
        return (
          <>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter city Name"
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
              value={thirdFilterValue}
            />
          </>
        );
      case 'is_not_in_city_location':
        return (
          <>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter city Name"
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
              value={thirdFilterValue}
            />
          </>
        );
      case 'is_pincode_location':
        return (
          <>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter pincode"
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
              value={thirdFilterValue}
            />
          </>
        );
      case 'is_not_pincode_location':
        return (
          <>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Enter pincode"
              onChange={(e) => handleThirdFilterChange(e.target.value, 'input')}
              value={thirdFilterValue}
            />
          </>
        );
      case 'is_after_date_added':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={thirdFilterValue ? dayjs(thirdFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleThirdFilterChange(date, 'input')}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'is_before_date_added':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={thirdFilterValue ? dayjs(thirdFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleThirdFilterChange(date, 'input')}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'is_within_date_added':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={thirdFilterValue ? dayjs(thirdFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleThirdFilterChange(date, 'input')}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'is_not_within_date_added':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={thirdFilterValue ? dayjs(thirdFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleThirdFilterChange(date, 'input')}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'was_signup_source':
        return (
          <>
            <SoftSelect
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              options={thirdFilterOptions}
              onChange={(option) => handleThirdFilterChange(option, 'select')}
            />
          </>
        );
      case 'was_not_signup_source':
        return (
          <>
            <SoftSelect
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              options={thirdFilterOptions}
              onChange={(option) => handleThirdFilterChange(option, 'select')}
            />
          </>
        );
      case 'is_one_of_email':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'is_not_one_of_email':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'is_email_engagement':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'is_not_email_engagement':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'has_not_visited_store':
        return (
          <>
            <SoftSelect
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              options={thirdFilterOptions}
              onChange={(option) => handleThirdFilterChange(option, 'select')}
            />
          </>
        );
      case 'visited_in_store':
        return (
          <>
            <SoftSelect
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              options={thirdFilterOptions}
              onChange={(option) => handleThirdFilterChange(option, 'select')}
            />
          </>
        );
      case 'made_purchase':
        return (
          <>
            <SoftSelect
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              options={thirdFilterOptions}
              onChange={(option) => handleThirdFilterChange(option, 'select')}
            />
          </>
        );
      case 'has_not_made_purchase':
        return (
          <>
            <SoftSelect
              placeholder={secondFilterLabel !== '' ? secondFilterLabel : 'Select Option'}
              options={thirdFilterOptions}
              onChange={(option) => handleThirdFilterChange(option, 'select')}
            />
          </>
        );
      case 'is_on_expired':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={loyaltyExpiredOn ? dayjs(loyaltyExpiredOn) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => setLoyaltyExpiredOn(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'is_before_expired':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={loyaltyExpiredBefore ? dayjs(loyaltyExpiredBefore) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => setLoyaltyExpiredBefore(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'is_after_expired':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={loyaltyExpiredAfter ? dayjs(loyaltyExpiredAfter) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => setLoyaltyExpiredAfter(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'has_purchased_brand':
        return (
          <>
            <SoftSelect placeholder="Select Brand" options={thirdFilterOptions} />
          </>
        );
      case 'has_not_purchased_brand':
        return (
          <>
            <SoftSelect placeholder="Select Brand" options={thirdFilterOptions} />
          </>
        );
      case 'opened_email_interaction':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'clicked_email_interaction':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'was_sent_email_interaction':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'did_not_open_email_interaction':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'did_not_click_email_interaction':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'was_not_sent_email_interaction':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'is_sms':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'is_not_sms':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'is_sms_engagement':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'is_not_sms_engagement':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_sent_sms_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_not_sent_sms_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_delivered_sms_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_not_delivered_sms_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'link_not_clicked_sms_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'link_clicked_sms_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'is_whatsapp':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'is_not_whatsapp':
        return <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />;
      case 'is_whatsapp_engagement':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'is_not_whatsapp_engagement':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_sent_whatsapp_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_not_sent_whatsapp_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_delivered_whatsapp_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'was_not_delivered_whatsapp_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'link_not_clicked_whatsapp_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      case 'link_clicked_whatsapp_interaction':
        return (
          <>
            <SoftSelect placeholder="Select Option" options={thirdFilterOptions} />
          </>
        );
      default:
        return null;
    }
  };

  const FourthLevelFilterComponent = ({ thirdFilterValue, fourthFilterValue, handleFourthFilterChange }) => {
    switch (thirdFilterValue) {
      case 'custom_visited_in_store':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={fourthFilterValue ? dayjs(fourthFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleFourthFilterChange(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'custom_has_not_visited_store':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={fourthFilterValue ? dayjs(fourthFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleFourthFilterChange(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'custom_made_purchase':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={fourthFilterValue ? dayjs(fourthFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleFourthFilterChange(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );
      case 'custom_has_not_made_purchase':
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={renderKey}
                value={fourthFilterValue ? dayjs(fourthFilterValue) : null}
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                label="Valid From"
                onChange={(date) => handleFourthFilterChange(date)}
                sx={{
                  width: '100%',
                  '& .MuiInputLabel-formControl': {
                    fontSize: '0.8rem',
                    top: '-0.4rem',
                    color: '#344767',
                  },
                }}
              />
            </LocalizationProvider>
          </>
        );

      default:
        return null;
    }
  };

  const loadMainCategoriesOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
    };

    try {
      const res = await getAllMainCategory(payload);
      const data = res?.data?.data?.results || [];

      const options = data?.map((item) => ({
        label: item?.categoryName,
        value: item?.categoryName,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 }, // Increment the page number for infinite scroll
      };
    } catch (error) {
      showSnackbar('Error fetching Level 1 categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const [filteredOptions, setFilteredOptions] = useState([]);

  const formatLabel = (label) => {
    return label
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const showSnackbar = useSnackbar();

  const getAllMainFilters = () => {
    getAllMarketingFilters()
      .then((res) => {
        const filters = res?.data?.data.map((item) => ({
          label: formatLabel(item?.filterName),
          value: item?.filterName,
          filterId: item?.filterId,
        }));
        setFilteredOptions(filters);
      })
      .catch((error) => {
        showSnackbar('Error fetching marketing filters', 'error');
      });
  };

  useEffect(() => {
    getAllMainFilters();
  }, []);

  const createFilterLine = (filterBox) => {
    const firstFilterLabel = filterBox.firstFilter ? filterBox.firstFilter.label : '';
    const secondFilterLabel = filterBox.secondFilter ? filterBox.secondFilter.label : '';
    const thirdFilterLabel = filterBox.thirdFilter
      ? filterBox.thirdFilter.label === 'Custom'
        ? 'on'
        : dayjs(filterBox.thirdFilter.label).isValid() && typeof filterBox.thirdFilter.label === 'object'
        ? dayjs(filterBox.thirdFilter.label).format('dddd, DD MMM YYYY')
        : filterBox.thirdFilter.label
      : '';
    const fourthFilterLabel = filterBox.fourthFilter
      ? dayjs(filterBox.fourthFilter).isValid() && typeof filterBox.fourthFilter === 'object'
        ? dayjs(filterBox.fourthFilter).format('dddd, DD MMM YYYY')
        : filterBox.fourthFilter
      : '';
    return `${firstFilterLabel} ${secondFilterLabel} ${thirdFilterLabel} ${fourthFilterLabel}`.trim();
  };

  const createFilterString = (filterBoxes) => {
    return filterBoxes
      .map((box, index) => {
        const conjunction = box.conjunction ? box.conjunction.toLowerCase() : '';
        const filterLine = createFilterLine(box);

        if (index === 0) {
          return filterLine;
        } else if (conjunction) {
          return `${conjunction} ${filterLine}`;
        } else {
          return filterLine; // Fallback to just the filter line if there's no conjunction
        }
      })
      .join(' ');
  };

  const locId = localStorage.getItem('locId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const name = localStorage.getItem('user_name');
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleCreateSegment = () => {
    setLoader(true);
    if (filterBoxes.length === 0) {
      return null; // or handle this case as needed
    }

    const comparisonOperatorsMap = {
      IS_GREATER_THAN: '>',
      IS_LESS_THAN: '<',
      IS_EQUAL_TO: '=',
      IS_NOT_EQUAL_TO: '!=',
      IS_LESS_THAN_EQUAL_TO: '<=',
      IS_GREATER_THAN_EQUAL_TO: '>=',
      HAS_VISITED: 'HAS_VISITED',
      HAS_NOT_VISITED: 'HAS_NOT_VISITED',
      IS: '=', // =
      IS_NOT: '!=', // !=
      IS_IN_CITY: '=', // =
      IS_NOT_IN_CITY: '!=', // !=
      IS_AFTER: '>', // >
      IS_BEFORE: '<', // <
      HAS_MADE_PURCHASE: 'HAS_MADE_PURCHASE',
      HAS_NOT_MADE_PURCHASE: 'HAS_NOT_MADE_PURCHASE',
      HAS_BOUGHT: '=',
      HAS_NOT_BOUGHT: '!=',
      // Add other mappings as needed
    };

    const filters = filterBoxes?.map((box) => ({
      comparisonOperator:
        box?.firstFilter?.value === 'CUSTOMER_SOURCE' ? '' : comparisonOperatorsMap?.[box?.secondFilter?.value] || '', // Default to 'string' if not found
      value: box?.thirdFilter?.value,
      filterName:
        box?.firstFilter?.value === 'STORE_VISIT' || box?.firstFilter?.value === 'APP_PURCHASE'
          ? `${box?.firstFilter?.value}_${box?.secondFilter?.value}`
          : box?.firstFilter?.value === 'CUSTOMER_SOURCE'
          ? `${box?.firstFilter?.value}_${box?.thirdFilter?.value}`
          : box?.firstFilter?.value === 'WALLET_BALANCE' && box?.secondFilter?.value === 'ABOUT_TO_EXPIRE'
          ? `${box?.firstFilter?.value}_${box?.secondFilter?.value}`
          : box?.firstFilter?.value === 'WALLET_BALANCE' && box?.secondFilter?.value === 'EXPIRED_BEFORE'
          ? `${box?.firstFilter?.value}_${box?.secondFilter?.value}`
          : box?.firstFilter?.value,
      filterOp: box?.conjunction,
    }));

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const payload = {
      orgId: orgId,
      locId: locId,
      createdDate: formattedDate,
      createdBy: uidx,
      segmentName: listName,
      filters: filters,
      combinedQuery: filterBoxes.length > 1 ? true : false,
    };

    try {
      createMarketingSegment(payload).then((res) => {
        // setLoader(false);
        // setOpenSave(false);
        // navigate('/marketing/contacts/all-contacts');
        const payload = {
          segmentId: res?.data?.data?.segmentId,
          reportType: 'csv',
          reportCreatedBy: uidx,
          reportCreatedByName: name,
          getCustomerReport: false,
          reportJobType: 'FIXED',
          reportFrequency: 'DAILY',
          noOfTimesToCreateReport: 10,
        };
        getSingleSegmentById(payload)
          .then(async (res) => {
            if (res?.data?.status === 'ERROR') {
              showSnackbar(res?.data?.message, 'error');
              setLoader(false);
              return;
            }

            if (res?.data?.data?.reportJobStatus === 'FAILED') {
              showSnackbar('Sorry! The file could not be generated.', 'error');
              setLoader(false);
              return;
            }
            setLoader(false);
            setOpenSave(false);
            navigate('/marketing/contacts/all-contacts');
          })
          .catch((err) => {
            setLoader(false);
            showSnackbar('Error while fetching the list', 'error');
          });
      });
    } catch (error) {
      setLoader(false);
      showSnackbar('Cannot create segment', 'error');
    }
  };

  return (
    <div>
      <Dialog open={openSave} onClose={() => setOpenSave(false)}>
        <DialogTitle>Save</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter List Name.</DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="list"
            label="List"
            type="text"
            fullWidth
            variant="standard"
            value={listName}
            onChange={() => setListName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={() => setOpenSave(false)} className="vendor-second-btn">
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={handleCreateSegment}>
            {loader ? (
              <CircularProgress
                size={18}
                sx={{
                  color: '#fff',
                }}
              />
            ) : (
              <>Save</>
            )}
          </SoftButton>
        </DialogActions>
      </Dialog>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box style={{ marginBottom: '20px' }}>
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Typography>Custom Audience</Typography>
            </div>
            {/* <div style={{ display: 'flex', gap: '20px' }}>
            <SoftButton className="vendor-add-btn" >
              Save Audience
            </SoftButton>
          </div> */}
          </SoftBox>
          <Typography style={{ fontSize: '0.8rem' }}>
            Create customer list to target or send campaigns according to their purchase behaviour, location, engagement
            and more.
          </Typography>
          <Box
            className="table-css-fix-box-scroll-vend-1"
            style={{
              boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
              padding: '20px',
              marginTop: '20px',
            }}
          >
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: '#0562FB',
                textAlign: 'left',
                margin: '10px 0px',
              }}
            >
              Add Filters to create a List
            </Typography>
            {filterBoxes.map((filterBox, index) => (
              <>
                {index > 0 && (
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div
                      className={
                        selectedOperator[filterBox.id] === 'AND'
                          ? 'custom-audience-selected-operator'
                          : 'custom-audience-and-btn'
                      }
                      onClick={() => handleConjunctionChange(filterBox.id, 'AND')}
                    >
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          textAlign: 'center',
                        }}
                      >
                        And
                      </Typography>
                    </div>
                    <div
                      className={
                        selectedOperator[filterBox.id] === 'OR'
                          ? 'custom-audience-selected-operator'
                          : 'custom-audience-and-btn'
                      }
                      onClick={() => handleConjunctionChange(filterBox.id, 'OR')}
                    >
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          textAlign: 'center',
                        }}
                      >
                        Or
                      </Typography>
                    </div>
                  </div>
                )}
                <SoftBox key={filterBox.id} style={{ marginTop: '10px' }}>
                  <div className="custom-audience-filter-box-single">
                    <div style={{ width: '100%' }}>
                      <Grid container spacing={2}>
                        <Grid item lg={3} sm={3} md={3} xs={12}>
                          <SoftSelect
                            options={filteredOptions}
                            placeholder="Select Filters"
                            onChange={(option) => handleFirstFilterChange(filterBox.id, option)}
                          />
                        </Grid>
                        <Grid item lg={3} sm={3} md={3} xs={12}>
                          <AdditionalComponentSecond
                            firstFilterLabel={filterBox.firstFilter ? filterBox.firstFilter.label : ''}
                            firstFilterValue={filterBox.firstFilter ? filterBox.firstFilter.value : ''}
                            secondFilterOptions={secondFilterOptions}
                            secondFilterLabel={filterBox.secondFilter ? filterBox.secondFilter.label : ''}
                            //   id={filterBox.id}
                            handleSecondFilterChange={(option) => handleSecondFilterChange(filterBox.id, option)}
                          />
                        </Grid>
                        {/* <Grid item lg={3} sm={3} md={3} xs={12}>
                          <ThirdLevelFilterComponent
                            secondFilterValue={filterBox.secondFilter ? filterBox.secondFilter.value : ''}
                            secondFilterLabel={filterBox.thirdFilter ? filterBox.thirdFilter.label : ''}
                            thirdFilterOptions={thirdFilterOptions}
                            thirdFilterValue={filterBox.thirdFilter ? filterBox.thirdFilter.value : ''}
                            handleThirdFilterChange={(option, type) =>
                              handleThirdFilterChange(filterBox.id, option, type)
                            }
                            fourthFilterValue={filterBox.fourthFilter}
                            handleFourthFilterChange={(value) => handleFourthFilterChange(filterBox.id, value)}
                          />
                        </Grid> */}
                        {filterBox?.secondFilter && (
                          <Grid item lg={3} sm={3} md={3} xs={12}>
                            {filterBox?.firstFilter.value === 'CUSTOMER_SOURCE' ? (
                              <SoftSelect
                                options={[
                                  { label: 'APP', value: 'APP' },
                                  { label: 'POS', value: 'POS' },
                                ]}
                                value={filterBox?.thirdFilter || null}
                                onChange={(option) =>
                                  handleThirdFilterChange(filterBox.id, {
                                    label: option.label,
                                    value: option.value,
                                  })
                                }
                              />
                            ) : filterBox?.firstFilter.value === 'CUSTOMER_ADDED' ? (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  key={renderKey}
                                  value={filterBox?.thirdFilter ? dayjs(filterBox?.thirdFilter?.value) : null}
                                  views={['year', 'month', 'day']}
                                  format="DD-MM-YYYY"
                                  label="Valid From"
                                  onChange={(date) => {
                                    const formattedDate = dayjs(date).format('YYYY-MM-DD');
                                    handleThirdFilterChange(filterBox.id, {
                                      label: formattedDate,
                                      value: formattedDate,
                                    });
                                  }}
                                  sx={{
                                    width: '100%',
                                    '& .MuiInputLabel-formControl': {
                                      fontSize: '0.8rem',
                                      top: '-0.4rem',
                                      color: '#344767',
                                    },
                                  }}
                                />
                              </LocalizationProvider>
                            ) : filterBox?.firstFilter.value === 'PRODUCT_CATEGORY' ? (
                              // <SoftSelect
                              //   options={[
                              //     { label: 'APP', value: 'APP' },
                              //     { label: 'POS', value: 'POS' },
                              //   ]}
                              //   value={filterBox?.thirdFilter ? filterBox?.thirdFilter?.value : ''}
                              //   onChange={(option) =>
                              //     handleThirdFilterChange(filterBox.id, {
                              //       label: option.label,
                              //       value: option.value,
                              //     })
                              //   }
                              // />
                              <SoftAsyncPaginate
                                className="all-products-filter-soft-input-box"
                                placeholder="Select Main Category..."
                                loadOptions={loadMainCategoriesOptions}
                                additional={{ page: 1 }}
                                value={filterBox?.thirdFilter || null}
                                onChange={(option) =>
                                  handleThirdFilterChange(filterBox?.id, {
                                    label: option?.label,
                                    value: option?.value,
                                  })
                                }
                                isClearable
                                menuPortalTarget={document.body}
                              />
                            ) : (
                              <div style={{ display: 'flex', gap: '20px' }}>
                                <SoftInput
                                  type={filterBox?.firstFilter?.value === 'CUSTOMER_BY_CITY' ? 'text' : 'number'}
                                  placeholder="Enter third filter value"
                                  value={filterBox?.thirdFilter ? filterBox?.thirdFilter?.value : ''}
                                  onChange={(e) =>
                                    handleThirdFilterChange(filterBox?.id, {
                                      label: e?.target?.value,
                                      value: e?.target?.value,
                                    })
                                  }
                                />
                                {(filterBox?.firstFilter?.value === 'STORE_VISIT' ||
                                  (filterBox?.firstFilter?.value === 'WALLET_BALANCE' &&
                                    filterBox?.secondFilter?.value === 'ABOUT_TO_EXPIRE') ||
                                  (filterBox?.firstFilter?.value === 'WALLET_BALANCE' &&
                                    filterBox?.secondFilter?.value === 'EXPIRED_BEFORE') ||
                                  filterBox?.firstFilter?.value === 'APP_PURCHASE') && (
                                  <Typography
                                    style={{
                                      fontWeight: '600',
                                      fontSize: '0.8rem',
                                      textAlign: 'left',
                                      marginTop: '10px',
                                    }}
                                  >
                                    days
                                  </Typography>
                                )}
                              </div>
                            )}
                          </Grid>
                        )}
                        <Grid item lg={3} sm={3} md={3} xs={12}>
                          <FourthLevelFilterComponent
                            thirdFilterValue={filterBox.thirdFilter ? filterBox.thirdFilter.value : ''}
                            fourthFilterValue={filterBox.fourthFilter}
                            handleFourthFilterChange={(value) => handleFourthFilterChange(filterBox.id, value)}
                          />
                        </Grid>
                      </Grid>
                    </div>
                    {index > 0 && (
                      <div style={{ float: 'right', cursor: 'pointer' }} onClick={() => removeFilterBox(filterBox.id)}>
                        <CloseIcon />
                      </div>
                    )}
                  </div>
                </SoftBox>
              </>
            ))}
            {filterBoxes.length < 2 ? (
              <SoftBox style={{ margin: '10px 0px' }}>
                <SoftButton className="vendor-add-btn" onClick={addFilterBox}>
                  Add Filters
                </SoftButton>
              </SoftBox>
            ) : (
              <div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: 'red',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Maximum Filters reached. You cannot add more than 2 filters at a time.
                </Typography>
              </div>
            )}
            <hr />

            <Typography
              style={{
                fontWeight: '600',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                textAlign: 'left',
                margin: '5px 0px',
              }}
            >
              Criteria Selection:{' '}
            </Typography>
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                textAlign: 'left',
                margin: '20px 0px',
              }}
            >
              {createFilterString(filterBoxes)}
            </Typography>
          </Box>

          <SoftBox display="flex" justifyContent="flex-end" mt={4}>
            <SoftBox display="flex">
              <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/contacts')}>
                Cancel
              </SoftButton>
              <SoftBox ml={2}>
                <SoftButton
                  // variant="gradient"
                  color="info"
                  className="vendor-add-btn"
                  onClick={() => setOpenSave(true)}
                >
                  Save
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default CreateCustomAudience;
