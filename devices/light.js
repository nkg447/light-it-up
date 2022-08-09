const BaseDevice = require('./baseDevice');

class Light extends BaseDevice {
  constructor(options) {
    super(options);
    this.hue=0;
    this.saturation=0;
    this.brightness=0;
    this.temperature=0;
  }

  /* Brightness */
  async supportsBrightness(){
    return await this.supportsFeature('brightness');
  }
  async getBrightness(){
    // Converts string to number and calculates to percentage
    return JSON.parse((await this.getSkills())['brightness']) / 255;
  }
  async setBrightness(value) {
    return await this._api.setState({
      devId: this._deviceId,
      command: 'brightnessSet',
      setState: value,
    });
  }

  async setColor(hue, saturation, brightness) {
    hue = hue === null ? this.hue : hue;
    saturation = saturation === null ? this.saturation : saturation;
    brightness = brightness === null ? this.brightness : brightness;
    
    return await this._api.setState({
      devId: this._deviceId,
      command: "colorSet",
      payload: {
        color: {hue, saturation, brightness
        }
      }
    });
  }

  // async setTemperature(value) {
  //   return await this._api.setState({
  //     devId: this._deviceId,
  //     command: 'temperatureSet',
  //     setState: value,
  //   });
  // }


  /* Color*/
  async supportsColor(){
    return await this.supportsFeature('color');
  }
  async getColor(){
    return (await this.getSkills())['color'];
  }

  /* Color Temperatur */
  async supportsColorTemperatur(){
    return await this.supportsFeature('color_temp');
  }
  async getColorTemperatur(){
    return (await this.getSkills())['color_temp'];
  }
}
module.exports = Light;
