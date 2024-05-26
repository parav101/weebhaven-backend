import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";
import productProcessRouter from "./routes/productProcess.routes";
import viewProductRouter from "./routes/viewProducts.routes";
import orderRouter from "./routes/order.routes";
import addressRouter from "./routes/address.routes"
import adminRouter from "./routes/admin.routes"
import { currentUser } from "./middleware/user.middlware";
import { db } from "./database/connections";

const PORT = process.env.PORT || 3001;
dotenv.config();

const init = async () => {
  const app = express();
  app.use(cors());
  app.use(express.static('src/images'))
  app.use(function (req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Xss-Protection", "1; mode=block");
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Content-Security-Policy", "script-src 'self'");
    next();
  });
  app.use(express.json());
  app.get("/api", (req, res) => {
    res.status(200).send({ message: "ok" });
  });

  app.use("/api",viewProductRouter);
  app.use("/api",userRouter);
  app.use(currentUser)
  app.use("/api",productProcessRouter);
  app.use("/api",addressRouter)
  app.use("/api",orderRouter);
  app.use("/api",adminRouter);
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
};
db.connect()
  .then(() => {
    console.log("db connected");
    db.syncModels()
    console.log("db synced");
    init();
  }).catch((err: Object) => {
    console.error("Error connecting database: ", err);
  });

