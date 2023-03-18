import express from "express";
import {
  getPatients,
  createPatient,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controller/patient.controller.js";

const patientRoute = express.Router();

patientRoute.route("/").get(getPatients).post(createPatient);
patientRoute
  .route("/:id")
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

export default patientRoute;
