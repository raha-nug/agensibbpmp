const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const authRoute = require("./routes/auth.routes");
const agensiRoute = require("./routes/agensi.routes");
const roleRoute = require("./routes/roles.routes");
const userRoute = require("./routes/users.routes");
const adminRoute = require("./routes/admin.routes");
const suratRoute = require("./routes/surat.routes");
const suratUserRoute = require("./routes/surat_on_user.routes");
const { verifyToken, isAdmin } = require("./middlewares/auth.middleware");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
require('./controllers/email_reminder'); // Menjalankan email reminder by cron job



app.use(express.static("public"));
app.use("/uploads", verifyToken, express.static("uploads"));

app.set("view engine", "ejs"); //menggunakan template engine ejs, semua file .ejs disimpan di folder views

app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css")); //memanggil css di path /css
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); //memanggil js di path /js
app.use(
  "/icons",
  express.static(__dirname + "/node_modules/bootstrap-icons/font/")
); //memanggil icon di path /icons

app.use("/auth", authRoute);
app.use("/agensi", verifyToken, agensiRoute);
// app.use("/surat", verifyToken, suratRoute);
app.use("/surat-user", verifyToken, suratUserRoute);
app.use("/admin", verifyToken, isAdmin, adminRoute);
// app.use("/users", verifyToken, isAdmin, userRoute);
// app.use("/roles", /*verifyToken, isAdmin,*/ roleRoute);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
