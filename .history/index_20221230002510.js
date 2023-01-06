import express from "express";
import cors from "cors";

const app = express();

const port = 8080;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.listen(port, function () {
  console.log("서버실행 완료 port : " + port);
});

app.get("/", function (req, res) {
  console.log("aaaa");
  res.send("main");
});
