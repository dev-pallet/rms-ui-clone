import React, { useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import AddEmployeeDescription from './components/AddEmployeeDescription';
import IncorporatedAddress from './components/IncorporatedAddress';
import '../../hrms.css';
import KycDocument from './components/KycDocument';
import SoftButton from '../../../../../components/SoftButton';
import WorkInfo from './components/WorkInfo';
import PersonalDetails from './components/PersonalDetails';
import sideNavUpdate from '../../components/sidenavupdate';
import { useNavigate } from 'react-router-dom';
import { hrmsCreateEmployees } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import BankDetails from './components/BankDetails';
import EmploymentDetailsWrapper from './components/EmploymentDetails';
import { v4 as uuidv4 } from 'uuid';
import SocialMediaLinks from './components/SocialMediaLinks';

function AddEmployee() {
  sideNavUpdate();
  const [open, setOpen] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('center');
  const [esClr, setesClr] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [reportingAuthority, setReportingAuthority] = useState({});
  const [employmentType, setEmploymentType] = useState({});
  const [employmentStatus, setEmploymentStatus] = useState({});
  const [sourceOfHire, setSourceOfHire] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState();
  const [gender, setGender] = useState('');
  const [officialPhoneNo, setOfficialPhoneNo] = useState('');
  const [personalPhoneNo, setPersonalPhoneNo] = useState('');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
  const [officialCountryCode, setOfficialCountryCode] = useState('');
  const [personalCountryCode, setPersonalCountryCode] = useState('');
  const [emergencyCountryCode, setEmergencyCountryCode] = useState('');
  const [visaExpiryDate, setVisaExpiryDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [employmentVisa, setEmploymentVisa] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [presentAddressLineOne, setPresentAddressLineOne] = useState('');
  const [presentAddressLineTwo, setPresentAddressLineTwo] = useState('');
  const [presentSelectedState, setPresentSelectedState] = useState({});
  const [presentSelectedCity, setPresentSelectedCity] = useState({});
  const [presentPinCode, setPresentPinCode] = useState('');
  const [permanentAddressLineOne, setPermanentAddressLineOne] = useState('');
  const [permanentAddressLineTwo, setPermanentAddressLineTwo] = useState('');
  const [permanentSelectedState, setPermanentSelectedState] = useState([]);
  const [permanentSelectedCity, setPermanentSelectedCity] = useState([]);
  const [permanentPinCode, setPermanentPinCode] = useState('');
  const [adhaarNumber, setAdhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankingType, setBankingType] = useState('');
  const [employerDetails, setEmployerDetails] = useState([
    { id: uuidv4(), employerName: '', startDate: '', endDate: '', yoe: '', verified: false },
  ]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [skypeUsername, setSkypeUsername] = useState('');

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const validatePayload = (payload) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!payload.name || !nameRegex.test(payload.name.trim())) {
      setErrorHandler('Employee Name must contain only alphabets and spaces.');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    if (!payload.email || !emailRegex.test(payload.email.trim())) {
      setErrorHandler('Please enter a valid Employee Email address.');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    return true;
  };

  const backToEmployeeList = () => {
    navigate('/hrms-employee');
  };

  const createNewEmployee = (event) => {
    event.preventDefault();

    const employerDetailsPayload = employerDetails?.map((el) => ({
      employerName: el?.employerName,
      startDate: el?.startDate,
      endDate: el?.endDate,
      yearsOfExperience: el?.yoe,
      verificationStatus: el?.verified,
    }));

    const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '';
    const linkedinLink = linkedinUsername ? `https://linkedin.com/in/${linkedinUsername}` : '';
    const skypeLink = skypeUsername ? `skype:${skypeUsername}?chat` : '';

    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const fullName = localStorage.getItem('user_name');
    const user_details = localStorage.getItem('user_details');
    const createdById = user_details && JSON.parse(user_details).uidx;
    const payload = {
      organizationId: orgId,
      locationId: locId,
      createdBy: createdById,
      createdByName: fullName,
      name: name,
      linkedinLink: linkedinLink,
      whatsappLink: whatsappLink,
      skypeLink: skypeLink,
      nickName: nickName,
      email: email,
      teamId: null,
      backgroundVerification: null,
      verificationDate: null,
      age: age,
      departmentId: departmentId,
      designationId: designationId,
      photoUrl: photoUrl,
      bloodGroup: bloodGroup,
      passportNumber: passportNumber,
      employmentType: employmentType?.value,
      employmentStatus: employmentStatus?.value,
      sourceOfHire: sourceOfHire,
      dateOfJoining: dateOfJoining,
      reportingManager: reportingAuthority?.value,
      dateOfBirth: dob,
      maritalStatus: maritalStatus,
      gender: gender,
      officialContactNo: officialPhoneNo,
      officialPhoneExtension: officialCountryCode,
      emergencyContactNo: emergencyPhoneNumber,
      emergencyPhoneExtension: emergencyCountryCode,
      employmentVisa: employmentVisa,
      visaExpiryDate: visaExpiryDate,
      nationality: nationality,
      phoneNo: personalPhoneNo,
      personalPhoneExtension: personalCountryCode,
      uanNumber: uanNumber,
      panNumber: panNumber,
      aadhaarNumber: adhaarNumber,
      emergencyContactName: emergencyContactName,
      emergencyContactRelation: emergencyContactRelation,
      addresses: [
        {
          addressLine1: presentAddressLineOne,
          addressLine2: presentAddressLineTwo,
          country: 'India',
          state: presentSelectedState?.label,
          city: presentSelectedCity?.label,
          pinCode: presentPinCode,
          addressType: 'present',
        },
        {
          addressLine1: permanentAddressLineOne,
          addressLine2: permanentAddressLineTwo,
          country: 'India',
          state: permanentSelectedState?.label,
          city: permanentSelectedCity?.label,
          pinCode: permanentPinCode,
          addressType: 'permanent',
        },
      ],
      bankDetails: {
        accountName: accountName,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        bankingType: bankingType,
      },
      employerDetails: employerDetailsPayload,
      managerId: null,
    };
    if (!validatePayload(payload)) {
      return;
    }

    hrmsCreateEmployees(payload)
      .then((res) => {
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          showSnackbar('Employee added successfully', 'success');
          navigate('/hrms-employee');
        } else {
          showSnackbar(`${res?.data?.data?.message}`, 'warning');
        }
      })
      .catch((err) => {
        if (err.response) {
          showSnackbar(err.response.data?.message || 'Server error occurred', 'error');
        } else if (err.request) {
          showSnackbar('No response from server. Please check your connection.', 'error');
        } else {
          showSnackbar(err.message || 'An unknown error occurred', 'error');
        }
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box p={1}>
        <SoftBox p={1} className="common-display-flex">
          <SoftTypography fontWeight="bold" fontSize="1.1rem">
            Add People
          </SoftTypography>{' '}
        </SoftBox>
        <SoftBox className="main-product-description">
          <AddEmployeeDescription
            name={name}
            setName={setName}
            nickName={nickName}
            setNickName={setNickName}
            age={age}
            setAge={setAge}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
          />
        </SoftBox>
        <SoftBox className="main-product-description mtop">
          <WorkInfo
            departmentId={departmentId}
            setDepartmentId={setDepartmentId}
            designationId={designationId}
            setDesignationId={setDesignationId}
            reportingAuthority={reportingAuthority}
            setReportingAuthority={setReportingAuthority}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            employmentStatus={employmentStatus}
            setEmploymentStatus={setEmploymentStatus}
            sourceOfHire={sourceOfHire}
            setSourceOfHire={setSourceOfHire}
            dateOfJoining={dateOfJoining}
            setDateOfJoining={setDateOfJoining}
          />
        </SoftBox>
        <SoftBox className="main-product-description mtop">
          <PersonalDetails
            dob={dob}
            setDob={setDob}
            gender={gender}
            setGender={setGender}
            maritalStatus={maritalStatus}
            setMaritalStatus={setMaritalStatus}
            officialPhoneNo={officialPhoneNo}
            setOfficialPhoneNo={setOfficialPhoneNo}
            personalPhoneNo={personalPhoneNo}
            setPersonalPhoneNo={setPersonalPhoneNo}
            emergencyPhoneNumber={emergencyPhoneNumber}
            setEmergencyPhoneNumber={setEmergencyPhoneNumber}
            officialCountryCode={officialCountryCode}
            setOfficialCountryCode={setOfficialCountryCode}
            personalCountryCode={personalCountryCode}
            setPersonalCountryCode={setPersonalCountryCode}
            emergencyCountryCode={emergencyCountryCode}
            setEmergencyCountryCode={setEmergencyCountryCode}
            visaExpiryDate={visaExpiryDate}
            setVisaExpiryDate={setVisaExpiryDate}
            email={email}
            setEmail={setEmail}
            nationality={nationality}
            setNationality={setNationality}
            bloodGroup={bloodGroup}
            setBloodGroup={setBloodGroup}
            emergencyContactName={emergencyContactName}
            setEmergencyContactName={setEmergencyContactName}
            emergencyContactRelation={emergencyContactRelation}
            setEmergencyContactRelation={setEmergencyContactRelation}
            passportNumber={passportNumber}
            setPassportNumber={setPassportNumber}
            employmentVisa={employmentVisa}
            setEmploymentVisa={setEmploymentVisa}
          />
        </SoftBox>
        <SoftBox className="main-product-description mtop">
          <IncorporatedAddress
            presentAddressLineOne={presentAddressLineOne}
            setPresentAddressLineOne={setPresentAddressLineOne}
            presentAddressLineTwo={presentAddressLineTwo}
            setPresentAddressLineTwo={setPresentAddressLineTwo}
            presentSelectedState={presentSelectedState}
            setPresentSelectedState={setPresentSelectedState}
            presentSelectedCity={presentSelectedCity}
            setPresentSelectedCity={setPresentSelectedCity}
            presentPinCode={presentPinCode}
            setPresentPinCode={setPresentPinCode}
            permanentAddressLineOne={permanentAddressLineOne}
            setPermanentAddressLineOne={setPermanentAddressLineOne}
            permanentAddressLineTwo={permanentAddressLineTwo}
            setPermanentAddressLineTwo={setPermanentAddressLineTwo}
            permanentSelectedState={permanentSelectedState}
            setPermanentSelectedState={setPermanentSelectedState}
            permanentSelectedCity={permanentSelectedCity}
            setPermanentSelectedCity={setPermanentSelectedCity}
            permanentPinCode={permanentPinCode}
            setPermanentPinCode={setPermanentPinCode}
          />
        </SoftBox>
        <SoftBox className="main-product-description mtop">
          <SocialMediaLinks
            whatsappNumber={whatsappNumber}
            setWhatsappNumber={setWhatsappNumber}
            linkedinUsername={linkedinUsername}
            setLinkedinUsername={setLinkedinUsername}
            skypeUsername={skypeUsername}
            setSkypeUsername={setSkypeUsername}
          />
        </SoftBox>

        <SoftBox className="main-product-description mtop">
          <KycDocument
            adhaarNumber={adhaarNumber}
            setAdhaarNumber={setAdhaarNumber}
            panNumber={panNumber}
            setPanNumber={setPanNumber}
            uanNumber={uanNumber}
            setUanNumber={setUanNumber}
          />
        </SoftBox>

        <SoftBox className="main-product-description mtop">
          <BankDetails
            accountName={accountName}
            setAccountName={setAccountName}
            bankName={bankName}
            setBankName={setBankName}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            bankingType={bankingType}
            setBankingType={setBankingType}
          />
        </SoftBox>

        <SoftBox>
          <EmploymentDetailsWrapper employerDetails={employerDetails} setEmployerDetails={setEmployerDetails} />
        </SoftBox>

        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
            <SoftButton className="vendor-second-btn" onClick={backToEmployeeList}>
              Cancel
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={createNewEmployee}>
              Save
            </SoftButton>
          </SoftBox>
        </Grid>
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={esClr} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default AddEmployee;
