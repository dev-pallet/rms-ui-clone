import React, { useEffect, useState } from 'react';
import sideNavUpdate from '../../components/sidenavupdate';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Grid, Snackbar } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import AddEmployeeDescription from './components/AddEmployeeDescription';
import WorkInfo from './components/WorkInfo';
import PersonalDetails from './components/PersonalDetails';
import IncorporatedAddress from './components/IncorporatedAddress';
import KycDocument from './components/KycDocument';
import SoftButton from '../../../../../components/SoftButton';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import { hrmsGetEmployee, hrmsUpdateEmployees } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SocialMediaLinks from './components/SocialMediaLinks';
import BankDetails from './components/BankDetails';
import EmploymentDetailsWrapper from './components/EmploymentDetails';

function HrmsUpdateEmployeeDetails() {
  sideNavUpdate();

  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [employmentType, setEmploymentType] = useState(null);
  const [employmentStatus, setEmploymentStatus] = useState(null);
  const [sourceOfHire, setSourceOfHire] = useState(null);
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(null);
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
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [designationDetails, setDesignationDetails] = useState(null);
  const [reportingAuthority, setReportingAuthority] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [presentAddressId, setPresentAddressId] = useState('');
  const [presentAddressLineOne, setPresentAddressLineOne] = useState('');
  const [presentAddressLineTwo, setPresentAddressLineTwo] = useState('');
  const [presentSelectedState, setPresentSelectedState] = useState(null);
  const [presentSelectedCity, setPresentSelectedCity] = useState(null);
  const [presentPinCode, setPresentPinCode] = useState('');
  const [permanentAddressId, setPermanentAddressId] = useState('');
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
  const [employerDetails, setEmployerDetails] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [skypeUsername, setSkypeUsername] = useState('');

  const { id } = useParams();

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const employmentTypeCheck = (data) => {
    switch (data) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PROBATION':
        return 'Probation';
      case 'CONTRACTED':
        return 'Contracted';
      case 'INTERNS':
        return 'Intern';
      default:
        break;
    }
  };

  const employmentStatusCheck = (data) => {
    switch (data) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Probation';
      case 'ON_LEAVE':
        return 'On Leave';
      case 'TERMINATED':
        return 'Terminated';
      default:
        break;
    }
  };
  const parseWhatsappNumber = (link) => link?.replace('https://wa.me/', '') || '';
  const parseLinkedinUsername = (link) => link?.replace('https://linkedin.com/in/', '') || '';
  const parseSkypeUsername = (link) => link?.replace('skype:', '').split('?')[0] || '';

  useEffect(() => {
    showSnackbar('Employee data is loading', 'info', '', '', '', '', '', true);

    hrmsGetEmployee(id).then((res) => {
      if (res?.status == 200 && res?.data?.data?.es == 0) {
        setPhotoUrl(res?.data?.data?.data?.photoUrl);
        setName(res?.data?.data?.data?.name);
        setNickName(res?.data?.data?.data?.nickName);
        setAge(res?.data?.data?.data?.age);
        setDepartmentDetails({
          label: res?.data?.data?.data?.departmentName,
          value: res?.data?.data?.data?.departmentId,
        });
        setDesignationDetails({
          label: res?.data?.data?.data?.designationName,
          value: res?.data?.data?.data?.designationId,
        });
        setEmploymentType({
          label: employmentTypeCheck(res?.data?.data?.data?.employmentType),
          value: res?.data?.data?.data?.employmentType,
        });
        setEmploymentStatus({
          label: employmentStatusCheck(res?.data?.data?.data?.employmentStatus),
          value: res?.data?.data?.data?.employmentStatus,
        });
        setSourceOfHire({ label: res?.data?.data?.data?.sourceOfHire, value: res?.data?.data?.data?.sourceOfHire });
        setDateOfJoining(res?.data?.data?.data?.dateOfJoining);
        setReportingAuthority({
          label: res?.data?.data?.data?.reportingManagerName,
          value: res?.data?.data?.data?.reportingManagerId,
        });
        setDob(res?.data?.data?.data?.dateOfBirth);
        setEmail(res?.data?.data?.data?.email);
        setNationality(res?.data?.data?.data?.nationality);
        setBloodGroup(res?.data?.data?.data?.bloodGroup);
        setEmergencyContactName(res?.data?.data?.data?.emergencyContactName);
        setEmergencyContactRelation(res?.data?.data?.data?.emergencyContactRelation);
        setPassportNumber(res?.data?.data?.data?.passportNumber);
        setEmploymentVisa(res?.data?.data?.data?.employmentVisa);
        setVisaExpiryDate(res?.data?.data?.data?.visaExpiryDate);
        setGender({ label: res?.data?.data?.data?.gender, value: res?.data?.data?.data?.gender });
        setMaritalStatus({ label: res?.data?.data?.data?.maritalStatus, value: res?.data?.data?.data?.maritalStatus });
        setPersonalPhoneNo(res?.data?.data?.data?.personalContactNo);
        setEmergencyPhoneNumber(res?.data?.data?.data?.emergencyContactNo);
        setOfficialCountryCode(res?.data?.data?.data?.officialPhoneExtension);
        setPersonalCountryCode(res?.data?.data?.data?.personalPhoneExtension);
        setEmergencyCountryCode(res?.data?.data?.data?.emergencyPhoneExtension);
        setOfficialPhoneNo(res?.data?.data?.data?.officialContactNo);
        setPresentAddressLineOne(
          res?.data?.data?.data?.addresses[0]?.addressType == 'present'
            ? res?.data?.data?.data?.addresses[0]?.addressLine1
            : res?.data?.data?.data?.addresses[1]?.addressLine1,
        );
        setPresentAddressLineTwo(
          res?.data?.data?.data?.addresses[0]?.addressType == 'present'
            ? res?.data?.data?.data?.addresses[0]?.addressLine2
            : res?.data?.data?.data?.addresses[1]?.addressLine2,
        );
        setPresentAddressId(
          res?.data?.data?.data?.addresses[0]?.addressType == 'present'
            ? res?.data?.data?.data?.addresses[0]?.addressId
            : res?.data?.data?.data?.addresses[1]?.addressId,
        );
        setPresentSelectedState(
          res?.data?.data?.data?.addresses[0]?.addressType == 'present'
            ? { label: res?.data?.data?.data?.addresses[0]?.state, value: res?.data?.data?.data?.addresses[0]?.state }
            : { label: res?.data?.data?.data?.addresses[1]?.state, value: res?.data?.data?.data?.addresses[1]?.state },
        );
        setPresentSelectedCity(
          res?.data?.data?.data?.addresses[0]?.addressType == 'present'
            ? { label: res?.data?.data?.data?.addresses[0]?.city, value: res?.data?.data?.data?.addresses[0]?.city }
            : { label: res?.data?.data?.data?.addresses[1]?.city, value: res?.data?.data?.data?.addresses[1]?.city },
        );
        setPresentPinCode(
          res?.data?.data?.data?.addresses[0]?.addressType == 'present'
            ? res?.data?.data?.data?.addresses[0]?.pinCode
            : res?.data?.data?.data?.addresses[1]?.pinCode,
        );

        setPermanentAddressId(
          res?.data?.data?.data?.addresses[0]?.addressType == 'permanent'
            ? res?.data?.data?.data?.addresses[0]?.addressId
            : res?.data?.data?.data?.addresses[1]?.addressId,
        );

        setPermanentAddressLineOne(
          res?.data?.data?.data?.addresses[0]?.addressType == 'permanent'
            ? res?.data?.data?.data?.addresses[0]?.addressLine1
            : res?.data?.data?.data?.addresses[1]?.addressLine1,
        );
        setPermanentAddressLineTwo(
          res?.data?.data?.data?.addresses[0]?.addressType == 'permanent'
            ? res?.data?.data?.data?.addresses[0]?.addressLine2
            : res?.data?.data?.data?.addresses[1]?.addressLine2,
        );

        setPermanentSelectedState(
          res?.data?.data?.data?.addresses[0]?.addressType == 'permanent'
            ? { label: res?.data?.data?.data?.addresses[0]?.state, value: res?.data?.data?.data?.addresses[0]?.state }
            : { label: res?.data?.data?.data?.addresses[1]?.state, value: res?.data?.data?.data?.addresses[1]?.state },
        );
        setPermanentSelectedCity(
          res?.data?.data?.data?.addresses[0]?.addressType == 'permanent'
            ? { label: res?.data?.data?.data?.addresses[0]?.city, value: res?.data?.data?.data?.addresses[0]?.city }
            : { label: res?.data?.data?.data?.addresses[1]?.city, value: res?.data?.data?.data?.addresses[1]?.city },
        );
        setPermanentPinCode(
          res?.data?.data?.data?.addresses[0]?.addressType == 'permanent'
            ? res?.data?.data?.data?.addresses[0]?.pinCode
            : res?.data?.data?.data?.addresses[0]?.pinCode,
        );
        setWhatsappNumber(parseWhatsappNumber(res?.data?.data?.data?.whatsappLink));
        setLinkedinUsername(parseLinkedinUsername(res?.data?.data?.data?.linkedinLink));
        setSkypeUsername(parseSkypeUsername(res?.data?.data?.data?.skypeLink));
        setAdhaarNumber(res?.data?.data?.data?.aadhaarNumber);
        setPanNumber(res?.data?.data?.data?.panNumber);
        setUanNumber(res?.data?.data?.data?.uanNumber);
        setAccountName(res?.data?.data?.data?.bankDetails?.accountName || '');
        setBankName(res?.data?.data?.data?.bankDetails?.bankName || '');
        setAccountNumber(res?.data?.data?.data?.bankDetails?.accountNumber || '');
        setIfscCode(res?.data?.data?.data?.bankDetails?.ifscCode || '');
        setBankingType(res?.data?.data?.data?.bankDetails?.bankingType || '');
        setEmployerDetails(res?.data?.data?.data?.employerDetails);

        showSnackbar('Employee data loaded successfully', 'success');
      } else {
        showSnackbar('Something went wrong', 'error');
      }
    });
  }, []);

  const validatePayload = (payload) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!payload?.name || !nameRegex?.test(payload?.name?.trim())) {
      setErrorHandler('Employee Name must contain only alphabets and spaces.');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    if (!payload?.email || !emailRegex?.test(payload?.email?.trim())) {
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

  const updateEmployeeDetails = (event) => {
    event.preventDefault();
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const fullName = localStorage.getItem('user_name');
    const user_details = localStorage.getItem('user_details');
    const createdById = user_details && JSON.parse(user_details).uidx;

    const employerDetailsPayload = employerDetails?.map((el) => ({
      employerDetailsId: el?.employerDetailsId,
      employerName: el?.employerName,
      startDate: el?.startDate,
      endDate: el?.endDate,
      yearsOfExperience: el?.yearsOfExperience,
      verificationStatus: el?.verificationStatus,
    }));

    const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '';
    const linkedinLink = linkedinUsername ? `https://linkedin.com/in/${linkedinUsername}` : '';
    const skypeLink = skypeUsername ? `skype:${skypeUsername}?chat` : '';

    const genderVal = gender?.value;
    const maritalStatusVal = maritalStatus?.value;
    const payload = {
      organizationId: orgId,
      locationId: locId,
      updatedBy: createdById,
      updatedByName: fullName,
      photoUrl: photoUrl,
      name: name,
      nickName: nickName,
      age: age,
      departmentId: departmentDetails?.value,
      designationId: designationDetails?.value,
      reportingManager: reportingAuthority?.value,
      employmentType: employmentType?.value,
      employmentStatus: employmentStatus?.value,
      sourceOfHire: sourceOfHire?.value,
      dateOfJoining: dateOfJoining,
      dateOfBirth: dob,
      email: email,
      teamId: null,
      backgroundVerification: null,
      verificationDate: null,
      gender: genderVal,
      maritalStatus: maritalStatusVal,
      bloodGroup: bloodGroup,
      passportNumber: passportNumber,
      employmentVisa: employmentVisa,
      visaExpiryDate: visaExpiryDate,
      nationality: nationality,
      phoneNo: personalPhoneNo,
      personalPhoneExtension: personalCountryCode,
      officialContactNo: officialPhoneNo,
      officialPhoneExtension: officialCountryCode,
      emergencyContactNo: emergencyPhoneNumber,
      emergencyPhoneExtension: emergencyCountryCode,
      emergencyContactName: emergencyContactName,
      emergencyContactRelation: emergencyContactRelation,
      addresses: [
        {
          addressId: presentAddressId,
          addressLine1: presentAddressLineOne,
          addressLine2: presentAddressLineTwo,
          country: 'India',
          state: presentSelectedState?.label,
          city: presentSelectedCity?.label,
          pinCode: presentPinCode,
          addressType: 'present',
        },
        {
          addressId: permanentAddressId,
          addressLine1: permanentAddressLineOne,
          addressLine2: permanentAddressLineTwo,
          country: 'India',
          state: permanentSelectedState?.label,
          city: permanentSelectedCity?.label,
          pinCode: permanentPinCode,
          addressType: 'permanent',
        },
      ],
      linkedinLink: linkedinLink,
      whatsappLink: whatsappLink,
      skypeLink: skypeLink,
      uanNumber: uanNumber,
      panNumber: panNumber,
      aadhaarNumber: adhaarNumber,
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

    hrmsUpdateEmployees(payload, id)
      .then((res) => {
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          showSnackbar('Employee details updated successfully', 'success');
          navigate('/hrms-employee');
        } else {
          showSnackbar(`${res?.data?.data?.message}`, 'warning');
        }
      })
      .catch((err) => {
        if (err?.response) {
          showSnackbar(err?.response.data?.message || 'Server error occurred', 'error');
        } else if (err?.request) {
          showSnackbar('No response from server. Please check your connection.', 'error');
        } else {
          showSnackbar(err?.message || 'An unknown error occurred', 'error');
        }
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box p={1}>
        <SoftBox p={1} className="common-display-flex">
          <SoftTypography fontWeight="bold" fontSize="1.1rem">
            Edit People
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
            departmentDetails={departmentDetails}
            setDepartmentDetails={setDepartmentDetails}
            designationDetails={designationDetails}
            setDesignationDetails={setDesignationDetails}
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
            <SoftButton className="vendor-add-btn" onClick={updateEmployeeDetails}>
              Save
            </SoftButton>
          </SoftBox>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default HrmsUpdateEmployeeDetails;
