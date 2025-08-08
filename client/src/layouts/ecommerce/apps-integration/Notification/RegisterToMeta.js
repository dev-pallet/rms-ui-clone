import './RegisterToMeta.css';
import PageLayout from '../../../../examples/LayoutContainers/PageLayout';
import React from 'react';

const RegisterToMeta = () => {
  return (
    <PageLayout>
      <div className="header-box">
        <h1>How to create a Meta App for Developers Account</h1>
        <br />
        <h4>Guide to Connect WhatsApp Cloud API to Pallet</h4>
        <h4>
          This instruction will help you find all three types of data that you need to use when connecting a channel in
          Pallet:
        </h4>
        <ul style={{color: '#2bac06'}}>
          <li>Phone number ID</li>
          <li>WhatsApp Business Account ID</li>
          <li>Access Token</li>
        </ul>
        <div className="steps-to-guide">
          <h4>Step 1</h4>
          <p>
            Make sure you already have a Facebook account. if you don't, then the registration process is quite simple: <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Click here to create an Account </a>
             else just enter your login and password, and then confirm the mail.
          </p>
          <h4>Step 2</h4>
          <p>
            Enable 2fa on your Facebook account:{' '}
            <a href="https://www.facebook.com/settings?tab=security" target="_blank" rel="noreferrer">
              https://www.facebook.com/settings?tab=security
            </a>
          </p>
          <img
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-000.png"
            alt=""
          />
          <h4>Step 3</h4>
          <p>Register as a developer.</p>
          <p>
            <a href="https://developers.facebook.com/async/registration/" target="_blank" rel="noreferrer">
              https://developers.facebook.com/async/registration/
            </a>{' '}
            and Create a Meta for Developers account
          </p>
          <p>Here you have to verify your account via SMS or e-mail and review your contact email address.</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-001.png"
          />
          <p>Review your email address, and continue</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-002.png"
          />
          <p>Choose a role as Developer and press "Complete Registration"</p>
          <img
            slt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-003.png"
          />
          <p>You are now registered as a developer!</p>
          <h4>Step 4</h4>
          <p>Creating the Facebook App</p>
          <p>To get started, create your first app.</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-004.jpg"
          />
          <p>Select the app type "Business" (The app type can't be changed after your app is created) and press Next</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-005.png"
          />
          <p>In next window you must provide your basic information: </p>
          <ul>
            <li>
              Add an app name (This is the app name that will show on your My Apps page and associated with your app ID.
              You can change the name later in Settings)
            </li>
            <li>
              App contact email (Make sure it is an address you check regularly. Facebook may contact you about
              policies, app restrictions or recovery if your app is deleted or compromised)
            </li>
          </ul>
          <p>Business Account (Optional)</p>
          <p>
            Connecting a Business Account to your app is only required for certain products and permissions. You'll be
            asked to connect a Business Account when you request access to those products and permissions.
          </p>
          <p>Press the button "Create app"</p>
          <p>It will ask for a password from the FB account - enter it and confirm.</p>
          <img
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-006.png"
            alt=""
          />
          <p>In the opened window select WhatsApp:</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996740/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-007.jpg"
          />
          <p>As a result, an application will appear in your account. Excellent!</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-008.jpg"
          />
          <h4>Step 5</h4>
          <p>Next, you need Meta's business account. </p>
          <p>
            Click on your application tile twice, the following window will open. Now we are starting to create a Meta
            business account.
          </p>
          <p>
            If it doesn't exist, it will be created automatically. If there is one, you can select it, or create a new
            one automatically.
          </p>
          <p>In the left menu bar, click on Getting started.</p>
          <p>In this example, this profile does not have a business account:</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-009.jpg"
          />
          <p>
            Notice: if the FB account is new, then the Meta token simply will not be issued. You have to wait ~60
            minutes
          </p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-010.jpg"
          />
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-011.png"
          />
          <p>If you see a generated token here, we can continue.</p>
          <p>Don't copy this token, you don't need it</p>
          <p>Now you need to add a phone number to the business (Step 5 on this window).</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-012.png"
          />
          <p>Press "Add phone number". Сomplete your business information to add your phone number.</p>
          <p>
            Be careful with the site address - Facebook checks the URL, and if the site is not found, it can block the
            business + the number associated with it
          </p>
          <p>If you don't have a business website, you can use a URL from any of your social media profile pages.</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-013.png"
          />
          <p>Add a description of the company, or just click Next:</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996741/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-014.png"
          />
          <p>Enter a number. It needs to be confirmed. </p>
          <p>
            Select the option "Text message" to receive a confirmation via SMS (selected by default), or select Phone
            Call to receive a call with a confirmation code. Fill in the number field and choose the way to receive the
            confirmation code without errors, otherwise you will have to wait 2 hours for the next attempt:
          </p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-015.png"
          />
          <p>
            An SMS with a confirmation code will be sent to the number, enter, click Next (if the SMS did not come,
            click Back, try to select Phone Call):
          </p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-016.png"
          />
          <p>
            If the page is refreshed, and the entered phone number appears in the From field, then everything is OK:
          </p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-017.png"
          />
          <p>
            This screen contains two of the three types of data that the client needs to connect the WhatsApp Cloud API
            to Pallet
          </p>
          <p>Phone number ID, WhatsApp Business Account ID</p>
          <img
            alt=""
            src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-018.jpg"
          />
          <p>Copy them and save them, you will need them when connecting the channel to Pallet</p>
          <h4>Step 6</h4>
          <p>Get an access token (the third and last field to connect the channel):</p>
          <ol>
            <li>
              Open the link{' '}
              <a href="https://business.facebook.com/settings" target="_blank" rel="noreferrer">
                https://business.facebook.com/settings
              </a>
            </li>
            <p>
              A client can have several businesses, it is important to choose the one on which the application was
              created. You can understand this from the list: check the business that has the created application:
            </p>
            <img
              src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-019.png"
              alt
            />
            <ol>
              <li>Select the desired business and press on the left bar Users - System Users - Add:</li>
              <img
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-019.png"
                alt=""
              />
              <li>
                Select the user type Admin (mandatory), set the name Jivo (this will help you to easily identify which
                system you use the token for integration). Click "Create system user"
              </li>
              <img
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996742/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-021.jpg"
                alt=""
              />
              <li> Add assets to the created user by clicking on the "Add Assets" button:</li>
              <img
                alt=""
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996738/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-022.png"
              />
              <p>In the window that opens, select the application and give access (Manage app enable), Save changes</p>
              <img
                alt=""
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996743/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-023.png"
              />
              <p>Next, we generate a new token in several steps. </p>
              <p>Click Generate New Token:</p>
              <img
                alt=""
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996738/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-024.png"
              />
              <p>
                Select the previously created application (if there is only one, it will be selected automatically):
              </p>
              <img
                alt=""
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996739/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-025.jpg"
              />
              <p>In permissions, we are only interested in </p>
              <p>whatsapp_business_messaging</p>
              <p>whatsapp_business_management</p>
              <img
                alt=""
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996738/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-026.png"
              />
              <p>Click "Generate Token"</p>
              <p>Your Access Token appears in the window that opens.</p>
              <p>
                It must be copied and saved, there will be no more access to it - this is the third component for
                connecting a channel in Pallet{' '}
              </p>
              <img
                alt=""
                src="https://res.cloudinary.com/dte7upwcr/image/upload/v1669996738/help/EN/connect%20whatsapp%20to%20jivo%20directly/image-027.png"
              />
            </ol>
          </ol>
          <p>You have successfully generated Phone Number ID, Whatsapp Business Account ID and access token. No you can connect WhatsApp with Pallet by clicking on Subscribe Now button</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default RegisterToMeta;
