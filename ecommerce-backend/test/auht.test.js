import request from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import { verify } from "jsonwebtoken";

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
            verificationToken:signupResponse.body.verificationTokem
        })
        expect(res.statusCode).toEqual(200)
    })

})

