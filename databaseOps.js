'use strict'

module.exports = {
  post_video: post_video,
}


const db = require('./sqlWrap');

// SQL commands for PrefTable
const sql = "INSERT INTO PrefTable (better,worse) values (?, ?)";

async function post_video(better,worse) {
  try {
    await db.run(sql, [better,worse]);
  } catch(error) {
    console.log("error", error);
  }
}