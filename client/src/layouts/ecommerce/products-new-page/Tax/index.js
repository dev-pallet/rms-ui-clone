import React, { useEffect, useState } from 'react';
import './Product-tax.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import SoftButton from '../../../../components/SoftButton';
import {
  createTaxMaster,
  editTaxMaster,
  filterTaxMaster,
  getBranchAllAdresses,
  getLocationwarehouseData,
  getRetailUserLocationDetails,
} from '../../../../config/Services';
import { country } from '../../softselect-Data/country';
import { states } from '../../new-location/components/statedetails';

const ProductTaxCreation = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [selectedTab, setSelectedTab] = useState('Tax-master');
  const [domesticSales, setDomesticSales] = useState('');
  const [exportSales, setExportSales] = useState('');

  const [domesticPurchase, setDomesticPurchase] = useState('');
  const [exportPurchase, setExportPurchase] = useState('');

  const [locOp, setLocOp] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedLocationV, setSelectedLocationV] = useState([]);
  const [checkedExport, setCheckedExport] = useState('');
  const [checkedImport, setCheckedImport] = useState('');

  const [useSimilarForImport, setUseSimilarForImport] = useState('');
  const [useSimilarForPurchase, setUseSimilarForPurchase] = useState('');
  const [primaryBusinessLocation, setPrimaryBusinessLocation] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const [selectedDomesticTax, setSelectedDomesticTax] = useState([]);
  const [selectedExportSalesTax, setSelectedExportSalesTax] = useState([]);
  const [selectedPurchaseTax, setSelectedPurchaseTax] = useState([]);
  const [selectedImportPurchaseTax, setSelectedImportPurchaseTax] = useState([]);
  const [loader, setLoader] = useState(false);
  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const taxId = params.get('taxId');
    return { taxId };
  };

  const { taxId } = getQueryParams();

  const getAllTaxMaster = () => {
    const payload = {
      page: 1,
      pageSize: 10,
      sourceLocationId: [locId],
      sourceId: [orgId],
      taxMasterId: [taxId],
    };

    filterTaxMaster(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackBar(res?.data?.message, 'error');
        } else {
          const results = res?.data?.data?.results[0];
          if (results?.location.length !== 0) {
            const selectedTaxComponents = locOp.filter((option) => results?.location?.includes(option?.value));
            const uniqueSelectedTaxComponents = Array.from(
              new Set(selectedTaxComponents.map((item) => item.value)),
            ).map((value) => selectedTaxComponents.find((item) => item.value === value));
            setSelectedLocationV(uniqueSelectedTaxComponents);
            setSelectedLocation(uniqueSelectedTaxComponents);
          }
          if (results?.domesticSalesTax) {
            setDomesticSales('Taxable');
          }
          if (results?.exportSalesTax) {
            setExportSales('Taxable');
          }
          if (results?.domesticPurchaseTax) {
            setDomesticPurchase('Taxable');
          }
          if (results?.exportPurchaseTax) {
            setExportPurchase('Taxable');
          }
          if (results?.domesticSalesTaxComponents.length !== 0) {
            const selectedTaxComponents = taxComponentsOptions.filter((option) =>
              results?.domesticSalesTaxComponents?.includes(option?.value),
            );
            const uniqueSelectedTaxComponents = Array.from(
              new Set(selectedTaxComponents.map((item) => item.value)),
            ).map((value) => selectedTaxComponents.find((item) => item.value === value));
            setSelectedDomesticTax(uniqueSelectedTaxComponents);
          }
          if (results?.exportSalesTaxComponents.length !== 0) {
            const selectedTaxComponents = taxComponentsOptions.filter((option) =>
              results?.exportSalesTaxComponents?.includes(option?.value),
            );
            const uniqueSelectedTaxComponents = Array.from(
              new Set(selectedTaxComponents.map((item) => item.value)),
            ).map((value) => selectedTaxComponents.find((item) => item.value === value));
            setSelectedExportSalesTax(uniqueSelectedTaxComponents);
          }
          if (results?.domesticPurchaseTaxComponents.length !== 0) {
            const selectedTaxComponents = taxComponentsOptions.filter((option) =>
              results?.domesticPurchaseTaxComponents?.includes(option?.value),
            );
            const uniqueSelectedTaxComponents = Array.from(
              new Set(selectedTaxComponents.map((item) => item.value)),
            ).map((value) => selectedTaxComponents.find((item) => item.value === value));
            setSelectedPurchaseTax(uniqueSelectedTaxComponents);
          }
          if (results?.exportPurchaseTaxComponents.length !== 0) {
            const selectedTaxComponents = taxComponentsOptions.filter((option) =>
              results?.exportPurchaseTaxComponents?.includes(option?.value),
            );
            const uniqueSelectedTaxComponents = Array.from(
              new Set(selectedTaxComponents.map((item) => item.value)),
            ).map((value) => selectedTaxComponents.find((item) => item.value === value));
            setSelectedImportPurchaseTax(uniqueSelectedTaxComponents);
          }
        }
      })
      .catch((err) => {
        // showSnackBar('Error fetching tax master data', 'error');
      });
  };

  useEffect(() => {
    getAllTaxMaster();
  }, [taxId, locOp]);

  const handleDomSalesChange = (event) => {
    setDomesticSales(event.target.value);
  };

  const handleExpSalesChange = (event) => {
    setExportSales(event.target.value);
  };

  const handleDomPurchaseChange = (event) => {
    setDomesticPurchase(event.target.value);
  };

  const handleExpPurchaseChange = (event) => {
    setExportPurchase(event.target.value);
  };

  useEffect(() => {
    if (contextType == 'RETAIL') {
      getRetailUserLocationDetails(orgId).then((res) => {
        const loc = res?.data?.data?.branches.map((e) => {
          return {
            value: e?.branchId,
            label: e?.displayName,
          };
        });
        setLocOp(loc);
      });
    } else if (contextType == 'WMS') {
      getLocationwarehouseData(orgId).then((res) => {
        const loc = res?.data?.data?.locationDataList.map((e) => {
          return {
            value: e?.locationId,
            label: e?.locationName,
          };
        });
        setLocOp(loc);
      });
    }
  }, []);

  const getPrimaryBusinessLocation = () => {
    getBranchAllAdresses(locId)
      .then((res) => {
        setPrimaryBusinessLocation(res?.data?.data?.addresses[0].country);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getPrimaryBusinessLocation();
  }, []);

  const handleAutocompleteChange = (event, options) => {
    // If "All" is selected, set all locations as selected
    if (taxId) {
      setSelectedLocation(options);
      setSelectedLocationV(options);
    } else {
      const newSelectedLocation = options;
      setSelectedLocation(newSelectedLocation);
      // setSelectedLocationV(newSelectedLocationV.includes('All') ? allLocationsV : newSelectedLocationV);
    }
  };

  const taxComponentsOptions = [
    {
      label: 'GST',
      value: 'GST',
    },
    {
      label: 'CGST',
      value: 'CGST',
    },
    {
      label: 'IGST',
      value: 'IGST',
    },
    {
      label: 'CESS',
      value: 'CESS',
    },
    {
      label: 'VAT',
      value: 'VAT',
    },
    {
      label: 'TVSH',
      value: 'TVSH',
    },
    {
      label: 'IGI',
      value: 'IGI',
    },
    {
      label: 'PDV',
      value: 'PDV',
    },
    {
      label: 'MVG',
      value: 'MVG',
    },
    {
      label: 'VSK',
      value: 'VSK',
    },
    {
      label: 'MWST',
      value: 'MWST',
    },
    {
      label: 'TVA',
      value: 'TVA',
    },
    {
      label: 'MVA',
      value: 'MVA',
    },
    {
      label: 'IGIC',
      value: 'IGIC',
    },
    {
      label: 'IPSI',
      value: 'IPSI',
    },
    {
      label: 'PPN',
      value: 'PPN',
    },
    {
      label: 'SST',
      value: 'SST',
    },
  ];

  const handleChangeDomesticSales = (event, options) => {
    if (taxId) {
      setSelectedDomesticTax(options);
    } else {
      const allSelected = options?.map((option) => option?.label);
      setSelectedDomesticTax(options);
    }
  };

  const handleChangeExportSales = (event, options) => {
    if (taxId) {
      setSelectedExportSalesTax(options);
    } else {
      setSelectedExportSalesTax(options);
    }
  };

  const handleChangePurchaseTax = (event, options) => {
    if (taxId) {
      setSelectedPurchaseTax(options);
    } else {
      setSelectedPurchaseTax(options);
    }
  };

  const handleChangeImportPurchaseSales = (event, options) => {
    if (taxId) {
      setSelectedImportPurchaseTax(options);
    } else {
      setSelectedImportPurchaseTax(options);
    }
  };

  const handleCreateTaxMaster = () => {
    setLoader(false);
    const payload = {
      primaryBusinessLocation: primaryBusinessLocation,
      location: selectedLocation?.map((item) => item?.value),
      domesticSalesTaxComponents: selectedDomesticTax?.map((item) => item?.label),
      domesticPurchaseTaxComponents: selectedPurchaseTax?.map((item) => item?.label),
      exportSalesTaxComponents: selectedExportSalesTax?.map((item) => item?.label),
      exportPurchaseTaxComponents: selectedImportPurchaseTax?.map((item) => item?.label),
      domesticSalesTax: domesticSales === 'Taxable' ? true : false,
      exportSalesTax: exportSales === 'Taxable' ? true : false,
      domesticPurchaseTax: domesticPurchase === 'Taxable' ? true : false,
      exportPurchaseTax: exportPurchase === 'Taxable' ? true : false,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      createdBy: uidx,
      createdByName: user_name,
      updatedBy: uidx,
      updatedByName: user_name,
      listedOn: [],
    };
    createTaxMaster(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackBar(res?.data?.message, 'error');
        }
        setLoader(false);
        showSnackBar('Tax Master created successfully', 'success');
        navigate('/products/tax');
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('Error while creating a tax master', 'error');
      });
  };

  const handleEditTaxMaster = () => {
    setLoader(false);
    const payload = {
      taxMasterId: taxId,
      primaryBusinessLocation: primaryBusinessLocation,
      location: selectedLocationV?.map((loc) => loc.value),
      domesticSalesTaxComponents: selectedDomesticTax?.map((tax) => tax.label),
      domesticPurchaseTaxComponents: selectedPurchaseTax?.map((tax) => tax.label),
      exportSalesTaxComponents: selectedExportSalesTax?.map((tax) => tax.label),
      exportPurchaseTaxComponents: selectedImportPurchaseTax?.map((tax) => tax.label),
      domesticSalesTax: domesticSales === 'Taxable' ? true : false,
      exportSalesTax: exportSales === 'Taxable' ? true : false,
      domesticPurchaseTax: domesticPurchase === 'Taxable' ? true : false,
      exportPurchaseTax: exportPurchase === 'Taxable' ? true : false,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      createdBy: uidx,
      createdByName: user_name,
      updatedBy: uidx,
      updatedByName: user_name,
      listedOn: [],
    };
    editTaxMaster(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackBar(res?.data?.message, 'error');
        }
        setLoader(false);
        showSnackBar(`Tax Master with ${taxId} edited successfully`, 'success');
        navigate('/products/tax');
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('Error while editing a tax master', 'error');
      });
  };

  const handleUseSimilarForPurchaseChange = (event) => {
    const isChecked = event.target.checked ? 'Yes' : 'No';
    setUseSimilarForPurchase(isChecked);
    if (isChecked === 'Yes') {
      setSelectedPurchaseTax(selectedDomesticTax);
    }
  };

  const handleSetImportPurchase = (event) => {
    const isChecked = event.target.checked ? 'Yes' : 'No';
    setUseSimilarForImport(isChecked);

    if (isChecked === 'Yes') {
      setSelectedImportPurchaseTax(selectedExportSalesTax);
    }
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="products-new-main-box">
          <>
            <SoftBox className="products-new-department-form-box">
              <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={6} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Choose Business Location</label>

                  <Autocomplete
                    multiple
                    options={locOp}
                    onChange={handleAutocompleteChange}
                    value={selectedLocation}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} placeholder="Select Location" />}
                  />
                  {/* <SoftSelect
                    placeholder="Select country..."
                    options={country}
                    size="small"
                    onChange={(option) => setSelectedCountry(option.label)}
                    value={country.find((option) => option.label === addressDetailsData?.country) || null}
                    menuPortalTarget={document.body}
                  /> */}
                  {/* <SoftSelect
                    placeholder="Select state..."
                    options={states}
                    size="small"
                    onChange={(option) => handleAddressChange('state', option.value)}
                    value={states.find((option) => option.label === addressDetailsData?.state) || null}
                    menuPortalTarget={document.body}
                  /> */}
                </Grid>
              </Grid>
            </SoftBox>

            <SoftBox className="products-new-department-form-box">
              <Typography className="products-department-new-form-label-2">Sales tax setup</Typography>

              <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Domestic Sales</label>
                  <SoftBox className="products-new-tax-sales-box">
                    <div>
                      <input
                        type="radio"
                        id="scheduleYesqw"
                        name="scheduleGrouperf"
                        value="Taxable"
                        className="dynamic-coupon-marginright-10"
                        checked={domesticSales === 'Taxable'}
                        onChange={handleDomSalesChange}
                      />
                      <label for="scheduleYesqw" className="products-new-department-label-typo">
                        Taxable
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="scheduleYeswe"
                        name="scheduleGroupfeg"
                        value="Exempted"
                        className="dynamic-coupon-marginright-10"
                        checked={domesticSales === 'Exempted'}
                        onChange={handleDomSalesChange}
                      />
                      <label for="scheduleYeswe" className="products-new-department-label-typo">
                        Exempted
                      </label>
                    </div>
                  </SoftBox>
                </Grid>

                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field"></Grid>
              </Grid>

              {domesticSales === 'Taxable' && (
                <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Tax Components</label>
                    <Autocomplete
                      multiple
                      options={taxComponentsOptions} // Add "All" option
                      onChange={handleChangeDomesticSales}
                      value={selectedDomesticTax}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} placeholder="Select..." />}
                    />
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="export"
                      name="sales"
                      checked={checkedExport === 'Yes'}
                      onChange={() => setCheckedExport('Yes')}
                    />
                    <label className="products-department-new-form-label">Export Sales</label>
                  </div>
                  {checkedExport === 'Yes' && (
                    <SoftBox className="products-new-tax-sales-box">
                      <div>
                        <input
                          type="radio"
                          id="scheduleYesfd"
                          name="scheduleGroupref"
                          value="Taxable"
                          className="dynamic-coupon-marginright-10"
                          checked={exportSales === 'Taxable'}
                          onChange={handleExpSalesChange}
                        />
                        <label for="scheduleYesfd" className="products-new-department-label-typo">
                          Taxable
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="scheduleYesedf"
                          name="scheduleGroupfv"
                          value="Exempted"
                          className="dynamic-coupon-marginright-10"
                          checked={exportSales === 'Exempted'}
                          onChange={handleExpSalesChange}
                        />
                        <label for="scheduleYesedf" className="products-new-department-label-typo">
                          Exempted
                        </label>
                      </div>
                    </SoftBox>
                  )}
                </Grid>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field"></Grid>
              </Grid>

              {exportSales === 'Taxable' && (
                <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Tax Components</label>
                    <Autocomplete
                      multiple
                      options={taxComponentsOptions} // Add "All" option
                      onChange={handleChangeExportSales}
                      value={selectedExportSalesTax}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} placeholder="Select..." />}
                    />
                  </Grid>
                </Grid>
              )}
            </SoftBox>

            <SoftBox className="products-new-department-form-box">
              <Typography className="products-department-new-form-label-2">Purchase tax setup</Typography>

              <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Domestic purchase</label>
                  <SoftBox className="products-new-tax-sales-box">
                    <div>
                      <input
                        type="radio"
                        id="scheduleYesqwde"
                        name="scheduleGrouperfde"
                        value="Taxable"
                        className="dynamic-coupon-marginright-10"
                        checked={domesticPurchase === 'Taxable'}
                        onChange={handleDomPurchaseChange}
                      />
                      <label for="scheduleYesqwde" className="products-new-department-label-typo">
                        Taxable
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="scheduleYeswede"
                        name="scheduleGroupfegde"
                        value="Exempted"
                        className="dynamic-coupon-marginright-10"
                        checked={domesticPurchase === 'Exempted'}
                        onChange={handleDomPurchaseChange}
                      />
                      <label for="scheduleYeswede" className="products-new-department-label-typo">
                        Exempted
                      </label>
                    </div>
                  </SoftBox>
                </Grid>

                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field"></Grid>
              </Grid>

              {domesticPurchase === 'Taxable' && (
                <Grid
                  container
                  spacing={2}
                  style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Tax Components</label>
                    <Autocomplete
                      multiple
                      options={taxComponentsOptions} // Add "All" option
                      onChange={handleChangePurchaseTax}
                      value={selectedPurchaseTax}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} placeholder="Select..." />}
                    />
                  </Grid>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '30px' }}>
                      <input
                        type="checkbox"
                        id="export"
                        name="import"
                        checked={useSimilarForPurchase === 'Yes'}
                        onChange={handleUseSimilarForPurchaseChange}
                      />
                      <label className="products-department-new-form-label">Use similar components as sales tax</label>
                    </div>
                  </Grid>
                </Grid>
              )}

              <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="export"
                      name="import"
                      checked={checkedImport === 'Yes'}
                      onChange={() => setCheckedImport('Yes')}
                    />
                    <label className="products-department-new-form-label">Import</label>
                  </div>
                  {checkedImport === 'Yes' && (
                    <SoftBox className="products-new-tax-sales-box">
                      <div>
                        <input
                          type="radio"
                          id="scheduleYesfdde"
                          name="scheduleGrouprefde"
                          value="Taxable"
                          className="dynamic-coupon-marginright-10"
                          checked={exportPurchase === 'Taxable'}
                          onChange={handleExpPurchaseChange}
                        />
                        <label for="scheduleYesfdde" className="products-new-department-label-typo">
                          Taxable
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="scheduleYesedfde"
                          name="scheduleGroupfvde"
                          value="Exempted"
                          className="dynamic-coupon-marginright-10"
                          checked={exportPurchase === 'Exempted'}
                          onChange={handleExpPurchaseChange}
                        />
                        <label for="scheduleYesedfde" className="products-new-department-label-typo">
                          Exempted
                        </label>
                      </div>
                    </SoftBox>
                  )}
                </Grid>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field"></Grid>
              </Grid>

              {exportPurchase === 'Taxable' && (
                <Grid
                  container
                  spacing={2}
                  style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Tax Components</label>
                    <Autocomplete
                      multiple
                      options={taxComponentsOptions} // Add "All" option
                      onChange={handleChangeImportPurchaseSales}
                      value={selectedImportPurchaseTax}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} placeholder="Select..." />}
                    />
                  </Grid>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '30px' }}>
                      <input
                        type="checkbox"
                        id="export"
                        name="import"
                        checked={useSimilarForImport === 'Yes'}
                        onChange={handleSetImportPurchase}
                      />
                      <label className="products-department-new-form-label">Use similar components as sales tax</label>
                    </div>
                  </Grid>
                </Grid>
              )}
            </SoftBox>

            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
                  Cancel
                </SoftButton>
                <SoftBox ml={2}>
                  <SoftButton
                    color="info"
                    className="vendor-add-btn"
                    onClick={taxId ? handleEditTaxMaster : handleCreateTaxMaster}
                  >
                    {loader ? (
                      <CircularProgress
                        size={18}
                        sx={{
                          color: '#fff',
                        }}
                      />
                    ) : taxId ? (
                      <>Edit</>
                    ) : (
                      <>Save</>
                    )}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default ProductTaxCreation;
