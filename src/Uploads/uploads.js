import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
}));

const UploadsList = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    firestore
      .collection("uploads")
      .where("aid", "==", props.route.match.params.aid)
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

  const onTableRowClick = (file) => {
    history.push("/pdf/" + file);
  };

  return (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <Card>
          <CardHeader title="Uploads" />
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
                  <TableRow
                    key={index}
                    onClick={() => onTableRowClick(row.originalfile)}
                  >
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>{row.date}</StyledTableCell>
                    <StyledTableCell>{row.originalfile}</StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={row.status}
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
