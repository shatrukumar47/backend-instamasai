const express = require("express");
const { PostsModel } = require("../model/postsModel");
const { auth } = require("../middlewares/auth.middleware");

const postsRouter = express.Router();

//Add Post
postsRouter.post("/add", auth, async (req, res) => {
  const post = req.body;
  console.log(post);
  try {
    let newPost = new PostsModel(post);
    await newPost.save();
    res.status(200).send({ msg: "Post created successfully" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//GET Posts
postsRouter.get("/", auth, async (req, res) => {
  try {
    let allposts = await PostsModel.find({ userID: req.body?.userID });
    res.status(200).json(allposts);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Update Post
postsRouter.patch("/update/:id", auth, async (req, res) => {
  const post = req.body;
  const { id } = req.params;
  console.log(id, post);
  try {
    await PostsModel.findByIdAndUpdate({ _id: id }, post);
    let updatedpost = await PostsModel.findOne({ _id: id });
    res
      .status(200)
      .send({ msg: "Post updated successfully", post: updatedpost });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

//Delete Post
postsRouter.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await PostsModel.findByIdAndDelete({ _id: id });
    res
      .status(200)
      .send({ msg: `Post deleted with _id : ${id}  successfully` });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = {
  postsRouter,
};
