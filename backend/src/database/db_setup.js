const { Client, Pool } = require("pg");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Iqoo@2005",
};

async function checkAndSetupDatabase() {
    console.log("🔄 Starting automatic database validation and setup...");
    
    // Connect to 'postgres' system database to check if 'projecthub' database exists
    const systemClient = new Client({ ...dbConfig, database: "postgres" });
    try {
        await systemClient.connect();
        
        const dbCheckRes = await systemClient.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME || "projecthub"]
        );
        
        if (dbCheckRes.rows.length === 0) {
            console.log(`Database '${process.env.DB_NAME || "projecthub"}' does not exist. Creating...`);
            await systemClient.query(`CREATE DATABASE "${process.env.DB_NAME || "projecthub"}"`);
            console.log("Database created successfully.");
        } else {
            console.log(`Database '${process.env.DB_NAME || "projecthub"}' exists.`);
        }
    } catch (err) {
        console.error("❌ Database validation warning (make sure database exists):", err.message);
    } finally {
        try {
            await systemClient.end();
        } catch (e) {
            // ignore
        }
    }

    // Connect to target database
    const targetPool = new Pool({
        ...dbConfig,
        database: process.env.DB_NAME || "projecthub",
    });

    try {
        const schemaPath = path.join(__dirname, "../../sql/schema.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf8");
        
        console.log("Running schema queries...");
        await targetPool.query(schemaSql);

        // Run migrations explicitly
        console.log("Running migrations...");
        await targetPool.query(`
            ALTER TABLE projects 
            ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'General Operations'
        `);
        
        console.log("Schema validation complete.");

        // Seeding Roles
        await targetPool.query(`
            INSERT INTO roles (role_id, role_name) 
            VALUES 
                (1, 'Admin'), 
                (2, 'Manager'), 
                (3, 'Member')
            ON CONFLICT (role_id) DO NOTHING
        `);

        // Seeding Default Organization
        await targetPool.query(`
            INSERT INTO organizations (organization_id, company_name, organization_slug) 
            VALUES (1, 'ProjectHub', 'projecthub')
            ON CONFLICT (organization_slug) DO NOTHING
        `);

        // Seeding Default Demo Users
        const passwordHash = await bcrypt.hash("password123", 10);
        
        const demoUsers = [
            { id: 1, first: "Alex", last: "Rivera", email: "admin@projecthub.test", role: 1 },
            { id: 2, first: "Sarah", last: "Chen", email: "manager@projecthub.test", role: 2 },
            { id: 3, first: "Maya", last: "Patel", email: "member@projecthub.test", role: 3 }
        ];

        for (const user of demoUsers) {
            await targetPool.query(`
                INSERT INTO users (user_id, organization_id, role_id, first_name, last_name, email, password_hash)
                VALUES ($1, 1, $2, $3, $4, $5, $6)
                ON CONFLICT (email) DO UPDATE 
                SET first_name = $3, last_name = $4, role_id = $2, password_hash = $6
            `, [user.id, user.role, user.first, user.last, user.email, passwordHash]);
        }

        // Reset serial sequences
        await targetPool.query("SELECT setval('organizations_organization_id_seq', (SELECT MAX(organization_id) FROM organizations))");
        await targetPool.query("SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users))");

        console.log("✅ Database auto-setup check completed successfully.");
    } catch (err) {
        console.error("❌ Database setup error:", err.message);
    } finally {
        try {
            await targetPool.end();
        } catch (e) {
            // ignore
        }
    }
}

// Run as async operation
checkAndSetupDatabase();
