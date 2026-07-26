const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const register = async (req, res) => {
    try {
        const {
            organization_id,
            role_id,
            first_name,
            last_name,
            email,
            password
        } = req.body;

        const existingUser = await userRepository.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await userRepository.createUser({
            organization_id,
            role_id,
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
        console.error(error);

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

module.exports = {
    register,
    login,
    getCurrentUser
};