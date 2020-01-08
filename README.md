# cloudtuya
Tuya control over the cloud

This Node.js API allows you to control your Tuya / Smart Life Devices by just passing your email and password, that you are using in the Tuya/Smart Life app.


## Get Started

- Install [Node.js](http://nodejs.org/)
- Clone Repository
- `cd` to Repository folder
- Run `npm i`
- Create a `keys.json` file (see example below)
- Run `node example.js`

This will turn off the first device you've set up in Tuya / Smart Life. Also a `devices.json` file will get created with a list of all your devices and it's state.


## Example Files

### Example Script showing how to use cloudtuya

Take a look at the `example.js` file, to see how to call the cloudtuya API.

### Example `keys.json`

```
{
"userName": "YOURSMARTLIFEEMAIL",
"password": "YOURSMARTLIFEPASSWORD",
"bizType": "smart_life",
"countryCode": "de",
"region": "eu"
}
```
