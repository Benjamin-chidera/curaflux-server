export const generateOtpEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://curaflux.netlify.app/assets/logo-DH0Xceen.png" alt="Logo" style="max-width: 150px;" />
        </div>
        <h2 style="text-align: center; color: #333;">Verify Your Account</h2>
        <p style="text-align: center; font-size: 16px; color: #555;">Hello, your OTP for verifying your account is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 30px; color: #4CAF50; font-weight: bold;">Your OTP is: ${otp}</span>
        </div>
        <p style="text-align: center; font-size: 14px; color: #777;">
          This OTP will expire in 1 hour. If you did not request this, please ignore this email.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://curaflux.netlify.app/" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Site</a>
        </div>
      </div>
    </div>
  `;
};

export const generateWelcomeEmailTemplate = (msg) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://curaflux.netlify.app/assets/logo-DH0Xceen.png" alt="Logo" style="max-width: 150px;" />
        </div>
        <h2 style="text-align: center; color: #333;">Successful Registration</h2>
        <p style="text-align: center; font-size: 16px; color: #555;">Welcome to the family</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 30px; color: #4CAF50; font-weight: bold;">${msg}</span>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://curaflux.netlify.app/" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Site</a>
        </div>
      </div>
    </div>
  `;
};

export const generateForgotPasswordEmailTemplate = (resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://curaflux.netlify.app/assets/logo-DH0Xceen.png" alt="Logo" style="max-width: 150px;" />
        </div>
        <h2 style="text-align: center; color: #333;">Forgot Password</h2>
       
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 30px; color: #4CAF50; font-weight: bold;">
          To reset your password, please click on the following link: <a href="${resetLink}">${resetLink}</a>
          </span>
        </div>
      
      </div>
    </div>
  `;
};


export const generateResetPasswordEmailTemplate = (msg) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://curaflux.netlify.app/assets/logo-DH0Xceen.png" alt="Logo" style="max-width: 150px;" />
        </div>
        <h2 style="text-align: center; color: #333;">Password Reset Successful</h2>
        <p style="text-align: center; font-size: 16px; color: #555;">Continue to enjoy your shift</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 30px; color: #4CAF50; font-weight: bold;">${msg}</span>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://curaflux.netlify.app/login" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Site</a>
        </div>
      </div>
    </div>
  `;
};