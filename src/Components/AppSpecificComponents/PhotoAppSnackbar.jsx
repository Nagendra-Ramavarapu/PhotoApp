import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const CustomAlert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};
const PhotoAppSnackbar = props => {
  const [openSnackbar, setopenSnackbar] = React.useState(true);

  const handleCloseSnackbar = () => {
    setopenSnackbar(false);
    props.snackbarHadlerToUpdateParent(false);
  };
  return (
    <Snackbar
      open={openSnackbar}
      autoHideDuration={props.autoHideDuration}
      anchorOrigin={{
        vertical: props.verticalPosition,
        horizontal: props.horizontalPosition
      }}
      onClose={handleCloseSnackbar}
    >
      <CustomAlert onClose={handleCloseSnackbar} severity={props.AlertType}>
        {props.Message}
      </CustomAlert>
    </Snackbar>
  );
};

export default PhotoAppSnackbar;
