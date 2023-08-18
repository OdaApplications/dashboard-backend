const { createTable } = require("./createTable");
const { getAllTables } = require("./getAllTables");
const { getTableByName } = require("./getTableByName");
const { getTableColumnValues } = require("./getTableColumnValues");
const { getTableColumns } = require("./getTableColumns");

module.exports = {
  getAllTables,
  getTableByName,
  getTableColumns,
  getTableColumnValues,
  createTable,
};
