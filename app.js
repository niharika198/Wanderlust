const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { wrap } = require("module");
const session = require("express-session");
const flash=require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.get("/", (req, res) => {
  res.send("hi! i am root");
});


app.use(session(sessionOptions));
app.use(flash());

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     });
//      await  sampleListing.save();
//      console.log("sample was saved");
//      res.send("SUCCESSFUL testing")
// });

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
  next();
});

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

app.all("/{*any}", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
  // res.status(status).send(message);
});
app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
