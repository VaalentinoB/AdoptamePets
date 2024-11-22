import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const JWT_SECRET = "codercookie"; 
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) 
            return res.status(400).send({ status: "error", error: "Incomplete values" });

        const exists = await usersService.getUserByEmail(email);
        if (exists) 
            return res.status(400).send({ status: "error", error: "User already exists" });

        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
        };

        let result = await usersService.create(user);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) 
        return res.status(400).send({ status: "error", error: "Incomplete values" });

    const user = await usersService.getUserByEmail(email);
    if (!user) 
        return res.status(404).send({ status: "error", error: "User doesn't exist" });

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) 
        return res.status(400).send({ status: "error", error: "Incorrect password" });

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, JWT_SECRET, { expiresIn: "1h" });

    res.cookie('coderCookie', token, { maxAge: 3600000 });
    res.send({ status: "success", message: "Logged in", payload: userDto });  
};

const current = async (req, res) => {
    const cookie = req.cookies['coderCookie'];
    if (!cookie) 
        return res.status(401).send({ status: "error", error: "No token provided" });

    try {
        const user = jwt.verify(cookie, JWT_SECRET);
        return res.send({ status: "success", payload: user });
    } catch (error) {
        return res.status(401).send({ status: "error", error: "Token verification failed" });
    }
};
const unprotectedLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) 
        return res.status(400).send({ status: "error", error: "Incomplete values" });

    const user = await usersService.getUserByEmail(email);
    if (!user) 
        return res.status(404).send({ status: "error", error: "User doesn't exist" });

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) 
        return res.status(400).send({ status: "error", error: "Incorrect password" });

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, JWT_SECRET, { expiresIn: "1h" });

    // Establecer la cookie como un JWT
    res.cookie("unprotectedCookie", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.status(200).send({ status: "success" });
};


const unprotectedCurrent = async (req, res) => {
    const cookie = req.cookies['unprotectedCookie'];
    if (!cookie) 
        return res.status(401).send({ status: "error", error: "No token provided" });

    try {
        const user = JSON.parse(cookie); // Deserializar el objeto JSON
        return res.send({ status: "success", payload: user });
    } catch (error) {
        return res.status(401).send({ status: "error", error: "Invalid cookie format" });
    }
};


export default {
    current,
    login,
    register,
    unprotectedLogin,
    unprotectedCurrent,
};
