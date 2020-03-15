import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import PhotoViewer from "./PhotosViewer";
import useInfiniteImagesScroll from "./AppSpecificHooks/useInfiniteImagesScroll";
import PhotoAppSnackbar from "../Components/AppSpecificComponents/PhotoAppSnackbar";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Fab from "@material-ui/core/Fab";
import GroupingHandlers from "./ProcessData";
import Link from "@material-ui/core/Link";

const styles = makeStyles(theme => ({
  imagetitle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 240
  },
  viewDiv: {
    marginLeft: 150,
    marginRight: 150,
    width: 915
  },
  viewDivMobile: {
    background: "#3630381c"
  },
  viewHeader: {
    marginLeft: 170,
    marignRight: 170,
    marginTop: 30,
    display: "flex"
  },
  viewHeaderMobile: {
    marginLeft: 25,
    marginTop: 5,
    display: "flex"
  },
  viewAvatar: {
    width: 90,
    height: 90,
    color: "#020110",
    background: "#4ead1e87"
  },
  viewAvatarMobile: {
    width: 65,
    height: 65,
    color: "#020110",
    background: "#4ead1e87",
    marginTop: 7
  },
  publisherDiv: {
    marginLeft: 50
  },
  publisherDivMobile: {
    marginLeft: 10,
    marginTop: 7
  },
  photoAppMobile: {
    fontSize: 25
  },
  photoApp: {
    fontSize: 32
  },
  publisherName: { fontSize: 15 },
  publisherNameMobile: { fontSize: 14 },
  PhotosCount: {
    fontSize: 16,
    marginRight: 20
  },
  PhotosCountMobile: {
    fontSize: 14
  },
  UploadButton: { fontSize: 15, float: "right" },
  uploadIcon: {
    height: 20,
    width: 20
  },
  photosDiv: { marginTop: 60 },
  photosDivMobile: { marginTop: 40, marginLeft: 8, marginRight: 4 },
  GroupDate: {
    fontSize: 15
  },
  GroupDate: {
    fontSize: 15,
    marginRight: 15
  },
  GroupPhotos: {
    marginLeft: 40,
    marginRight: 10
  },
  GroupPhotosDiv: {
    marginTop: 8
  },
  photo: {
    width: 300,
    height: 300,
    margin: 2
  },
  photoMobile: {
    width: "90vw",
    height: "50vh",
    margin: 2
  },
  fab: {
    position: "fixed",
    width: "11vw",
    height: "7vh",
    right: "16px"
  },
  fabIcon: {
    width: "40",
    height: "25"
  }
}));

