const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid image type');
        if(isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + Date.now() + '.' + ext);
    }
});
// CREATE
router.post('', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        body: req.body.body,
        imagePath: url + '/images/' + req.file.filename
    });
    console.log(post);
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'ADDED',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
});
// READ
router.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery.skip(pageSize*(currentPage-1)).limit(pageSize);
    } 
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.estimatedDocumentCount();
        // return Post.count();
    }).then(count => {
        res.status(200).json({ message: 'SUCCESS', posts: fetchedPosts, maxPosts: count });
    });
});
// UPDATE
router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        body: req.body.body,
        imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({ message: 'UPDATED' });
    });
});
// Fetch particular post after reload
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            return res.status(200).json(post);
        }
        else {
            return res.status(404).json({ message: 'Post Not Found' });
        }
    });
});

// DELETE
router.delete('/:id', checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({ message: 'DELETED' });
    });
});

module.exports = router;