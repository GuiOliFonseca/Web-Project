require('dotenv').config();

const crypto = require('crypto');
const path = require('path');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  const s3 = new aws.S3({
    endpoint: process.env.S3_ENDPOINT,
    s3ForcePathStyle: true,
    sslEnabled: true,
  });

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, callback) => {
            const ext = file.mimetype.split('/');

            const date = new Date();

            file.key = crypto.createHash('sha256').update(file.originalname + date).digest('hex');
            file.key += `.${ext[1]}`;

            callback(null, file.key);
        }
    }),
    s3: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (req, file, callback) => {
          crypto.randomBytes(32, (error, hash) => {
            if (error) {
              callback(error);
            }
    
            const ext = file.mimetype.split("/");
    
            const date = new Date();
    
            file.key = crypto
              .createHash("sha256")
              .update(file.originalname + date)
              .digest("hex");
            file.key += `.${ext[1]}`;
    
            callback(null, file.key);
          });
        },
      }),
};

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        files: 15
    },
    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/png',
            'image/jpg',
            'image/jpeg',
            'image/pjpeg'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Tipo inválido de arquivo!'));
        }
    }
};