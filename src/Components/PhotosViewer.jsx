import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import DialogActions from "@material-ui/core/DialogActions";
import FavLeftIcon from "../Icons/FavLeftIcon";
import FavRightIcon from "../Icons/FavRightIcon";
import PhotoAppSnackbar from "./AppSpecificComponents/PhotoAppSnackbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const styles = makeStyles(theme => ({
  photoViewer: {
    maxHeight: 900
  },
  fullscreenPhoto: {
    minWidth: 300,
    maxWidth: 1280,
    minHeight: 240,
    maxHeight: 720
  },
  fullscreenActions: {
    height: 32
  },
  fullscreenPhotoMobile: {
    maxWidth: "85vw",
    minWidth: "50vw",
    maxHeight: "95vh",
    minHeight: "35vh"
  },
  navButtonsMobile: {
    padding: 5,
    marginLeft: 2
  }
}));

const PhotosViewer = props => {
  const classes = styles();
  const isMobile = useMediaQuery("(min-width: 320px) and (max-width: 600px)");
  const [openImageViewer, setopenImageViewer] = React.useState(true);
  const [currentImage, setCurrentImage] = React.useState(props.CurrentImage);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(
    props.CurrentImageIndex
  );
  const [photos, setPhotos] = useState(props.CompleteImageList);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleRightNav = () => {
    if (currentImageIndex < photos.length - 1) {
      setCurrentImage(photos[currentImageIndex + 1]);
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setSnackbarMessage("Reached Last Photo");
      setOpenSnackbar(true);
    }
  };

  const handleLeftNav = () => {
    if (currentImageIndex != 0) {
      setCurrentImage(photos[currentImageIndex - 1]);
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setSnackbarMessage("Reached First Photo");
      setOpenSnackbar(true);
    }
  };

  const handleclosePhotosViewer = () => {
    setopenImageViewer(false);
    props.handlerToUpdateView(false);
  };
  const snackbarHadlerToUpdateParent = type => {
    setOpenSnackbar(type);
  };
  return (
    <Dialog
      onClose={handleclosePhotosViewer}
      open={openImageViewer}
      className={classes.photoViewer}
      fullWidth={"md"}
      maxWidth={"md"}
    >
      <img
        className={
          isMobile ? classes.fullscreenPhotoMobile : classes.fullscreenPhoto
        }
        src={currentImage && currentImage.ImageData}
      ></img>
      <DialogActions className={classes.fullscreenActions}>
        <span>
          <b>Name:</b>
          {currentImage.ImageName}
        </span>
        <span>
          <b>Date:</b>
          {currentImage.createdAt.slice(0, 10)}
        </span>
        <IconButton
          className={isMobile && classes.navButtonsMobile}
          onClick={() => handleLeftNav()}
        >
          <FavLeftIcon />
        </IconButton>
        <IconButton
          className={isMobile && classes.navButtonsMobile}
          onClick={() => handleRightNav()}
        >
          <FavRightIcon />
        </IconButton>
      </DialogActions>
      {openSnackbar && (
        <PhotoAppSnackbar
          Message={snackbarMessage}
          AlertType="warning"
          verticalPosition="top"
          horizontalPosition="right"
          autoHideDuration={5000}
          snackbarHadlerToUpdateParent={snackbarHadlerToUpdateParent}
        />
      )}
    </Dialog>
  );
};

export default withStyles(styles)(PhotosViewer);
