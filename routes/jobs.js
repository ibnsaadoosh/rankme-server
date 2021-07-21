const express = require('express');
const multer = require('multer');
const { populate, findByIdAndRemove } = require('../models/job');
const Jobs = require('../models/job');
const fsExtra = require('fs-extra');
const dirPath = 'public/resumes';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, dirPath)
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname + '-' + new Date().toUTCString())
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

// req.body.resumes = req.files;
fileUpload.route('/')
.get((req, res, next) => {
    Jobs.find({})
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(upload.array('filefield', 10000), (req, res, next) => {
    Jobs.create(req.body)
    .then((job) => {
        req.files.map((file) => {
            job.resumes = job.resumes.concat({filename: file.filesname, path: file.path, percentage: Math.random(), jobId: job._id});
        });
        job.save()
        .then((job) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(job);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /jobs');
})
.delete((req, res, next) => {
    fsExtra.emptyDir(dirPath)
    .then()
    .catch(err => next(err));

    Jobs.deleteMany({})
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({sucess: true})
    }, (err) => next(err))
    .catch((err) => next(err));
});

fileUpload.route('/:jobID')
.get((req, res, next) => {
    Jobs.findById(req.params.jobID)
    .then((job) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported no /jobs/'+ req.params.jobID);
})

.put((req, res, next) => {
    Jobs.findByIdAndUpdate(req.params.jobID,
                           {$set: req.body},
                           {new: true})
    .then((job) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json'),
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete((req, res, next) => {
    Jobs.findByIdAndRemove(req.params.jobID)
    .then((job) => {
        job.resumes.map((resume) => {
            fsExtra.removeSync(resume.path);
        });
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(job);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = fileUpload;