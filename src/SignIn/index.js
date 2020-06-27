import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onLogin = (event) => {
    event.preventDefault();
    setLoader(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoader(false);
        auth.onAuthStateChanged((user) => {
          if (user) {
            firestore
              .collection("users")
              .where("uid", "==", user.uid)
              .get()
              .then((result) => {
                result.forEach(function (doc) {
                  const data = doc.data();
                  data.refreshToken = user.refreshToken;
                  localStorage.setItem("checker", JSON.stringify(data));
                  history.push("/dashboard");
                });
              })
              .catch((error) => {});
          }
        });
      })
      .catch((error) => {
        setError(error.message);
        setLoader(false);
      });
  };

  const onErrorClose = () => {
    setError("");
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
      <Backdrop open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} autoComplete="false" onSubmit={onLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            onChange={onChangeHandler}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={onChangeHandler}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="#">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
