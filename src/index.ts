import express from "express";
import multer from "multer";
import path from "path";
import { uploadFunc } from "./controllers/uploadFunc";

const app = express();

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const fileMime = file.mimetype;

        if (fileExtension === '.csv' && fileMime === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed!'));
        }
    },
});

app.get('/', (req, res) => {
    res.send("Working")
})

app.post('/upload', upload.single("csvFile"), uploadFunc);

app.listen(3000, () => {
    console.log("Server running in port 3000");
})