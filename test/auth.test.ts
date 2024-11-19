import supertest from "supertest";
import createApp from "../src/app.js";
import { expect, describe, it, beforeAll, afterAll } from "vitest";

const app = createApp();
const request = supertest(app);

describe("auth", () => {
    describe("auth controller test", () => {
        let server: any;

        beforeAll(async () => {
            server = app.listen(8080);
        });

        afterAll(async () => {
            await server.close();
        });

        describe("POST /api/v1/auth/register", () => {
            it("should return 201 for successful registration", async () => {
                const registerationData = {
                    email: "yogendrarana4321@gmail.com",
                    password: "password1A@",
                    confirm_password: "password1A@"
                };

                const response = await request
                    .post("/api/v1/auth/register")
                    .send(registerationData)
                    .expect(201);

                // Add additional assertions for the response data
                expect(response.body).toHaveProperty("success", true);
                expect(response.body).toHaveProperty("data");
            });
        });

        describe("POST /api/v1/auth/login", () => {
            it("should return 400 for invalid credentials", async () => {
                const loginData = {
                    email: "yogendrarana4321@gmail.com",
                    password: "password1A"
                };

                const response = await request.post("/api/v1/auth/login").send(loginData);

                expect(response.status).toBe(400);
                expect(response.body).toMatchObject({
                    success: false,
                    message: "Invalid email or password."
                });
            });
        });
    });
});
