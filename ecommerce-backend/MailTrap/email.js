import { mailtrapClient, sender } from "./mailTrap.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "verification Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{varificationcode}",
        verificationToken
      ),
      category: "verification Email",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sendinf verification Email", error);
    throw new Error(`Failed to send varification Email${error}`);
  }
};

export const sendWelcomeEmail = async (email) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      template_uuid: "b00d7c49-9297-49db-9485-c36af9f2c87f",
      template_variables: {
        name: "name",
        company_info_name: "Ecommerce",
      },
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    throw new Error("Error while sending welcome Email", error);
  }
};

export const sendPasswordResetEmail = async (email, reseturl) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "reset password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{reseturl}", reseturl),
      category: "password reset email",
    });
    console.log("Email sent successfully!", response);
  } catch (error) {
    throw new Error("Error while sending Password Reset Email", error);
  }
};

export const PasswordResetSuccessEmail = async (email) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "password reset success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "reset success",
    });
    console.log("Email sent successfully", response);
    return res.status(200).json({
      success: true,
      message: "Email Sent Succesfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error!" });
  }
};
