
import { useState,useRef ,useContext} from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../Store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setLoading]=useState(false);
  const [isCnfPassword,setCnfPassword]= useState(false);
  const authCtx = useContext(AuthContext);
    const emailInputRef= useRef();
    const passwordInputRef=useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setCnfPassword((prevState) => !prevState)
  };

  const submitHandler = (event)=>{
    event.preventDefault()
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setLoading(true);

    let url;
    if(isLogin){
      url ="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBSqvCTHw5GhFMYZGXModtAAeJf2Kw-3mY";
    }
    else{
      url ="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBSqvCTHw5GhFMYZGXModtAAeJf2Kw-3mY";

    }
   fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        setLoading(false)
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            let errorMessage = "Authentication Failed! ";

            if (data && data.error && data.error.message){
              errorMessage = data.error.message
            }
            throw new Error(errorMessage)

          });
        }
      }).then(data=>{
         authCtx.login(data.idToken); // set the token for login
         history.replace('/')
      })
        .catch(err=>{
           alert(err.message);
         });
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.control}>
          {isCnfPassword && <label htmlFor="password">Confirm Password</label>}

          {isCnfPassword && (
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>
              {isLogin ? "Login" : "Create Account"}

            </button>
          )}
          {isLoading && <p>Sending request..</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
