const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const db = require("../config/db");

const register = async (req, res) => {
    try {
        const {
            organization_id,
            company_name,
            organization_slug,
            role_id,
            first_name,
            last_name,
            email,
            password
        } = req.body;

        // 1. Validate / Ensure organization exists in organizations table
        const targetOrgId = parseInt(organization_id, 10);
        const resolvedSlug = organization_slug ? organization_slug.trim() : `org-${targetOrgId}`;
        const resolvedCompanyName = company_name ? company_name.trim() : resolvedSlug;

        try {
            await db.query(`
                INSERT INTO organizations (organization_id, company_name, organization_slug)
                VALUES ($1, $2, $3)
                ON CONFLICT (organization_id) DO NOTHING
            `, [targetOrgId, resolvedCompanyName, resolvedSlug]);
        } catch (orgError) {
            console.error("Warning: Organization insertion check failed", orgError.message);
        }

        // 2. Validate email is unique
        const existingUser = await userRepository.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        // Default role is 3 (Member) if role_id is not passed
        const user = await userRepository.createUser({
            organization_id: targetOrgId,
            role_id: role_id || 3,
            first_name,
            last_name,
            email,
            password_hash
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: user
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                organization_id: user.organization_id,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                user_id: user.user_id,
                organization_id: user.organization_id,
                role_id: user.role_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await userRepository.findUserById(req.user.user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const adminTestEndpoint = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome Admin"
    });
};

module.exports = {
    register,
    login,
    getCurrentUser,
    adminTestEndpoint
};