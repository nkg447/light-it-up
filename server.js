/**
 * Example script using cloudtuya to connect, get states an change them
 */

const debug = require("debug")("cloudtuya");
const fs = require("fs");
const CloudTuya = require("./cloudtuya");
const Light = require("./devices/light");

const express = require("express");
const http = require("http");
const port = process.env.PORT || 4001;
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({ credentials: true }));
const server = http.createServer(app);


const name = "cloudtuya";
let myLight;

debug("booting %s", name);
// Load local files
let apiKeys = {};
let deviceData = {};
try {
  apiKeys = require("./keys.json");
} catch (err) {
  console.error("keys.json is missing.");
}
try {
  deviceData = require("./devices.json");
} catch (err) {
  console.warn("devices.json is missing. creating temporary");
  deviceData = [{ id: "10000000000", name: "temp" }];
}
/**
 * Save Data Such a Devices to file
 * @param {Object} data to save
 * @param {String} [file="./devices.json"] to save to
 */
function saveDataToFile(data, file = "./devices.json") {
  debug(`Data ${JSON.stringify(data)}`);
  fs.writeFile(file, JSON.stringify(data), (err) => {
    if (err) {
      return debug(err);
    }
    debug(`The file ${file} was saved!`);
    return file;
  });
}

// Load from keys.json
const api = new CloudTuya({
  userName: apiKeys.userName,
  password: apiKeys.password,
  bizType: apiKeys.bizType,
  countryCode: apiKeys.countryCode,
  region: apiKeys.region,
});

async function findDevices() {
  // Get all devices registered on the Tuya app
  let devices = await api.find();
  debug(`devices ${JSON.stringify(devices)}`);

  // Save device to device.json
  saveDataToFile(devices);
  console.log(`devices ${JSON.stringify(devices)}`);
  return devices;
}

async function getState(devId) {
  // Get state of a single device
  const deviceStates = await api.state({
    devId,
  });
  const state = deviceStates.devId;
  debug(`devices ${JSON.stringify(deviceStates)}`);
  console.log(state);
}

function randomLights(myLight) {
  let hue = Math.floor(Math.random() * 360);
  let saturation = Math.random();
  let brightness = Math.floor(Math.random() * 100);
  myLight.setColor(hue, saturation, brightness);
}

async function lightControl(deviceId) {
  // Example how to turn on a lamp and set brightness
  myLight = new Light({ api, deviceId });

  myLight.turnOn();
  myLight.setBrightness(100);
  // setInterval(() => randomLights(myLight), 5000);
}

async function loginAndFindDevices() {
  try {
    const temp = require("./api.json");
    Object.keys(temp).forEach((e) => {
      api[e] = temp[e];
    });
    return;
  } catch (err) {
    console.error("api.json is missing.");
  }
  // Connect to cloud api and get access token.
  const tokens = await api.login();
  console.log(`Token ${JSON.stringify(tokens)}`);

  /**
   * Initial find and save devices
   * */
  deviceData = await findDevices();
  deviceData.map(
    async (d) =>
      await api.find({
        devId: d.id,
      })
  );

  /**
   * Serialize API Data
   * */
  saveDataToFile(api, "./api.json");
}

async function main() {
  // Test device read from devices.json saved at the end.

  debug(`device data ${JSON.stringify(deviceData)}`);

  await loginAndFindDevices();

  /**
   * Get state
   * Before running comment out findDevices line above(tuya rate limit)
   */
  //await getState(deviceData[0].id);

  /**
   * For light control
   */
  await lightControl(deviceData[0].id);
}

main();

app.get("/color", function (req, resp) {
  const hue = req.query.hue;
  myLight.setColor(hue, 0.5, 100);
  resp.send('ok');
});

server.listen(port, () => console.log(`Listening on port ${port}`));