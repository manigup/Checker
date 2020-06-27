import React, { useState, useEffect } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  colors,
  Chip,
} from "@material-ui/core";
import { firestore } from "../firebase";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

const StyledTableCell = withStyles((theme) => ({
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
  header: {
    backgroundColor: colors.cyan[600],
    color: colors.lime[50],
    padding: 10,
  },
  chip: {
    height: 25,
  },
}));

const UploadsList = (props) => {
  const match = useRouteMatch();
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    firestore
      .collection("uploads")
      .where("aid", "==", match.params.aid)
      .get()
      .then((result) => {
        const data = [];
        result.forEach(function (doc) {
          data.push(doc.data());
        });
        setRows(data);
      })
      .catch((error) => {});
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <Card>
          <CardHeader className={classes.header} title="Uploads" />
          <Divider />
          <CardContent className={classes.content}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr No.</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  <StyledTableCell>Upload Date</StyledTableCell>
                  <StyledTableCell>Uploaded File</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                    <StyledTableCell>
                      <Link to={`/pdf/${row.originalfile}`}>
                        {row.originalfile}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={row.status}
                        className={classes.chip}
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

export default UploadsList;
