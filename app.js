import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import _ from "lodash";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoPassword = process.env.MONGO_PASSWORD;
async function connectToDb() {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:${mongoPassword}@cluster0.ruawe0b.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connected to DB");
  } catch (error) {
    console.log(error);
  }
}

connectToDb();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model("Post", postSchema);

// connect root
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:title", async (req, res) => {
  const requestedId = req.params.title;

  try {
    const showPost = await Post.findOne({ _id: requestedId });
    res.render("post", { showPost: showPost });
  } catch (error) {
    console.log(error);
  }
});

app.post("/compose", async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  try {
    await Post.create({
      title: title,
      content: content,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
