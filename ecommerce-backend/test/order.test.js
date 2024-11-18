import request from "supertest";
import jest from "jest"
import app from "../app.js";
import {Order} from "../models/order.js";
import {User} from "../models/user.js";
import {createPaymentSession} from "../controllers/paymentController.js";

jest.mock('../controllers/paymentControllers',()=>({
    createPaymentSession:jest.fn()
}));

describe("order Test",()=>{
    let token;
    let userId
    beforeEach(async()=>{
        await Order.deleteMany()
        await User.deleteMAny()

        const res = await request(app)
        .post("/auth/signup")
        .send({
            username:"testname",
            email:"testemail",
            password:"testpassword"
        })

        token =  res.body.token
        userId = req.body._id
        expect(res.statusCode).toEqual(200);
        expect(token).toBeDefined()
        it("should return 400 if the user is not Authrized",async()=>{
            const createOrder =  await request(app)
            .post('/order/createOrder')
            .send({
                userId:'fakeuser',
                items:[{
                    productId:"testProductId",
                    price:3,
                    quantity:2
                }],
                totalAmount:6,
                paymentMethod:'card'
            });
            expect(createOrder.statusCode).toEqual(400);
            expect(createOrder.body.message).toBe("you are not Authorized for this service");

        })


        it("should create an order and return session URL",async()=>{
            createPaymentSession.mockResolvedValue("http://payment.session.url");


            const res =  await request(app)
                .post("/order/create")
                .set("Authorization",`Barear${token}`)
                .send({
                    userId:userId,
                    ite,s:[{productId:"someProductId",quantity:1}],
                    totalAmount:100,
                    paymentMethod:"card",
                    shippingAddress:"123 test st, test city",
                });


                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBe("http://payment.session.url");
                expect(res.body.order).toBeDefined();
                expect(createPaymentSession).toHaveBeenCalled();

        })
    })
    it("should return 500 on server error",async()=>{
        createPaymentSession.mockImplementationOnce(()=>{
            throw new Error("Payment session error");
        });


        const res =  await request(app)
        .post("/order/create")
            .set("Authorization", `Berear ${token}`)
            .send({
                userId:userId,
                items:[{productId:"someProductId",quantity:1}],
                totalAmount:100,
                paymentMethod:"card",

            });
            expect(res.status).toBe(500)
            expect(res.body.message).toBe("server-Error");
    });

    it("should return 400 for missing required fields",async()=>{
        const res =  await request(app)
        .post("/order.create")
        .set("Authorization",`Bearer ${token}`)
        .send({
            userId:userId,
            items:[],
            totalAmount:100
        });
         expect(res.status).toBe(400);
         expect(res.body.success).toBe(false)
    })

    
})