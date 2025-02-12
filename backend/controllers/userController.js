import userModel from "../models/userModel.js";
import validator from "validator"
import bcrypt from "bcrypt";
import express from "express"
import jwt from "jsonwebtoken";

const createToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET);
}

//Route for user Login
const loginUser = async (req, res) => {
        try {
                const { email, password } = req.body;

                const user = await userModel.findOne({ email });

                if (!user) {
                        return res.json({ success: false, message: "User doesnt exist" })
                }
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                        const token = createToken(user._id)
                        res.setHeader("token_user", token);
                        res.json({ success: true, token })
                }
                else {
                        res.json({ success: false, message: "Invalid creditials" })
                }
        } catch (error) {
                console.log(error);
                res.json({ success: false, message: error.message })
        }

}

//Route for user Login
const registerUser = async (req, res) => {
        try {
                const { name, email, password, contactNumber } = req.body;

                //checking user already exist or not

                const exists = await userModel.findOne({ email })
                if (exists) {
                        return res.json({ success: false, message: "User already exists" })
                }

                //validating email format and password

                if (!validator.isEmail(email)) {
                        return res.json({ success: false, message: "Please enter valid email." });
                }
                if (password.length < 8) {
                        return res.json({ success: false, message: "Please enter Strong password." });
                }

                // hashing user password

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);


                const newUser = new userModel({
                        name,
                        email,
                        password: hashedPassword
                })

                const user = await newUser.save();

                const token = createToken(user._id)
                res.setHeader("token_user", token);

                res.json({ success: true, token, message: 'User Registered successfully' })
        } catch (error) {
                console.log(error);
                res.json({ success: false, message: error.message })

        }
}


export { loginUser, registerUser }