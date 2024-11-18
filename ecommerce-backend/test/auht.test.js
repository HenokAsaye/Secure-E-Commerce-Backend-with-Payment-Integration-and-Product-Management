import request from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import {sendPasswordResetEmail,sendVerificationEmail,PasswordResetSuccessEmail,sendWelcomeEmail} from "../MailTrap/email.js";
describe("Authentication Test",()=>{
    befforeEach(async()=>{
        await User.deleteMany();
    })


    it("should signup the user",async()=>{
        const res = await request(app)
        .post(/auth/signup)
        .send({
            username:"testuser",
            password:"testPassword",
            email:"test@gmail.com",
            role:'customer'
        });
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('token')
    },20000)

    it("should login the user",async()=>{
        await request(app)
        .post(/auth/signup)
        .send({
            username:"testuser",
            password:"testPassword",
            email:"test@gmail.com",
            role:'customer'
        });
        const res = await request(app)
        .post(/auth/login)
        .send({
            email:"test@gmail.com",
            password:"testPassword"
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    },20000);

    it("should verify Email",async()=>{
        const userdata = {
            username:"testname",
            email:"henokasaye77@gmail.com",
            password:"testPassword"
        }
        const signupResponse = await request(app).post("/auth/signup").send(userdata)
        const res = await request(app).post('/auth/verifyEmail')
        .send({
            verificationToken:signupResponse.body.verificationToken
        })
        expect(res.statusCode).toEqual(200)
    })

    it("send password reset email",async()=>{
        const userdata = {
            username:"testname",
            email:"henokasaye77@gmail.com",
            passowrd:"testPassword"   
        }
        const signupResponse = await request(app).post("/auth/signup").send(userdata)
        const res = await request(app).post("/auth/forgotPassword")
        .send({
            email:signupResponse.body.email
        })
        expect(res.statusCode).toEqual(200);
        expect(res.body),toHaveProperty("resetPasswordToken")
    },20000)
    it("should send Password Reset sucess Email",async()=>{
        const userdata = {
            username:"testname",
            email:"henokAsaye77@gmail.com",
            password:'testPassword'
        }

        const signupResponse  = await request(app).post("/auth/signup").send(userdata)
        const forgotPassword = await request(app).post("/auth/forgotpassowrd").send({email:signupResponse.body.email})
        const res = await request(app).post('/auth/resetpassowrd')
        .send({
            code:forgotPassword.body.resetPasswordToken,
            password:"newpassword"
        })
        expect(res.statusCode).toEqual(200)
    })


})

