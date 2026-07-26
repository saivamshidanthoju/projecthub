const request = require("supertest");
const app = require("../src/app");
const projectRepository = require("../src/repositories/projectRepository");
const jwt = require("jsonwebtoken");

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

describe("Projects Routes", () => {
    let mockToken;

    beforeAll(() => {
        mockToken = jwt.sign(
            { user_id: 1, organization_id: 1, role_id: 2 }, // Manager role
            process.env.JWT_SECRET || "fallbacksecret"
        );
    });

    describe("POST /api/projects", () => {
        it("should reject creation if request is unauthorized", async () => {
            const res = await request(app)
                .post("/api/projects")
                .send({ project_name: "New Project" });
            
            expect(res.statusCode).toBe(401);
        });

        it("should create project successfully", async () => {
            projectRepository.findActiveByNameInOrg.mockResolvedValue(null);
            projectRepository.createProject.mockResolvedValue({
                project_id: 1,
                project_name: "New Project",
                organization_id: 1,
                status: "ACTIVE"
            });

            const res = await request(app)
                .post("/api/projects")
                .set("Authorization", `Bearer ${mockToken}`)
                .send({ project_name: "New Project" });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.project_name).toBe("New Project");
        });
    });

    describe("GET /api/projects", () => {
        it("should fetch projects matching organization boundary", async () => {
            projectRepository.getProjectsByOrganization.mockResolvedValue({
                projects: [{ project_id: 1, project_name: "Project A", organization_id: 1 }],
                totalCount: 1,
                page: 1,
                limit: 10,
                totalPages: 1
            });

            const res = await request(app)
                .get("/api/projects")
                .set("Authorization", `Bearer ${mockToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data[0].project_name).toBe("Project A");
        });
    });
});
