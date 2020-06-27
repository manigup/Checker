import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  colors,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { firestore } from "../firebase";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: colors.grey[50],
    fontWeight: "bold",
  },
  body: {
    fontSize: 13,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
  },
  content: {
    padding: 0,
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  add: {
    backgroundColor: colors.grey[100],
  },
}));

const Teacher = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [lastIndex, setIndex] = useState("");

  useEffect(() => {
    firestore
      .collection("assignments")
      .where("uid", "==", props.user.uid)
      .get()
      .then((result) => {
        const rows = [];
        let index = 0;
        result.forEach(function (doc) {
          index += 1;
          rows.push(doc.data());
        });
        setIndex(index);
        setRows(rows);
      })
      .catch((error) => {});
  });

  const onNewEntry = () => {
    setOpen(true);
  };

  const onDialogClose = () => {
    setOpen(false);
  };

  const onChangeHandler = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const onSave = (event) => {
    event.preventDefault();
    const uname = props.user.name.split(" ");
    const no = rows.length > 0 ? lastIndex + 1 : 1;
    firestore.collection("assignments").add({
      uid: props.user.uid,
      aid:
        uname[0].substring(0, 1).toUpperCase() +
        uname[1].substring(0, 1).toUpperCase() +
        "CHEASS" +
        no,
      name: name,
      email: props.user.email,
    });
    setOpen(false);
  };

  const onTableRowClick = (aid) => {
    history.push("/uploads/" + aid);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Dialog
        open={open}
        onClose={onDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Assignment</DialogTitle>
        <DialogContent>
          <form autoComplete="false" onSubmit={onSave}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Assignment Name"
              name="name"
              autoFocus
              onChange={onChangeHandler}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className={classes.paper}>
        <Card>
          <CardHeader
            action={
              <IconButton
                aria-label="add"
                className={classes.add}
                onClick={onNewEntry}
              >
                <AddIcon />
              </IconButton>
            }
            title="Assignments"
          />
          <Divider />
          <CardContent className={classes.content}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr No.</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Aid</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    onClick={() => onTableRowClick(row.aid)}
                  >
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>{row.aid}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Teacher;