import React from 'react';

import './auth.css';

const ErrorMessages = (props: { allMandatory: any | undefined, usernameMandatory: any | undefined, passwordMandatory: any | undefined, authFailed: any | undefined, wrong: any | undefined }) => {
    
    return (
    <div>
      <div>
          <p>{props.authFailed}</p>
      </div>
      <div>
          <p>{props.wrong}</p>
      </div>
      <div>
          <p>{props.allMandatory}</p>
      </div>
      <div>
          <p>{props.usernameMandatory}</p>
      </div>
      <div>
          <p>{props.passwordMandatory}</p>
      </div>
    </div>);

};

export default ErrorMessages;