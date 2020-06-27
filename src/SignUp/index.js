import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [account, setAccounType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loader, setLoader] = useState(false);

  if (props.user) {
    return (
      <Redirect
        to={{
          pathname: "/dashboard",
        }}
      />
    );
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "account":
        setAccounType(value);
        break;
      default:
        return;
    }
  };

  const writeUserData = (userId) => {
    firestore.collection("users").add({
      uid: userId,
      name: firstName + " " + lastName,
      email: email,
      type: account,
    });
    setLoader(false);
    setSuccess(true);
  };

  const onRegister = (event) => {
    event.preventDefault();
    setLoader(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        credential.user.updateProfile({
          displayName: firstName + " " + lastName,
        });
        writeUserData(credential.user.uid);
      })
      .catch((error) => {
        setError(error.message);
        setLoader(false);
      });
  };

  const onErrorClose = () => {
    setError("");
  };

  const onSuccessClose = () => {
    setSuccess(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={error !== ""}
        autoHideDuration={6000}
        onClose={onErrorClose}
      >
        <Alert onClose={onErrorClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={success}
        autoHideDuration={6000}
        onClose={onSuccessClose}
      >
        <Alert onClose={onSuccessClose} severity="success">
          {"Registered Successfully"}
        </Alert>
      </Snackbar>
      <Backdrop open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          autoComplete="false"
          onSubmit={onRegister}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="account"
                name="account"
                label="Account Type"
                select
                onChange={onChangeHandler}
              >
                <MenuItem key={"T"} value={"T"}>
                  Teacher
                </MenuItem>
                <MenuItem key={"S"} value={"S"}>
                  Student
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
