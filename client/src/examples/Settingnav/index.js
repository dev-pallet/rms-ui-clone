import "./setting-nav.css";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import SoftTypography from "components/SoftTypography";
import SellIcon from '@mui/icons-material/Sell';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PublicIcon from '@mui/icons-material/Public';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import PowerIcon from '@mui/icons-material/Power';
import {Link} from "react-router-dom";


const SettingNav = () =>{
    return (
        <DashboardLayout>
            <SoftBox className="setting-navbar-box">
                <Link to="/setting/overview">
                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <CorporateFareIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                        <SoftTypography className="setting-text-typo-org">Organization</SoftTypography>
                    </SoftBox>
                </SoftBox></Link>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <SellIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Product master</SoftTypography></SoftBox>
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <PeopleIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Users & Roles</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <TimerIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Tax master</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>


                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <LocationOnIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Locations</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <CardGiftcardIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Gift cards</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <BookmarksIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Sales channels</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <NotificationsIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Notification</SoftTypography>
                    </SoftBox>
                   
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <AccountBalanceWalletIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Wallet</SoftTypography>
                    </SoftBox>
                   
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <PublicIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Plan</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <CleanHandsIcon className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Billing</SoftTypography>
                    </SoftBox>
                    
                </SoftBox>

                <SoftBox className="setting-icons-box">
                    <SoftBox className="inner-icons-box">
                        <PowerIcon  className="fare-icon"/>
                    </SoftBox>
                    <SoftBox className="inner-text-box">
                    <SoftTypography className="setting-text-typo-org">Integration</SoftTypography>
                    </SoftBox>     
                </SoftBox>
            </SoftBox>
        </DashboardLayout>
    )
}

export default SettingNav;