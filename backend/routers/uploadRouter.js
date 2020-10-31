import multer from 'multer';
import express from 'express';
import { isAuth } from '../utils.js';
import fs from 'fs';
import path from 'path';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
    if (req.body.oldImage != undefined && req.body.oldImage != null && req.body.oldImage != '' &&
        req.body.oldImage != 'undefined') {
        fs.unlink(`${path.join(__dirname, '..', '..', req.body.oldImage.replace("\\", "/") )}`, function(err) {
            if (err) throw err;
        });
    }
    res.send(`/${req.file.path}`);
});

export default uploadRouter;