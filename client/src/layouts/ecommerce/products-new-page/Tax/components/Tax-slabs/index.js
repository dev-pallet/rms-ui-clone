import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import { CircularProgress, Grid, Typography } from '@mui/material';
import SoftInput from '../../../../../../components/SoftInput';
import SoftButton from '../../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CloseIcon from '@mui/icons-material/Close';
import Dashboard from '@mui/icons-material/Dashboard';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { createTaxSlab, editTaxSlab, filterTaxMaster, filterTaxSlabs } from '../../../../../../config/Services';
import SoftSelect from '../../../../../../components/SoftSelect';
import { RequiredAsterisk } from '../../../../Common/CommonFunction';

const ProductTaxSlab = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [taxSlabData, setTaxSlabData] = useState([
    {
      id: 1,
      hsnCode: '',
      description: '',
      newFields: [],
    },
  ]);
  const [domData, setDomData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [importData, setImportData] = useState([]);
  const location1 = useLocation();
  const showSnackBar = useSnackbar();
  const [uniqueTaxArray, setUniqueTaxArray] = useState([]);
  const [taxMasterId, setTaxMasterId] = useState('');
  const [taxValues, setTaxValues] = useState([]);
  const [allTaxOptions, setAllTaxOptions] = useState([]);

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const slabId = params.get('slabId');
    return { slabId };
  };

  const { slabId } = getQueryParams();

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;

    setTaxSlabData((prevData) =>
      prevData.map((form) => {
        if (form.id === id) {
          return {
            ...form,
            [name]: value, // Update hsnCode or description directly
          };
        }
        return form; // Return unchanged form if ID doesn't match
      }),
    );
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceLocationId: [locId],
      sourceId: [orgId],
      active: [true],
    };
    filterTaxMaster(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
        } else {
          const options =
            res?.data?.data?.results?.map((item) => ({
              label: item?.taxMasterId,
              value: item?.taxMasterId,
            })) || [];
          setAllTaxOptions(options);
        }
      })
      .catch((err) => {
        showSnackbar('Error fetching tax master data', 'error');
      });
  }, []);

  const handleTaxSlabChange = (id, e, title) => {
    const { name, value } = e.target; // Only get name and value from the event

    setTaxSlabData((prevData) =>
      prevData.map((form) => {
        if (form.id === id) {
          const updatedNewFields = form.newFields.map((field) => {
            if (field.components.length > 0) {
              const updatedComponents = field.components.map((taxObject) => {
                const taxKey = Object.keys(taxObject)[0];

                // Match title and tax key
                const taxKeyMatch = taxKey.toLowerCase() === name.toLowerCase();

                // Update value if the tax key matches
                if (field.title === title && taxKeyMatch) {
                  return { [taxKey]: value }; // Update the specific tax object with the new value
                }

                return taxObject; // Return unchanged taxObject if no match
              });

              return {
                ...field,
                components: updatedComponents,
              };
            }
            return field;
          });

          return {
            ...form,
            newFields: updatedNewFields,
          };
        }
        return form;
      }),
    );
  };

  const removeTaxSlab = (id) => {
    setTaxSlabData(taxSlabData.filter((form) => form.id !== id));
  };

  const getAllTaxMaster = (id) => {
    setLoader(true);
    const payload = {
      page: 1,
      pageSize: 50,
      sourceLocationId: [locId],
      sourceId: [orgId],
      taxMasterId: [id],
    };

    filterTaxMaster(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackbar(res?.data?.message, 'error');
        }
        setLoader(false);
        const results = res?.data?.data?.results[0];
        setDomData(results?.domesticSalesTaxComponents || []);
        setExportData(results?.exportSalesTaxComponents || []);
        setPurchaseData(results?.domesticPurchaseTaxComponents || []);
        setImportData(results?.exportPurchaseTaxComponents || []);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar('Error fetching tax master data', 'error');
      });
  };

  const getAllTaxSlabs = () => {
    const payload = {
      page: 1,
      pageSize: 10,
      slabId: [slabId],
    };

    filterTaxSlabs(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackBar(res?.data?.message, 'error');
        } else {
          const results = res?.data?.data?.results[0];
          if (results) {
            const { taxCode, taxDescription, metadata, type, subType } = results;

            // Initialize the title based on the type and subType
            let title = '';

            if (type === 'DOMESTIC') {
              if (subType === 'SALES') {
                title = 'domesticSales';
              } else if (subType === 'PURCHASE') {
                title = 'purchase';
              }
            } else if (type === 'EXPORT') {
              if (subType === 'SALES') {
                title = 'exportSales';
              } else if (subType === 'PURCHASE') {
                title = 'importPurchase';
              }
            }

            // Create newFields based on metadata
            const newFields = metadata
              ? [
                  {
                    title, // Use the derived title
                    components: Object.keys(metadata).map((key) => ({ [key]: metadata[key] })),
                  },
                ]
              : [];

            const updatedSlab = {
              id: 1,
              hsnCode: taxCode,
              description: taxDescription || '',
              newFields, // Include the new fields
            };

            // Store the slab data including metadata fields
            setTaxSlabData([updatedSlab]);
            setTaxMasterId(results?.taxMasterId);
          }
        }
      })
      .catch((err) => {
        showSnackBar('Error fetching tax slab data', 'error');
      });
  };

  useEffect(() => {
    const mergedTaxArray = {
      domesticSales: domData,
      exportSales: exportData,
      purchase: purchaseData,
      importPurchase: importData,
    };

    // Creating the formatted tax array
    const formattedTaxArray = Object.entries(mergedTaxArray).map(([key, components]) => ({
      title: key, // Title for each category
      components: components.map((tax) => ({
        [tax]: '', // Assuming tax is a valid key you want to use
      })),
    }));

    // Update taxSlabData with newFields
    setTaxSlabData((prevTaxSlabData) => {
      // If there are existing slabs, add newFields to each slab
      if (prevTaxSlabData.length > 0) {
        return prevTaxSlabData.map((slab) => ({
          ...slab,
          newFields: formattedTaxArray,
        }));
      } else {
        // If no slabs exist, create a new slab with newFields
        return [
          {
            id: 1,
            hsnCode: '',
            description: '',
            newFields: formattedTaxArray,
          },
        ];
      }
    });
  }, [domData, exportData, purchaseData, importData]);

  useEffect(() => {
    if (slabId) {
      getAllTaxSlabs();
    }
  }, [slabId]);

  const addTaxSlab = () => {
    // Get the new fields from the first tax slab data (assuming they are the same for all slabs)
    const newFields = taxSlabData[0]?.newFields || [];

    const newSlab = {
      id: taxSlabData.length + 1,
      hsnCode: '',
      description: '',
      newFields: newFields.map((field) => ({ ...field, value: '' })), // Initialize new fields with empty values
    };

    setTaxSlabData([...taxSlabData, newSlab]);
  };

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const name = localStorage.getItem('user_name');

  const handleTaxSlabCreation = () => {
    const payload = [];
    setLoader(true);

    taxSlabData?.forEach((item) => {
      item?.newFields?.forEach((field) => {
        const metadata = {};

        // Loop through the components and add key-value pairs to the metadata object
        field?.components?.forEach((component) => {
          const taxKey = Object.keys(component)[0]; // Get the tax key
          const taxValue = component[taxKey]; // Get the tax value
          if (taxValue !== undefined) {
            // Only include if taxValue is not undefined
            metadata[taxKey] = taxValue || ''; // Add to metadata
          }
        });

        // Skip this field if there are no components in the metadata (optional)
        if (Object.keys(metadata).length === 0) {
          return;
        }

        // Determine type and subType based on title
        let type = 'DOMESTIC';
        let subType = '';

        // Adjust logic for EXPORT and IMPORT types
        if (field?.title === 'domesticSales') {
          subType = 'SALES';
        } else if (field?.title === 'purchase') {
          subType = 'PURCHASE';
        } else if (field?.title === 'exportSales') {
          type = 'EXPORT'; // Change type to EXPORT
          subType = 'SALES';
        } else if (field?.title === 'importPurchase') {
          type = 'EXPORT'; // Change type to EXPORT
          subType = 'PURCHASE';
        }

        // Push the payload object to the payload array
        if (subType) {
          payload.push({
            taxMasterId: taxMasterId,
            taxCode: item.hsnCode,
            type: type,
            subType: subType,
            taxDescription: item.description || 'Default Description',
            sourceId: orgId,
            sourceLocationId: locId,
            createdBy: uidx,
            createdByName: name,
            updatedBy: uidx,
            updatedByName: name,
            metadata,
          });
        }
      });
    });
    if (!taxMasterId) {
      showSnackBar('Please select a tax master id', 'error');
      setLoader(false);
      return;
    }

    createTaxSlab(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackbar(res?.data?.message, 'error');
        }
        setLoader(false);
        showSnackbar(`Tax slab created for id ${taxMasterId} successfully`, 'success');
        navigate('/products/tax');
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar('Error while creating tax slab', 'error');
      });
  };

  const handleEditTaxSlab = () => {
    const payload = [];

    taxSlabData?.forEach((item) => {
      item?.newFields?.forEach((field) => {
        const metadata = {};

        // Loop through the components and add key-value pairs to the metadata object
        field?.components?.forEach((component) => {
          const taxKey = Object.keys(component)[0]; // Get the tax key
          const taxValue = component[taxKey]; // Get the tax value
          if (taxValue !== undefined) {
            // Only include if taxValue is not undefined
            metadata[taxKey] = taxValue || ''; // Add to metadata
          }
        });

        // Skip this field if there are no components in the metadata (optional)
        if (Object.keys(metadata).length === 0) {
          return;
        }

        // Determine type and subType based on title
        let type = 'DOMESTIC';
        let subType = '';

        // Adjust logic for EXPORT and IMPORT types
        if (field?.title === 'domesticSales') {
          subType = 'SALES';
        } else if (field?.title === 'purchase') {
          subType = 'PURCHASE';
        } else if (field?.title === 'exportSales') {
          type = 'EXPORT'; // Change type to EXPORT
          subType = 'SALES';
        } else if (field?.title === 'importPurchase') {
          type = 'EXPORT'; // Change type to EXPORT
          subType = 'PURCHASE';
        }

        // Push the payload object to the payload array
        if (subType) {
          payload.push({
            taxMasterId: taxMasterId,
            taxCode: item.hsnCode,
            type: type,
            subType: subType,
            sourceId: orgId,
            sourceLocationId: locId,
            taxDescription: item.description || 'Default Description',
            slabId: slabId,
            updatedBy: uidx,
            updatedByName: name,
            metadata,
          });
        }
      });
    });

    editTaxSlab(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
        }
        showSnackbar(`Tax slab for id ${slabId} edited successfully`, 'success');
        navigate('/products/tax');
      })
      .catch((err) => {
        showSnackbar('Error while editing tax slab', 'error');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <div>
        <SoftBox className="products-new-department-form-box">
          <div
            className="products-new-department-right-bar"
            style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}
          >
            {/* <KeyboardBackspaceIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowCreateTaxSlabs(false), setIsTaxSlabEditing(false);
            }}
          /> */}
            {/* <button>Tax slab look up</button> */}
          </div>
          <form>
            <Grid container style={{ marginBottom: '15px', marginTop: '15px' }}>
              <Grid item xs={12} md={5} lg={12} className="products-new-department-each-field">
                <label className="products-department-new-form-label">Tax Master Id</label>
                <RequiredAsterisk />
                <SoftSelect
                  placeholder="Select tax master id..."
                  size="small"
                  options={allTaxOptions}
                  value={allTaxOptions?.find((option) => option.value === taxMasterId)}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setTaxMasterId(selectedOption?.value);
                      getAllTaxMaster(selectedOption?.value); // Call with selected Tax Master Id
                    }
                  }}
                />
              </Grid>
            </Grid>
            {taxSlabData.map((form) => (
              <div key={form.id} style={{ marginBottom: '30px' }}>
                {/* First Row: HSN Code and Description */}

                <Grid container spacing={1} style={{ marginBottom: '15px', marginTop: '15px' }}>
                  <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">HSN Code</label>
                    <SoftInput
                      type="number"
                      name="hsnCode"
                      placeholder="Enter HSN Code..."
                      value={form.hsnCode}
                      size="small"
                      onChange={(e) => handleInputChange(form.id, e)}
                    />
                  </Grid>
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Description</label>
                    <SoftInput
                      type="text"
                      name="description"
                      placeholder="Enter desc..."
                      value={form.description}
                      size="small"
                      onChange={(e) => handleInputChange(form.id, e)}
                    />
                  </Grid>
                  {taxSlabData.length > 1 && (
                    <Grid item lg={0.5}>
                      <CloseIcon
                        onClick={() => removeTaxSlab(form.id)}
                        style={{ color: 'red', fontSize: '20px', marginTop: '40px', cursor: 'pointer' }}
                      />
                    </Grid>
                  )}
                </Grid>

                {/* Dynamic Rows for Titles and Their Components */}
                {form.newFields.map(
                  (newField) =>
                    newField?.components?.length > 0 && ( // Check if components exist
                      <div key={newField?.title} style={{ marginBottom: '20px' }}>
                        {/* Title Row */}
                        <Typography
                          style={{ marginBottom: '10px' }}
                          className="products-new-details-variants-price-typo-2"
                        >
                          {newField?.title === 'domesticSales'
                            ? 'Domestic Sales Components'
                            : newField?.title === 'exportSales'
                            ? 'Export Sales Components'
                            : newField?.title === 'purchase'
                            ? 'Purchase Components'
                            : newField?.title === 'importPurchase'
                            ? 'Import Purchase Components'
                            : null}
                        </Typography>

                        {/* Components for the Title */}
                        <Grid container spacing={1}>
                          {newField?.components?.map((taxObject, index) => {
                            const taxKey = Object.keys(taxObject)[0]; // Get the tax key

                            return (
                              <Grid
                                item
                                xs={12}
                                md={5}
                                lg={2}
                                className="products-new-department-each-field"
                                key={index}
                              >
                                <label className="products-department-new-form-label">{taxKey} %</label>
                                <SoftInput
                                  type="number"
                                  name={taxKey?.toLowerCase()} // Ensure this matches the name used in handleTaxSlabChange
                                  placeholder="Enter..."
                                  value={taxObject[taxKey] || ''} // Use taxObject value for display
                                  size="small"
                                  onChange={(e) => handleTaxSlabChange(form.id, e, newField?.title)} // Pass the title here
                                />
                              </Grid>
                            );
                          })}
                        </Grid>
                      </div>
                    ),
                )}
              </div>
            ))}
            {!slabId && (
              <Typography type="button" onClick={addTaxSlab} className="products-new-department-addmore-btn-2">
                + Add more
              </Typography>
            )}
          </form>
        </SoftBox>

        <SoftBox display="flex" justifyContent="flex-end" mt={4}>
          <SoftBox display="flex">
            <SoftButton
              className="vendor-second-btn"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </SoftButton>
            <SoftBox ml={2}>
              <SoftButton
                color="info"
                className="vendor-add-btn"
                onClick={slabId ? handleEditTaxSlab : handleTaxSlabCreation}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : slabId ? (
                  <>Edit</>
                ) : (
                  <>Save</>
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </div>
    </DashboardLayout>
  );
};

export default ProductTaxSlab;
