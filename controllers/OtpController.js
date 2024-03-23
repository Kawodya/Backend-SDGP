const otpGenerator = require('otp-generator');
const OtpModel = require('../models/Otp');
const UserModel = require('../models/User');

exports.sendOTP = async (email) => { // Passing 'res' as a parameter
  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OtpModel.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OtpModel.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OtpModel.create(otpPayload);
    // return res.status(200).json({ // Returning the response
    //   success: true,
    //   message: 'OTP sent successfully',
    //   otp,
    // });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Example usage:
// exports.sendOTP('example@email.com', res);
