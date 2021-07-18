const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/resumes')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

const fileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(pdf|docx|doc)$/))
    {
        return callback(new Error('Only supported formats are pdf, docx, and doc'));
    }
    callback(null, true);
};

const upload = multer({storage: storage, fileFilter:fileFilter});

const fileUpload = express.Router();

fileUpload.route('/')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /fileUpload');
})
.post(upload.array('filefield', 1000), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.files);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /fileUpload');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /fileUpload');
});

module.exports = fileUpload;