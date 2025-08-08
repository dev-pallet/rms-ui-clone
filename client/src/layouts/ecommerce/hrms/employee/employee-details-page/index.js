import { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import { Card } from '@mui/material';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import AddEmployeeDescription from './components/AddEmployeeDescription';
import { useParams } from 'react-router-dom';
import { hrmsGetEmployee } from '../../../../../config/Services';
import IncorporatedAddress from './components/IncorporatedAddress';
import sideNavUpdate from '../../components/sidenavupdate';
import TabNavigator from './components/TabNavigator';
import EmployeeBankDetails from './components/EmployeeBankDetails';
import EmploymentDetails from './components/EmploymentDetails';
import PersonalInfo from './components/PersonalDetails';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

function HrmsEmployeeDetailsPage() {
  const { id } = useParams();
  sideNavUpdate();
  const showSnackbar = useSnackbar();
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [designationName, setDesignationName] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState();
  const [gender, setGender] = useState('');
  const [officialPhoneNo, setOfficialPhoneNo] = useState('');
  const [personalPhoneNo, setPersonalPhoneNo] = useState('');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
  const [visaExpiryDate, setVisaExpiryDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [employmentVisa, setEmploymentVisa] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [bankDetails, setBankDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [employeeId, setEmployeeId] = useState('');
  const [employerDetails, setEmployerDetails] = useState([]);
  const [linkedinLink, setLinkedinLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [skypeLink, setSkypeLink] = useState('');
  const [dobMonth, setDobMonth] = useState('');

  const checkEmploymentType = (type) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full time';
      case 'PROBATION':
        return 'Probation';
      case 'CONTRACTED':
        return 'Contracted';
      case 'INTERNS':
        return 'Intern';
      default:
        return;
    }
  };

  const checkDob = (val) => {
    if (val) {
      const date = new Date(val);
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getDate();
      return `${month} ${day}`;
    }
  };

  const checkEmploymentStatus = (type) => {
    switch (type) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'INACTIVE';
      case 'ON_LEAVE':
        return 'On Leave';
      case 'TERMINATED':
        return 'Terminated';
      default:
        return;
    }
  };

  const getEmployeeDetails = () => {
    hrmsGetEmployee(id)
      .then((res) => {
        setName(res?.data?.data?.data?.name || 'N/A');
        setEmploymentStatus(checkEmploymentStatus(res?.data?.data?.data?.employmentStatus || 'N/A'));
        setNickName(res?.data?.data?.data?.nickName || 'N/A');
        setDobMonth(checkDob(res?.data?.data?.data?.dateOfBirth) || 'N/A');
        setPhotoUrl(res?.data?.data?.data?.photoUrl || 'N/A');
        setLinkedinLink(res?.data?.data?.data?.linkedinLink);
        setWhatsappLink(res?.data?.data?.data?.whatsappLink);
        setSkypeLink(res?.data?.data?.data?.skypeLink);
        setDepartmentName(res?.data?.data?.data?.departmentName || 'N/A');
        setDesignationName(res?.data?.data?.data?.designationName || 'N/A');
        setEmployeeId(res?.data?.data?.data?.employeeId || 'N/A');
        setGender(res?.data?.data?.data?.gender || 'N/A');
        setMaritalStatus(res?.data?.data?.data?.maritalStatus || 'N/A');
        setOfficialPhoneNo(res?.data?.data?.data?.officialContactNo || 'N/A');
        setPersonalPhoneNo(res?.data?.data?.data?.personalContactNo || 'N/A');
        setEmail(res?.data?.data?.data?.email || 'N/A');
        setEmergencyPhoneNumber(res?.data?.data?.data?.emergencyContactNo || 'N/A');
        setEmergencyContactName(res?.data?.data?.data?.emergencyContactName || 'N/A');
        setEmergencyContactRelation(res?.data?.data?.data?.emergencyContactRelation || 'N/A');
        setBloodGroup(res?.data?.data?.data?.bloodGroup || 'N/A');
        setDob(res?.data?.data?.data?.dateOfBirth || 'N/A');
        setNationality(res?.data?.data?.data?.nationality || 'N/A');
        setPassportNumber(res?.data?.data?.data?.passportNumber || 'N/A');
        setEmploymentVisa(res?.data?.data?.data?.employmentVisa || 'N/A');
        setVisaExpiryDate(res?.data?.data?.data?.visaExpiryDate || 'N/A');
        setAddressDetails(res?.data?.data?.data?.addresses || {});
        setBankDetails(res?.data?.data?.data?.bankDetails || {});
        setEmployerDetails(res?.data?.data?.data?.employerDetails || {});
      })
      .catch((err) => {
        if (err?.response) {
          showSnackbar(err?.response?.data?.message ?? 'Server error occurred.', 'error');
        } else if (err?.request) {
          showSnackbar('Unable to connect to the server. Please try again later.', 'error');
        } else {
          showSnackbar('An unexpected error occurred. Please try again.', 'error');
        }
      });
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', overflow: 'visible' }}
      >
        <AddEmployeeDescription
          photoUrl={photoUrl}
          name={name}
          employmentStatus={employmentStatus}
          nickName={nickName}
          skypeLink={skypeLink}
          whatsappLink={whatsappLink}
          linkedinLink={linkedinLink}
          dobMonth={dobMonth}
          designationName={designationName}
          employeeId={employeeId}
          departmentName={departmentName}
        />
        <TabNavigator />

        <PersonalInfo
          name={name}
          gender={gender}
          maritalStatus={maritalStatus}
          officialPhoneNo={officialPhoneNo}
          personalPhoneNo={personalPhoneNo}
          emergencyPhoneNumber={emergencyPhoneNumber}
          email={email}
          emergencyContactName={emergencyContactName}
          emergencyContactRelation={emergencyContactRelation}
          bloodGroup={bloodGroup}
          dob={dob}
          nationality={nationality}
          passportNumber={passportNumber}
          employmentVisa={employmentVisa}
          visaExpiryDate={visaExpiryDate}
        />

        <IncorporatedAddress addressDetails={addressDetails} />

        <EmployeeBankDetails bankDetails={bankDetails} />

        {employerDetails.length > 0 && <EmploymentDetails employmentDetails={employerDetails} />}
      </Card>
    </DashboardLayout>
  );
}

export default HrmsEmployeeDetailsPage;
