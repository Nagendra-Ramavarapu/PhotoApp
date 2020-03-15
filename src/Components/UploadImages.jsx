import React, { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../Logo/cloud.png";
import PhotoAppSnackbar from "../Components/AppSpecificComponents/PhotoAppSnackbar";
import DragAndDropOnlyForImages from "./DragAndDropOnlyForImages";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from "axios";
import { storage } from "../Firebase-config";

const styles = makeStyles(theme => ({
  uploadDivDesktop: {
    borderStyle: "solid",
    // borderWidth: "thin",
    width: "30vw",
    minHeight: "65vh",
    maxHeight: "65vh",
    marginLeft: 380,
    marginTop: 100,
    borderWidth: 1.1,
    borderRadius: 5
  },
  onSuccessUploadDivDesktop: {
    borderStyle: "solid",
    borderColor: "green",
    borderRadius: 5,
    borderWidth: "thin",
    width: "30vw",
    minHeight: "65vh",
    maxHeight: "65vh",
    marginLeft: 380,
    marginTop: 100,
    borderWidth: 1.1,
    borderRadius: 5
  },
  onWarningUploadDivDesktop: {
    borderStyle: "solid",
    borderColor: "yellow",
    borderRadius: 5,
    borderWidth: "thin",
    width: "30vw",
    minHeight: "65vh",
    maxHeight: "65vh",
    marginLeft: 380,
    marginTop: 100,
    borderWidth: 1.1,
    borderRadius: 5
  },
  onErrorUploadDivDesktop: {
    borderStyle: "solid",
    borderColor: "red",
    borderRadius: 5,
    borderWidth: "thin",
    width: "30vw",
    minHeight: "65vh",
    maxHeight: "65vh",
    marginLeft: 380,
    marginTop: 100,
    borderWidth: 1.1,
    borderRadius: 5
  },
  uploadDivMobile: {
    borderStyle: "solid",
    borderRadius: 5,
    borderWidth: "thin",
    width: "66vw",
    minHeight: "48vh",
    maxHeight: "43vh",
    marginLeft: 63,
    marginTop: 75,
    borderWidth: 0.1
  },
  textStyle: {
    fontStyle: "italic",
    fontWeight: 500
  },
  cloudStyleDesktop: {
    widht: "10vw",
    height: "14vh"
  },
  cloudStyleMobile: {
    widht: "5vw",
    height: "10vh"
  },
  inputTypeMobile: {
    marginLeft: 20
  },
  confirmationText: {
    visibility: "hidden"
  },
  buttonDiv: { marginLeft: 20 },
  button: {
    marginRight: 15,
    padding: 8,
    background: "#7ab2c785",
    borderRadius: 5,
    color: "black",
    fontSize: 11,
    fontWeight: "bold",
    borderStyle: "double"
  },
  inputTypeDesktop: {
    color: "black",
    padding: 8,
    fontSize: 11,
    background: "#7ab2c785",
    fontWeight: "bold",
    borderStyle: "solid",
    borderRadius: 5,
    borderWidth: "thin"
  },
  uploadIcon: {
    color: "#e4297785"
  }
}));
const UploadImages = () => {
  const classes = styles();
  let history = useHistory();
  let shorterEdges = [240, 720];
  let imageRenditions = [];
  let photos = [];
  let completeImagesData = { Data: [] };
  const [Images, setImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [ActionType, setActionType] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadingImage, setUploadingImage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);

  const isMobile = useMediaQuery("(min-width: 320px) and (max-width: 600px)");

  const snackbarHadlerToUpdateParent = type => {
    setOpenSnackbar(type);
  };

  const handleImages = event => {
    let FilesUploaded = event.target.files;
    let FilteredImages = [];
    let OtherFiles = [];

    for (let file = 0; file < FilesUploaded.length; file++) {
      FilesUploaded[file].type &&
      (FilesUploaded[file].type == "image/png" ||
        FilesUploaded[file].type == "image/jpeg")
        ? FilteredImages.push(FilesUploaded[file])
        : OtherFiles.push(FilesUploaded[file]);
    }

    if (FilteredImages.length == 0 && OtherFiles.length == 0) {
      setSnackbarMessage("No Images selected");
      setAlertType("error");
      setActionType("error");
      setOpenSnackbar(true);
    } else if (OtherFiles.length > 0 && FilteredImages.length > 0) {
      setSnackbarMessage("Discarding Other Files:" + OtherFiles.length);
      setAlertType("warning");
      setActionType("warning");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Total Images Selected:" + FilteredImages.length);
      setAlertType("success");
      setActionType("success");
      setOpenSnackbar(true);
    }
    FilteredImages.map(Filimage => {
      shorterEdges.map(shorterEdge => {
        getImageRenditions(Filimage, shorterEdge);
      });
    });

    setImages(FilteredImages);
  };
  const getImages = (images, otherFilesCounter, otherFilesList, AllFiles) => {
    if (otherFilesList.length > 0) {
      setSnackbarMessage("Ignoring Files:" + otherFilesList.length);
      setAlertType("warning");
      setActionType("success");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Total Images Selected:" + images.length);
      setAlertType("success");
      setActionType("success");
      setOpenSnackbar(true);
    }
    setImages(images);
    //setpreviewImage(URL.createObjectURL(images[0]));
  };
  const getImageRenditions = (ImageFile, shorterEdge) => {
    let requiredImageFormat;
    let reader = new FileReader();
    reader.onload = readerEvent => {
      let image = new Image();
      image.onload = imageEvent => {
        // Resizing  the image according to the requirements
        let canvas = document.createElement("canvas"),
          width = image.width,
          height = image.height;
        canvas
          .getContext("2d")
          .drawImage(image, 0, 0, shorterEdge, shorterEdge);
        let dataUrl = canvas.toDataURL("image/jpeg" || "image/png");
        let resizedImage = dataURLToBlob(dataUrl);
        // setpreviewImage(URL.createObjectURL(resizedImage));
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(ImageFile);
    reader.onloadend = () => {
      let convertedbase64Imagedata = reader.result;
      requiredImageFormat = convertedbase64Imagedata.toString();
      imageRenditions.push(requiredImageFormat);
    };
  };

  let dataURLToBlob = dataURL => {
    let BASE64_MARKER = ";base64,";
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      let parts = dataURL.split(",");
      let contentType = parts[0].split(":")[1];
      let raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    let parts = dataURL.split(BASE64_MARKER);
    let contentType = parts[0].split(":")[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const handleUploadSuccess = res => {
    imageRenditions = [];
    setUploadProgress(false);
    setSnackbarMessage("Upload successful");
    setAlertType("success");
    setActionType("success");
    setOpenSnackbar(true);
  };

  const handleUploadFailure = res => {
    console.log(res);
    setSnackbarMessage(res.status + ":" + res.statusName + "Error");
    setAlertType("error");
    setActionType("error");
    setOpenSnackbar(true);
  };
  const UploadImages = () => {
    //********* Using Firebase as Third party to store Images **********//
    if (Images && Images.length != 0) {
      setUploadProgress(true);

      for (let image = 0; image < Images.length; image++) {
        // ** Scaling out ShorterEdges for selected Images **//
        // Converting the Selected Files into Blobs & then to URL'S
        // shorterEdges.map(shorterEdge => {
        //   getImageRenditions(Images[image], shorterEdge);
        // });

        let currentImageName =
          "firebase-PhotoAppimage-" + image + Images[image].name + Date.now();

        let uploadImage = storage
          .ref(`images/${currentImageName}`)
          .put(Images[image]);

        uploadImage.on(
          "state_changed",
          async snapshot => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadPercentage(progress);
            setUploadingImage(Images[image].name);

            if (snapshot.state == "paused") {
              setSnackbarMessage("Upload Paused");
              setAlertType("info");
              setActionType("info");
              setOpenSnackbar(true);
            }
          },
          error => {
            alert(error);
          },
          async () => {
            await storage
              .ref("images")
              .child(currentImageName)
              .getDownloadURL()
              .then(url => {
                // storing Required image information into MongoDB Atlas
                let imageObj = {
                  ImageData: url,
                  ImageName: Images[image].name,
                  ImageRenditions: [...imageRenditions]
                };
                axios
                  .post("http://localhost:5005/Photos/Upload", imageObj)
                  .then(res =>
                    res.status == "200"
                      ? handleUploadSuccess(res)
                      : handleUploadFailure(res)
                  )
                  .catch(err => handleUploadFailure(err));
              });
          }
        );
      }
    } else {
      setSnackbarMessage("No Images selected to upload");
      setAlertType("error");
      setActionType("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <DragAndDropOnlyForImages handleImages={getImages}>
      <div
        align="center"
        className={
          isMobile
            ? classes.uploadDivMobile
            : ActionType && ActionType == "success"
            ? classes.onSuccessUploadDivDesktop
            : ActionType && ActionType == "warning"
            ? classes.onWarningUploadDivDesktop
            : ActionType && ActionType == "error"
            ? classes.onErrorUploadDivDesktop
            : classes.uploadDivDesktop
        }
      >
        <p className={classes.textStyle}> Drag Images here</p>
        <img
          src={Logo}
          className={
            isMobile ? classes.cloudStyleMobile : classes.cloudStyleDesktop
          }
        />
        <p className={classes.textStyle}>or</p>
        <input
          type="file"
          multiple
          className={
            isMobile ? classes.inputTypeMobile : classes.inputTypeDesktop
          }
          accept="image/x-png,image/jpeg"
          onChange={event => handleImages(event)}
        ></input>
        <p className={Images.length == 0 && classes.confirmationText}>
          {Images.length} Images Selected
        </p>
        <div className={classes.buttonDiv}>
          <button
            className={classes.button}
            onClick={() => history.push("/View")}
          >
            Return to View
          </button>
          <button className={classes.button} onClick={UploadImages}>
            Upload Images
          </button>
        </div>
        {uploadProgress && (
          <div>
            <span>
              <IconButton className={classes.uploadIcon}>
                <CloudUploadIcon />
              </IconButton>
              <span>{Math.round(uploadPercentage)}%</span>
              <br />
              <span>{uploadingImage}</span>
            </span>
          </div>
        )}
      </div>
      {openSnackbar && (
        <PhotoAppSnackbar
          Message={snackbarMessage}
          AlertType={alertType}
          verticalPosition="top"
          horizontalPosition="right"
          autoHideDuration={3000}
          snackbarHadlerToUpdateParent={snackbarHadlerToUpdateParent}
        />
      )}
    </DragAndDropOnlyForImages>
  );
};

export default UploadImages;
