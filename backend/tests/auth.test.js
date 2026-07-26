const request = require("supertest");
const app = require("../src/app");
const userRepository = require("../src/repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../src/repositories/userRepository");
jest.mock("../src/config/db", () => ({
    query: jest.fn(),
    pool: {
        connect: jest.fn(() => ({
            query: jest.fn(),
            release: jest.fn()
        }))
    }
}));

describe("Authentication Routes", () => {
    describe("POST /api/auth/register", () => {
        it("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({});
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should register a user successfully", async () => {
            userRepository.findUserByEmail.mockResolvedValue(null);
            userRepository.createUser.mockResolvedValue({
                user_id: 1,
                email: "test@example.com",
                first_name: "John",
                last_name: "Doe",
                organization_id: 1,
                role_id: 3
            });

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "test@example.com",
                    password: "password123",
                    first_name: "John",
                    last_name: "Doe",
                    organization_id: 1
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe("test@example.com");
        });
    });

    describe("POST /api/auth/login", () => {
        it("should successfully log in user and return JWT", async () => {
            userRepository.findUserByEmail.mockResolvedValue({
                user_id: 1,
                email: "test@example.com",
                password_hash: "hashedpassword",
                organization_id: 1,
                role_id: 3
            });

            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
            jest.spyOn(jwt, "sign").mockReturnValue("mocktoken");

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBe("mocktoken");
        });
    });
});
