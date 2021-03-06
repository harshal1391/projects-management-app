const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");
const resPattern = require("../helpers/resPattern");
const multer = require("multer");
const { localUpload } = require("../helpers/commonfile");
const upload = multer(localUpload).single("file");

const singleUpload = async (req, res, next) => {
  upload(req, res, async function (error) {
    if (error) {
      //instanceof multer.MulterError
      if (error.code == "LIMIT_FILE_SIZE") {
        return next(
          new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
        );
      }
      return next(
        new APIError(error.message, httpStatus.INTERNAL_SERVER_ERROR, true)
      );
    } else {
      try {
        // get image and verify image upload
        const file = req.file;
        console.log(file);
        if (!file) {
          const message = `File not found.`;
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({ error: { message } });
        }

        // send response
        const resData = {
          //file: file.location,
          fileName: file.originalname,
          file: file.path,
        };
        let obj = resPattern.successPattern(httpStatus.OK, resData, "success");
        return res.status(obj.code).json(obj);
      } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
      }
    }
  });
};

const multipleUpload = async (req, res, next) => {
  try {
    // get files and verify files upload
    const files = req.files;
    if (!files || files.length === 0) {
      return next(new APIError("File not found", httpStatus.NOT_FOUND, true));
    }

    // filter files data
    let filesData = [];
    files.forEach((file) => {
      const extname = path.extname(file.originalname);
      filesData.push({
        url: file.location,
        type: extname,
      });
    });

    // send response
    let obj = resPattern.successPattern(httpStatus.OK, filesData, "success");
    return res.status(obj.code).json(obj);
  } catch (e) {
    return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
};

module.exports = {
  singleUpload,
  multipleUpload,
};