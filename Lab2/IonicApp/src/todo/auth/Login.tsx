import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../../ionic3';
import ErrorMessages from './ErrorMessages';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = () => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const { username, password } = state;
  const handleLogin = () => {
    console.log(username, password)
    log('handleLogin...');
    if(!username || !password) {
      setShowValidationError(true);
    }
    else {
        setShowValidationError(false);
        login?.(username, password);
    }
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLabel>Enter your credentials here: </IonLabel>
        <IonInput
          className="custom-input-style"
          required type="text"
          placeholder="Username"
          value={username}
          onIonChange={e => setState({
            ...state,
            username: e.detail.value || ''
          })}/>

        <IonInput
          className="custom-input-style"
          required type="password"
          placeholder="Password"
          value={password}
          onIonChange={e => setState({
            ...state,
            password: e.detail.value || ''
          })}/>
        <IonLoading isOpen={isAuthenticating}/>
        <IonButton className="custom-login-button-style" color='warning' onClick={handleLogin}>Login</IonButton>

        {showValidationError && 
          <ErrorMessages 
          allMandatory="All fields are mandatory" 
          usernameMandatory = {username? "username : checked" : "enter username"}
          passwordMandatory = {showValidationError && password? "password : checked":"enter password"} 
          authFailed = {undefined}
          wrong = {undefined}
          />
        }

        {authenticationError && 
          <ErrorMessages
            allMandatory = "" 
            usernameMandatory = {undefined}
            passwordMandatory = {undefined} 
            authFailed = "Authentication failed"
            wrong = "Wrong credentials"
          />
        }
      </IonContent>
    </IonPage>
  );
};
