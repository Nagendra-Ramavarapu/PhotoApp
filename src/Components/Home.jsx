import React, { useState } from "react";
import View from "./View";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const styles = makeStyles(theme => ({
  Error: {
    color: "red",
    display: "block",
    marginLeft: 25
  },
  Normal: {
    visibility: "hidden"
  }
}));

const Home = () => {
  const classes = styles();
  const [openDialog, setOpenDialog] = useState(true);
  const [Password, setPassword] = useState("");
  const [ErrorMessage, setErrorMessage] = useState(false);

  const checkPassword = () => {
    Password == "PhotoApp@1" ? setOpenDialog(false) : setErrorMessage(true);
  };
  return (
    <div>
      <Dialog disableEscapeKeyDown disableBackdropClick open={openDialog}>
        <DialogTitle>Welcome to PhotoApp </DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            value={Password}
            placeholder="Enter Password"
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <span className={ErrorMessage ? classes.Error : classes.Normal}>
          <i>Invalid Password</i>
        </span>
        <DialogActions>
          <Button onClick={checkPassword}>Submit</Button>
        </DialogActions>
      </Dialog>
      <View />
    </div>
  );
};
export default Home;
