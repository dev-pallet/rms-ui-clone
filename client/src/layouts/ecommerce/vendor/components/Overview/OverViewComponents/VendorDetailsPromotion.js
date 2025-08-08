import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import { updateVendorPromotions, vendorPromotionsById } from '../../../../../../config/Services';

const labelStyle = {
  fontWeight: '500 !important',
  fontSize: '0.95rem',
  color: '#344767',
  margin: '5px 5px 5px 3px',
};
const VendorDetailsPromotion = ({ handleTab }) => {
  const [disablePromotions, setDisablePromotions] = useState(false);
  const [loader, setloader] = useState(false);
  const [checkBoxValues, setCheckBoxValues] = useState({
    END_CAPS: false,
    RACKS: false,
    PROMOTIONAL_BINS: false,
    SHOPPING_BAGS: false,
  });
  const [subCategoryFieldData, setSubCategoryFieldData] = useState({
    END_CAPS: {
      noOfEndCaps: '',
      ratePerMonth: '',
      term: '',
      total: '',
    },
    RACKS: {
      noOfRacks: '',
      ratePerMonth: '',
      term: '',
      total: '',
    },
    PROMOTIONAL_BINS: {
      noOfBins: '',
      ratePerMonth: '',
      term: '',
      total: '',
    },
    SHOPPING_BAGS: {
      slots: '',
      ratePerUnit: '',
      totalUnits: '',
      total: '',
    },
  });

  //   const [endCapFieldData , setEndCapFieldData] = useState({NO_OF_END_CAPS : "" , })
  const { vendorId } = useParams();
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const userName = localStorage.getItem('user_name');

  const handleSaveVendorPromotion = () => {
    const payload = {
      vendorId: vendorId,
      promotions: [
        {
          promotionType: 'END_CAPS',
          flag: true,
          subCategory: [
            {
              fieldName: 'string',
              fieldValue: 'string',
            },
          ],
        },
      ],
      createdBy: createdById,
      createdByName: userName,
    };
    createVendorPromotions(payload)
      .then(() => {})
      .catch(() => {});
  };
  const handleSubCategoryValueChange = (subcategory, field, value) => {
    setSubCategoryFieldData((prevState) => ({
      ...prevState,
      [subcategory]: {
        ...prevState[subcategory],
        [field]: value,
      },
    }));
  };

  const handleFetchVendorpromotions = () => {
    if (vendorId) {
      setloader(true);
      vendorPromotionsById(vendorId)
        .then((res) => {
          const data = res?.data?.data?.object?.promotions;

          const checkBoxValues = {};
          const subCategoryFieldData = {};

          data?.forEach((item) => {
            const { promotionType, flag, subCategory } = item;
            const key = promotionType;

            checkBoxValues[key] = flag;
            subCategoryFieldData[key] = {};

            subCategory?.forEach((subItem) => {
              subCategoryFieldData[key][subItem.fieldName] = subItem.fieldValue;
            });
          });
          setCheckBoxValues(checkBoxValues);
          setSubCategoryFieldData(subCategoryFieldData);
          setloader(false);
        })
        .catch(() => {});
    }
  };

  function mapStateData(stateData) {
    const mappedData = [];

    for (const key in stateData) {
      const promotionType = key;
      const subCategory = [];

      for (const subKey in stateData[key]) {
        if (stateData[key][subKey]) {
          subCategory.push({
            fieldName: subKey,
            fieldValue: stateData[key][subKey].toString(),
          });
        }
      }

      mappedData.push({
        promotionType,
        flag: subCategory.length > 0,
        subCategory,
      });
    }

    return mappedData;
  }
  const handleUpdateVendorPromotion = () => {
    const promotionData = mapStateData(subCategoryFieldData);
    const payload = {
      vendorId: vendorId,
      promotions: promotionData,
      createdBy: createdById,
      createdByName: userName,
    };
    updateVendorPromotions(payload)
      .then((res) => {
        handleFetchVendorpromotions();
      })
      .catch(() => {});
  };

  useEffect(() => {
    handleFetchVendorpromotions();
  }, []);

  return (
    <>
      {loader ? (
        <Spinner size={'1.3rem'} />
      ) : (
        <div style={{ padding: '15px' }}>
          <Card className="vendorCardShadow" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <div>
                <ModeStandbyIcon sx={{ color: '#ff2d55', fontSize: '30px' }} />
              </div>
              <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
                Build additional revenue streams and track
              </SoftTypography>
              <SoftTypography fontSize="14px" fontWeight="bold" variant="caption" mt={-1}>
                non-trade revenue for your store
              </SoftTypography>

              <SoftButton color="info">install</SoftButton>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default VendorDetailsPromotion;
