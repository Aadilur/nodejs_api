/*
If you use ' "type": "module", ' inside package.json you can
use import .. from ..; or es module and don't have to type 
module to export from file.
*/

import express from "express";
import ip from "ip";
import dotenv from "dotenv";
import cors from "cors";
import Response from "./domain/response.js";
import httpStatus from "./controller/patient.controller.js";
import logger from "./util/logger.js";
import patientRoute from "./routes/patient.route.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/patient", patientRoute);

app.get("/", (req, res) => {
  res.send(
    new Response(
      httpStatus.OK.code,
      httpStatus.OK.status,
      "Message from http",
      { patient: { name: "Olala" } }
    )
  );
});

app.all("*", (req, res) => {
  res
    .status(httpStatus.NOT_FOUND)
    .send(
      new Response(
        httpStatus.NOT_FOUND.code,
        httpStatus.NOT_FOUND.status,
        "NOT FOUND",
        { error: 404 }
      )
    );
});

app.listen(PORT, () => {
  logger.info(`Server is running on ${ip.address()}:${PORT}`);
});
