const express = require("express");
const chartsRouter = express.Router();

const { ctrlWrapper, getQueryChartMD } = require("../../middlewares");

const {
  getPageConfig,
  getChartDataByDynamicQuery,
} = require("../../controllers/charts");

chartsRouter.get("/get-page-config/:pageName", ctrlWrapper(getPageConfig));

chartsRouter.get(
  "/get-chart-data/:id",
  ctrlWrapper(getQueryChartMD),
  ctrlWrapper(getChartDataByDynamicQuery)
);

module.exports = chartsRouter;
