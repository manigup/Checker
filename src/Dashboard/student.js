import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  Grid,
  MenuItem,
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
  Chip,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import { firestore, storage } from "../firebase";

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: colors.grey[200],
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
  input: {
    display: "none",
  },
  add: {
    backgroundColor: colors.blueGrey[100],
    padding: 5,
  },
  header: {
    backgroundColor: colors.cyan[600],
    color: colors.lime[50],
    padding: 10,
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 100,
    color: "#fff",
  },
  chip: {
    height: 25,
  },
}));

const Student = (props) => {
  const classes = useStyles();
  const allProps = { ...props };
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [tassignments, setTAssignments] = useState([]);
  const [report, setReport] = useState("");
  const [assignment, setAssignment] = useState("");
  const [file, setFile] = useState("");
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(false);

  const getUploads = () => {
    firestore
      .collection("uploads")
      .where("uid", "==", allProps.user.uid)
      .get()
      .then((result) => {
        const rows = [];
        result.forEach(function (doc) {
          rows.push(doc.data());
        });
        setRows(rows);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    firestore
      .collection("users")
      .where("type", "==", "T")
      .get()
      .then((result) => {
        const data = [];
        result.forEach(function (doc) {
          data.push(doc.data());
        });
        setTeachers(data);
      })
      .catch((error) => {});

    getUploads();
  }, []);

  const onNewUpload = () => {
    setOpen(true);
  };

  const onDialogClose = () => {
    setOpen(false);
  };

  const onChangeHandler = (event) => {
    debugger;
    const { name, value } = event.target;
    switch (name) {
      case "report":
        setReport(value);
        firestore
          .collection("assignments")
          .where("email", "==", value)
          .get()
          .then((result) => {
            const data = [];
            result.forEach(function (doc) {
              data.push(doc.data());
            });
            setTAssignments(data);
          })
          .catch((error) => {});
        break;
      case "assignment":
        setAssignment(value);
        break;
      case "file":
        setFile(event.target.files[0]);
        break;
      default:
        return;
    }
  };

  const formatDate = () => {
    let date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onUpload = (event) => {
    setLoader(true);
    event.preventDefault();
    const fileName = Math.random().toString(36).substring(2, 15) + ".pdf";
    const fileRef = storage.child(fileName);
    fileRef.put(file).then((snapshot) => {
      if (snapshot.state === "success") {
        firestore
          .collection("uploads")
          .add({
            uid: allProps.user.uid,
            aid: assignment,
            reporting: report,
            email: allProps.user.email,
            originalfile: fileName,
            checkedfile: "",
            status: "Not Checked",
            date: formatDate(),
          })
          .then((result) => {
            setOpen(false);
            setLoader(false);
            getUploads();
          })
          .catch((error) => {});
      }
    });
  };

  return (
    <Container component="main" maxWidth="md">
      <Backdrop open={loader} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={onDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New Upload</DialogTitle>
        <DialogContent>
          <form onSubmit={onUpload}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  id="report"
                  name="report"
                  label="Report To"
                  select
                  autoComplete="false"
                  value={report}
                  onChange={onChangeHandler}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.email} value={teacher.email}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  id="assignment"
                  name="assignment"
                  label="Assignment"
                  select
                  autoComplete="false"
                  value={assignment}
                  onChange={onChangeHandler}
                >
                  {tassignments.map((tassignment) => (
                    <MenuItem key={tassignment.aid} value={tassignment.aid}>
                      {tassignment.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <input
                  accept=".pdf"
                  required
                  className={classes.input}
                  id="file"
                  type="file"
                  name="file"
                  onChange={onChangeHandler}
                />
                <label htmlFor="file">
                  <Button
                    type="button"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    component="span"
                  >
                    Select PDF
                  </Button>
                </label>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Upload
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className={classes.paper}>
        <Card>
          <CardHeader
            className={classes.header}
            action={
              <IconButton
                aria-label="add"
                className={classes.add}
                onClick={onNewUpload}
              >
                <AddIcon />
              </IconButton>
            }
            title="Uploads"
          />
          <Divider />
          <CardContent className={classes.content}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr No.</StyledTableCell>
                  <StyledTableCell>Reporting</StyledTableCell>
                  <StyledTableCell>Assignment</StyledTableCell>
                  <StyledTableCell>Upload Date</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.reporting}</StyledTableCell>
                    <StyledTableCell>{row.aid}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        className={classes.chip}
                        label={row.status}
                        icon={
                          row.status === "Not Checked" ? (
                            <CloseIcon />
                          ) : (
                            <DoneIcon />
                          )
                        }
                        color={
                          row.status === "Not Checked" ? "secondary" : "primary"
                        }
                      />
                    </StyledTableCell>
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

export default Student;
