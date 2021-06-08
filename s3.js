const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        // there is notfile to upload sth went wrong with multer!
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling", // if you are using spiced credentials
            // this should be spicedling
            ACL: "public-read", // access-control-list
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("yeah your image is in the cloud!!");
            fs.unlink(path, () => {}); // this removes our file from the temp
            // storage in public on our server
            next();
        })
        .catch((err) => {
            // uh oh
            console.log(
                "oh ohhhh sth went wrong in the upload to the clouds",
                err
            );
        });
};
