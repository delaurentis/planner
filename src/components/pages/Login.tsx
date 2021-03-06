import React, { useRef, useState } from 'react';
import Button from '../presentation/Button';
import Header from '../presentation/Header';
import styles from './Login.module.css';
import { Vendor } from 'data/types';
import { redirectToVendorAuthorization } from 'data/vendors';

interface AutoLoginProps {
  onChooseManual(): void;
  vendor: Vendor;
}

const AutoLogin: React.FC<AutoLoginProps> = (props) => {

  const handleLoginClick = () => {
    redirectToVendorAuthorization(props.vendor.name);
  }

  const handleAlternateClick = (e: any) => {
    e.preventDefault();
    if ( props.onChooseManual ) {
      props.onChooseManual();
    }
  }

  return (
    <div>
      <h1>{props.vendor.instructionTitle}</h1>
      <div className={styles.LoginParagraph}>{props.vendor.instructionBody}</div>
      <div>
        <span className={styles.LoginButton}><Button onClick={handleLoginClick} title={`Login with ${props.vendor.title}`}/></span>
        <div className={styles.LoginAlternate}>
          <a onClick={handleAlternateClick}>
            Use a developer token
          </a>
        </div>
      </div>
    </div>
  );
  
}

interface ManualLoginProps {
  vendor: Vendor;
}

const ManualLogin: React.FC<ManualLoginProps> = (props) => {

  // As the user types into the token field, preserve it's state
  const [token, setToken] = useState<string>();

  // When they click login, store the provided token + reload the page
  const handleLoginClick = () => {
    window.localStorage.setItem(props.vendor.tokenName, token || '');
    if ( props.vendor.redirectAfterLogin ) {
      const port = window.location.port && `:${window.location.port}`;
      window.location.href = `${window.location.protocol}//${window.location.hostname}${port}`;
    }
  }

  return (
    <div>
      <h1>Hello developer.</h1>
      <div className={styles.LoginParagraph}>Please paste your {props.vendor.name} Access Token below.</div>
      <div>
        <div><input className={styles.LoginInput} 
              value={token} 
              onChange={event => { setToken(event.target.value); }} 
              placeholder='R2d2a8XwdKaBb8xC3pO'></input>
        </div>
        <Button onClick={handleLoginClick} title='Login'/>
        <div className={styles.LoginAlternate}><a href={props.vendor.personalTokenUrl}>Generate a token</a></div>
      </div>
      <div className={styles.LoginInstructions}>
        <div className={styles.LoginParagraph}><b>Note</b> - When creating a token, please be sure to check the {props.vendor.scope} scope checkbox!</div>
        <img className={styles.LoginScreenshot} src={props.vendor.instructionImage}/>
      </div>
    </div>
  );
}

interface LoginProps {
  vendor: Vendor;
}

const Login: React.FC<LoginProps> = (props) => {

  // You can access automatic login on localhost if you add 
  // create a clientID for http://localhost:3000.  Not all
  // vendors allow this, and manual logins can be used 
  // when needed for development
  const [isManual, setManual] = useState(false);
  const chooseManual = () => setManual(true);

  const loginContent = () => 
    <div className={styles.LoginContent}>
      {isManual ? <ManualLogin vendor={props.vendor}/> : <AutoLogin onChooseManual={chooseManual} vendor={props.vendor}/>}
    </div>;

  if ( props.vendor.isLoginFullscreen ) {
    return (
      <div className={styles.Login}>
        <Header isLogoPermanent={true}/>
        {loginContent()}
      </div>
    );
  }
  else {
    return (
      <div className={styles.LoginNonFullscreenWrapper}>
        {loginContent()}
      </div>
    );
  }

}

export default Login; 