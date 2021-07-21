var mongoose = require('mongoose');

var resumeSchema = new mongoose.Schema({
    filename:
    {
        type: String,
        required: true,
        default: "cv"
    },
    path:
    {
        type: String,
        required: true,
        default: "public/resumes"
    },
    percentage:
    {
        type: Number,
        required: true,
        default: 0
    },
    jobId:
    {
        type: String,
        required: true
    }
});

var jobSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true,
        default: "job title"
    },
    description:
    {
        type: String,
        required: true,
        default: "job description"
    },
    resumes: [resumeSchema]
});

var Jobs = mongoose.model('Job', jobSchema);

module.exports = Jobs;