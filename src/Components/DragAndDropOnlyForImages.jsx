import React, { useEffect } from "react";

const DragAndDropOnlyForImages = props => {
  const [otherFilesCounter, setotherFilesCounter] = React.useState(0);
  const [otherFilesList, setotherFilesList] = React.useState([]);
  const resetFiles = [];
  let dropDivRef = React.createRef();

  const handleImagesDrag = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleImagesDrop = async event => {
    event.preventDefault();
    event.stopPropagation();

    let Images = [];
    let DroppedFiles = event.dataTransfer.files;

    if (event.dataTransfer.files && DroppedFiles.length > 0) {
      for (let file = 0; file < DroppedFiles.length; file++) {
        if (
          DroppedFiles[file].type == "image/png" ||
          DroppedFiles[file].type == "image/jpeg"
        ) {
          Images.push(DroppedFiles[file]);
        } else {
          setotherFilesCounter(otherFilesCounter + 1);
          setotherFilesList(otherFilesList.push([DroppedFiles[file]]));
        }
      }
      props.handleImages(
        Images,
        otherFilesCounter,
        otherFilesList,
        DroppedFiles
      );
      setotherFilesCounter(0);
      setotherFilesList(resetFiles);
      event.dataTransfer.clearData();
    }
  };

  useEffect(() => {
    dropDivRef.current.addEventListener("dragover", handleImagesDrag);
    dropDivRef.current.addEventListener("drop", handleImagesDrop);
  }, []);

  return <div ref={dropDivRef}>{props.children}</div>;
};
export default DragAndDropOnlyForImages;