const View = () => {
  const classes = styles();
  const isMobile = useMediaQuery("(min-width: 320px) and (max-width: 600px)");
  let history = useHistory();
  const [skip, setSkip] = useState(0);
  const [TotalPhotos, setTotalPhotos] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [currentImages, setCurrentImages] = useState();
  const [openPhotoViewer, setopenPhotoViewer] = useState(false);
  const [currentImage, setCurrentImage] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [groupedData, setGroupedData] = useState([]);

  const handleInfiniteImageData = data => {
    setGroupedData([
      ...GroupingHandlers.GroupInfiniteImagesScrollData(data, groupedData)
    ]);
    setCurrentImages(prev => [...prev, ...data]);
    setSkip(prev => prev + 30);
    setIsLoading(true);
  };
  const handleImagesChange = () => {
    let params = {
      SkipValue: skip,
      Phase: "Scroll"
    };
    setTimeout(() => {
      // ** Skip: This is used in MongoDB Query for getting next set of Images **//
      axios
        .get("http://localhost:5005/Photos/View", { params })
        .then(res =>
          res.status == "200"
            ? handleInfiniteImageData(res.data.photos)
            : handleAPIError(res)
        )
        .catch(err => handleAPIError(err));
    }, 5000);
  };
  const [isLoading, setIsLoading] = useInfiniteImagesScroll(handleImagesChange);

  const handleAPIError = err => {
    console.log(err);
    setSnackbarMessage("Error Occured:", err);
    setAlertType("error");
    setOpenSnackbar(true);
  };
  const handleAPISuccess = data => {
    setGroupedData(GroupingHandlers.GroupInitialAPIData(data));
    setCurrentImages(data);
    setSkip(prev => prev + 30);
  };
  const getPhotosfromAPI = () => {
    let params = {
      SkipValue: 0
    };
    axios
      .get("http://localhost:5005/Photos/View/", { params })
      .then(res =>
        res.status == "200"
          ? handleAPISuccess(res.data.photos)
          : handleAPIError(res)
      )
      .catch(err => handleAPIError(err));
  };
  useEffect(() => {
    axios
      .get("http://localhost:5005/Photos/TotalPhotos")
      .then(res =>
        res.status == "200"
          ? setTotalPhotos(res.data.TotalPhotos)
          : console.log(res)
      )
      .catch(err => console.log(err));
    window.scrollTo(0, 0);
    getPhotosfromAPI();
  }, []);

  const handleImageViewer = (e, image, imageIndex) => {
    setCurrentImage(image);
    setCurrentImageIndex(imageIndex);
    setopenPhotoViewer(true);
  };
  const handlerToUpdateView = type => {
    setopenPhotoViewer(type);
  };
  const snackbarHadlerToUpdateParent = type => {
    setOpenSnackbar(type);
  };
  const handleExhaustMessage = () => {
    setSnackbarMessage("Images Exhausted !!! ");
    setAlertType("info");
    setOpenSnackbar(true);
  };
  return (
    <div className={isMobile ? classes.viewDivMobile : classes.viewDiv}>
      <div className={isMobile ? classes.viewHeaderMobile : classes.viewHeader}>
        <Avatar
          src={photos && photos[photos.length]}
          className={isMobile ? classes.viewAvatarMobile : classes.viewAvatar}
        ></Avatar>

        <div
          className={
            isMobile ? classes.publisherDivMobile : classes.publisherDiv
          }
        >
          <span
            className={isMobile ? classes.photoAppMobile : classes.photoApp}
          >
            PhotoApp
          </span>
          <br />
          <span
            className={
              isMobile ? classes.publisherNameMobile : classes.publisherName
            }
          >
            Publisher: @Nagendra
          </span>
          <br />
          <span
            className={
              isMobile ? classes.PhotosCountMobile : classes.PhotosCount
            }
          >
            {TotalPhotos && TotalPhotos} photos
          </span>
          {isMobile ? (
            <Fab className={classes.fab}>
              <AddAPhotoIcon
                onClick={() => history.push("/UploadImages")}
                className={classes.fabIcon}
              />
            </Fab>
          ) : (
            !isMobile && (
              <span className={classes.UploadButton}>
                <IconButton
                  size="small"
                  style={{ padding: 1 }}
                  onClick={() => history.push("/UploadImages")}
                >
                  <AddAPhotoIcon className={classes.uploadIcon} />
                </IconButton>
              </span>
            )
          )}
          <br />
        </div>
      </div>
      {groupedData &&
        groupedData.map((group, groupIndex) => (
          <div
            className={isMobile ? classes.photosDivMobile : classes.photosDiv}
          >
            <div>
              <span className={classes.GroupDate}>
                <b>Uploaded Date:</b> {group.Date}
              </span>
              <span
                className={
                  isMobile ? classes.GroupPhotosDiv : classes.GroupPhotos
                }
              >
                <b>Total Photos:</b> {group.Data.length}
              </span>
            </div>
            <div className={isLoading ? null : classes.GroupPhotosDiv}>
              {group.Data &&
                group.Data.map((photo, imageIndex) => (
                  <img
                    className={isMobile ? classes.photoMobile : classes.photo}
                    src={photo.ImageData}
                    onClick={e => handleImageViewer(e, photo, imageIndex)}
                  ></img>
                ))}
            </div>
          </div>
        ))}
      {openPhotoViewer && (
        <PhotoViewer
          CompleteImageList={currentImages}
          CurrentImage={currentImage}
          CurrentImageIndex={currentImageIndex}
          handlerToUpdateView={handlerToUpdateView}
        />
      )}
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
      {isLoading && (
        <Link>
          {groupedData.length == TotalPhotos.length ? (
            <span>Fetching Images...</span>
          ) : (
            <span>You are Exhausted !! {handleExhaustMessage}</span>
          )}
        </Link>
      )}
    </div>
  );
};

export default View;
