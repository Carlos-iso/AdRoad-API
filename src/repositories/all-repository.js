"use strict";
const mongoose = require("mongoose");
const Advertiser = mongoose.model("Advertiser");
const Driver = mongoose.model("Driver");
exports.checkAllExist = async (email) => {
  const driver = await Driver.findOne({ email });
  if (driver) return { exists: true, type: "driver" };
  const advertiser = await Advertiser.findOne({ email });
  if (advertiser) return { exists: true, type: "advertiser" };
  return { exists: false };
}