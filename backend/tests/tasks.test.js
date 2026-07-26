const request = require("supertest");
const app = require("../src/app");
const taskRepository = require("../src/repositories/taskRepository");
const projectRepository = require("../src/repositories/projectRepository");
const jwt = require("jsonwebtoken");

jest.mock("../src/repositories/taskRepository");
jest.mock("../src/repositories/projectRepository");
jest.mock("../src/config/db", () => ({
    query: jest.fn(),
    pool: {
        connect: jest.fn(() => ({
            query: jest.fn(),
            release: jest.fn()
        }))
    }
}));

describe("Tasks Routes", () => {
    let mockToken;

    beforeAll(() => {
        mockToken = jwt.sign(
            { user_id: 1, organization_id: 1, role_id: 3 }, // Member role
            process.env.JWT_SECRET || "fallbacksecret"
        );
    });

    describe("POST /api/tasks", () => {
        it("should reject creation if project does not exist in tenant organization", async () => {
            projectRepository.getProjectById.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({
                    project_id: 99,
                    title: "Critical Task"
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/tasks", () => {
        it("should successfully retrieve tasks for user organization", async () => {
            taskRepository.getTasks.mockResolvedValue({
                tasks: [{ task_id: 1, title: "Task 1", organization_id: 1 }],
                totalCount: 1,
                page: 1,
                limit: 10,
                totalPages: 1
            });

            const res = await request(app)
                .get("/api/tasks")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data[0].title).toBe("Task 1");
        });
    });
});
