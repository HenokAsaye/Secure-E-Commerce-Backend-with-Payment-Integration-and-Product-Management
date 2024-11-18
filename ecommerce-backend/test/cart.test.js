import request from "supertest";
import app from "app";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";

describe("Test cart functionalities", () => {
    let token;
    let productId;
    let userId;

    beforeEach(async () => {
        await User.deleteMany();
        await Product.deleteMany();
        const userRes = await request(app)
            .post("/auth/signup")
            .send({
                username: "testname",
                email: "testEmail@example.com",
                password: "testPassword"
            });
        token = userRes.body.token;
        userId = userRes.body._id;
        expect(token).toBeDefined();
        const productRes = await request(app)
            .post("/product/createproduct")
            .set("Authorization", `Bearer ${token}`) 
            .send({
                name: "testProduct",
                description: "testDescription",
                price: 2,
                stock: 200
            });
        productId = productRes.body._id;
        expect(productId).toBeDefined();
    });

    it("should add to the cart", async () => {
        const res = await request(app)
            .post("/cart/addtocart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 1
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Product added/updated successfully in the cart!");
    });

    it("should update the cart", async () => {
        await request(app)
            .post("/cart/addtocart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 1
            });
        const res = await request(app)
            .patch("/cart/updatecart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 5
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Cart updated successfully!");
    });

    it("should give the user their cart", async () => {
        await request(app)
            .post("/cart/addtocart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 1
            });
        const res = await request(app)
            .get(`/cart/seecart/${userId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userCart).toBeDefined();
        expect(res.body.message).toBe("Here is the user cart");
    });

    it("should delete the user cart", async () => {
        await request(app)
            .post("/cart/addtocart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 1
            });
        const deleteCart = await request(app)
            .delete(`/cart/deletecart/${userId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteCart.statusCode).toEqual(200);
        expect(deleteCart.body.message).toBe("Cart deleted successfully!");
    });

    it("should delete a product from the cart", async () => {
        await request(app)
            .post("/cart/addtocart")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 1
            });
        const deleteProduct = await request(app)
            .delete(`/cart/deleteproduct/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: productId
            });
        expect(deleteProduct.statusCode).toEqual(200);
        expect(deleteProduct.body.message).toBe("Product removed from cart successfully!");
    });
});
