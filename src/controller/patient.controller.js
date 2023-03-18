import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import QUERY from "../query/patient.query.js";

const httpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "OK" },
  BAD_REQUEST: { code: 400, status: "BAD REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL_SERVER_ERROR" },
};

export const getPatients = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patients data...`);
  database.query(QUERY.SELECT_PATIENTS, (error, result) => {
    if (!result) {
      res
        .status(httpStatus.OK.code)
        .send(
          new Response(
            httpStatus.OK.code,
            httpStatus.OK.status,
            `No Patients Found!`
          )
        );
    } else {
      res.status(httpStatus.OK.code).send(
        new Response(httpStatus.OK.code, httpStatus.OK.status, `Success!`, {
          patient: result,
        })
      );
    }
  });
};

export const createPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating patient data...`);
  database.query(
    QUERY.CREATE_PATIENT,
    Object.values(req.body),
    (error, result) => {
      if (!result) {
        logger.error(error.message);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR.code)
          .send(
            new Response(
              httpStatus.INTERNAL_SERVER_ERROR.code,
              httpStatus.INTERNAL_SERVER_ERROR.status,
              `INTERNAL SERVER ERROR!`
            )
          );
      } else {
        const patient = {
          id: result.insertedId,
          ...req.body,
          created_at: new Date(),
        };
        res
          .status(httpStatus.CREATED.code)
          .send(
            new Response(
              httpStatus.CREATED.code,
              httpStatus.CREATED.status,
              `Patient Account Create Success!`,
              patient
            )
          );
      }
    }
  );
};

export const getPatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patient data...`);
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, result) => {
    if (!result[0]) {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new Response(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Patient whose id is ${req.params.id}, was not found!`
          )
        );
    } else {
      res
        .status(httpStatus.OK.code)
        .send(
          new Response(
            httpStatus.OK.code,
            httpStatus.OK.status,
            `Patient Details Retrieved Successfully!`,
            result[0]
          )
        );
    }
  });
};

export const updatePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching patient data...`);
  database.query(QUERY.SELECT_PATIENT, [req.params.id], (error, result) => {
    if (!result[0]) {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new Response(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Patient whose id is ${req.params.id}, was not found!`
          )
        );
    } else {
      logger.info(`${req.method} ${req.originalUrl}, updating patient data...`);
      database.query(
        QUERY.UPDATE_PATIENT,
        [...Object.values(req.body), req.params.id],
        (error, result) => {
          if (!error) {
            res
              .status(httpStatus.OK.code)
              .send(
                new Response(
                  httpStatus.OK.code,
                  httpStatus.OK.status,
                  `Patient Account Update Success!`,
                  { id: req.params.id, ...req.body }
                )
              );
          } else {
            logger.error(error.message);
            res
              .status(httpStatus.INTERNAL_SERVER_ERROR.code)
              .send(
                new Response(
                  httpStatus.INTERNAL_SERVER_ERROR.code,
                  httpStatus.INTERNAL_SERVER_ERROR.status,
                  `An Error Occurred`
                )
              );
          }
        }
      );
    }
  });
};

export const deletePatient = (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting patient data...`);
  database.query(QUERY.DELETE_PATIENT, [req.params.id], (error, result) => {
    if (result.affectedRows > 0) {
      res
        .status(httpStatus.OK.code)
        .send(
          new Response(
            httpStatus.OK.code,
            httpStatus.OK.status,
            `Patient whose id is ${req.params.id}, was successfully deleted!`,
            result[0]
          )
        );
    } else {
      res
        .status(httpStatus.NOT_FOUND.code)
        .send(
          new Response(
            httpStatus.NOT_FOUND.code,
            httpStatus.NOT_FOUND.status,
            `Patient whose id is ${req.params.id}, was not found!`
          )
        );
    }
  });
};

export default httpStatus;
