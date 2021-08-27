const express = require("express");
const router = express.Router();
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage });

const Archive = require("../../models/Archive");

router.get("/", (req, res) => {
    Archive.find()
        .then(archive => {
            res.send(archive);
        })
        .catch(err => console.log(err));
});

router.get('/download/:name', (req, res) => {
    const file = `uploads/${req.params.name}`;
    res.download(file);
});

router.post("/", upload.single('fileInput'), (req, res) => {
    const newArchive = new Archive({
        name: req.file.originalname,
        author: req.body.userName
    });

    newArchive
        .save()
        .then(archive => {
            res.json({
                success: true,
                archive: JSON.stringify(archive)
            });
        })
        .catch(err => console.log(err));
});

router.delete("/delete/:id", (req, res) => {
    Archive.remove({_id: req.params.id})
        .then(archive => res.send(archive))
        .catch(err => console.log(err));
});

module.exports = router;