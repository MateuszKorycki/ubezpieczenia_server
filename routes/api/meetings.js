const express = require("express");
const router = express.Router();

const Meeting = require("../../models/Meeting");

// @route GET api/meetings
// @desc Get meetings list
// @access Public
router.get("/", (req, res) => {
    Meeting.find().then(meetings => {
        res.send(meetings);
    })
});

// @route GET api/training-days
// @desc Get training days list
// @access Public
router.get("/:userId", (req, res) => {
    Meeting.find({ authorId: req.params.userId }).then(meetings => {
        res.send(meetings);
    })
});

// @route GET api/training-days/details/:id
// @desc Get training day details
// @access Public
router.get("/details/:id", (req, res) => {
    Meeting.findOne({_id: req.params.id}).then(Meeting => {
        res.send(Meeting);
    })
});

// @route GET api/trainings/last
// @desc Get last training details
// @access Public
router.get("/last/:userId", (req, res) => {
    Meeting.find({authorId: req.params.userId}).sort({date: -1}).then(Meeting => {
        res.send(Meeting[0]);
    })
});

// @route POST api/training-days/add
// @desc Add training day
// @access Public
router.post("/add", (req, res) => {
    const newMeeting = new Meeting({
        authorId: req.body.authorId,
        eventTitle: req.body.eventTitle,
        eventDescription: req.body.eventDescription,
        status: req.body.status,
        date: req.body.date
    });

    newMeeting
        .save()
        .then(meeting => {
            res.json({
                success: true,
                meeting: meeting
            });
        })
        .catch(err => console.log(err));
});

// @route POST api/meetings/delete/:id
// @desc Delete meeting
// @access Public
router.delete("/delete/:id", (req, res) => {
    Meeting.remove({_id: req.params.id})
        .then(meeting => res.send(meeting))
        .catch(err => console.log(err));
});

router.put("/edit/:id", (req, res) => {
    Meeting.updateOne({_id: req.params.id},
        {$set: {eventTitle: req.body.title, eventDescription: req.body.description, date: req.body.date}})
        .then(exercise => res.send(exercise))
        .catch(err => console.log(err));
});

router.put("/cancel/:id", (req, res) => {
    Meeting.updateOne({_id: req.params.id},
        {$set: {status: "canceled",}})
        .then(exercise => res.send(exercise))
        .catch(err => console.log(err));
});

module.exports = router;