const express = require("express");
const chartsRouter = express.Router();

const { ctrlWrapper, testGetQueryChartMD } = require("../../middlewares");

const {
  getDataByParams,
  getTableColumns,
  getTableColumnValues,
} = require("../../controllers/charts");

const { getPageConfig } = require("../../controllers/getPageConfig");
const {
  getDataByDynamicQuery,
} = require("../../controllers/getDataByDynamicQuery");

// page chart config routes
chartsRouter.get("/get-page-config/:pageName", ctrlWrapper(getPageConfig));
chartsRouter.get(
  "/get-dynamic-data/:id",
  ctrlWrapper(testGetQueryChartMD),
  ctrlWrapper(getDataByDynamicQuery)
);

module.exports = chartsRouter;
