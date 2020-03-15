const router = require("express").Router();
let Photo = require("./PhotosModel");
let multer = require("multer");

const uploadDirectory = "./Uploads/";

router.route("/TotalPhotos").get((req, res) => {
  Photo.find()
    .estimatedDocumentCount()
    .then(data => {
      res.status(200).json({
        message: "Total Photos Recieved !!!",
        TotalPhotos: data
      });
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          Error: err
        });
    });
});

router.route("/View").get((req, res) => {
  console.log(req.query);
  Photo.find()
    .sort({ createdAt: -1 })
    .skip(parseInt(req.query.SkipValue))
    .limit(30)
    .then(data => {
      res.status(200).json({
        message: "Photo List retrieved !!!",
        photos: data
      });
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          Error: err
        });
    });
});

// Firebase is used as third party for storing Images
// Image Url will be stored in MongoDB

router.route("/Upload").post((req, res) => {
  console.log(req.body);
  const newPhoto = new Photo({
    ImageData: req.body.ImageData,
    ImageName: req.body.ImageName,
    ImageRenditions: req.body.ImageRenditions
  });
  newPhoto
    .save()
    .then(result => {
      res.status(200).json({
        message: "Photos Added successfully!",
        document: result
      });
    })
    .catch(err => {
      console.log(err),
        res.status(500).json({
          Error: err
        });
    });
});

// Multer: Express-middleware  'helper' to upload images into Local server
// store Reference to the MongoDB
// But not Best practise to use, It may increase the Server Load
// Replacing upload.singe >> upload.array('Images','ImagesLimit') will upload multiple Images

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

let upload = multer({
  storage: storage,
  limits: {
    // fileSize: 1024 * 1024 * 5     :: if required
  }
});

router
  .route("/UploadUsingMulter")
  .post(upload.single("ImageData"), (req, res) => {
    const newPhoto = new Photo({
      ImageData: req.file.path,
      Imagename: req.file.filename
    });
    newPhoto
      .save()
      .then(result => {
        res.status(200).json({
          message: "Photo Added successfully!",
          document: result
        });
      })
      .catch(err => {
        console.log(err),
          res.status(500).json({
            error: err
          });
      });
  });

module.exports = router;
