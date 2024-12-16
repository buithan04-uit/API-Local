const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, createVerifyCode, findUserByEmail, findVerifyCodeByEmail, getAllUsers, generateRandomString, sendVerificationEmail, updatePassword, updateVerifyCode, isEmailValid } = require('../service/CRUDService');
const e = require('express');

// Authentication routes
const signUp = async (req, res) => {

    let newUser = req.body;
    const { valid, reason } = await isEmailValid(newUser.email);
    if (!valid) {
        return res.status(201).json({ message: 'Error2 : Invalid email address' });
    }
    let [results, fields] = await findUserByEmail(newUser.email);
    if (results == undefined) {
        hashpassword = bcrypt.hashSync(newUser.password, 10);
        await createUser(newUser.firstname, newUser.lastname, newUser.email, newUser.sdt, hashpassword);
        res.status(201).json({ message: 'User created successfully' });
    }
    else {
        res.status(201).json({ message: 'Error1 : Email is used' });
    }

};

const logIn = async (req, res) => {
    let userLogin = req.body;
    let [results, failed] = await findUserByEmail(userLogin.email);
    if (results == undefined) {
        res.status(201).json({ message: 'Error : User not found' });
    }
    else {
        if (bcrypt.compareSync(userLogin.password, results.password)) {
            res.status(200).json({ message: 'Login successfully' });
        }
        else {
            res.status(201).json({ message: 'Err1 : Password incorrect' });
        }
    }
};

const logOut = async (req, res) => {

    res.status(200).json({ message: 'Here is Logout' });
};

const forgetPassword = async (req, res) => {
    let emailUser = req.body;
    let [results, fields] = await findUserByEmail(emailUser.email);
    if (results == undefined) {
        res.status(200).json({ message: 'Error: Email not exist' });
    }
    else {
        let varRandom = generateRandomString(6);
        console.log(varRandom);
        let [results, fields] = await findVerifyCodeByEmail(emailUser.email);
        if (results == undefined) {
            await createVerifyCode(emailUser.email, varRandom);
        }
        else {
            await updateVerifyCode(emailUser.email, varRandom);
        }
        res.status(200).json({ message: 'Verify Code was send to your email !' });
        sendVerificationEmail(emailUser.email, varRandom);
    }

}

const resendCode = async (req, res) => {
    let varRandom = generateRandomString(6);
    let Email = req.body;
    console.log(varRandom);
    await updateVerifyCode(Email.email, varRandom);
    res.status(200).json('Verify Code was Resend to your email !');
    sendVerificationEmail(Email.email, varRandom);
}

const verifyCode = async (req, res) => {
    let verify = req.body;
    let [results, fields] = await findVerifyCodeByEmail(verify.email);
    console.log(results);
    if (results.verifycode === verify.code) {
        res.status(200).json({ message: 'Verify Code is correct' });
    }
    else {
        res.status(200).json({ message: 'Error : Verify Code is incorrect' });
    }
};

const changeForget = async (req, res) => {
    let changePass = req.body;
    let hashedPassword = bcrypt.hashSync(changePass.newpassword)
    await updatePassword(hashedPassword, changePass.email);
    res.status(200).json({ message: 'Change Password successfully' });
};


// Dáshboard routes
const dashBoard = async (req, res) => {
    res.status(200).json({ message: 'Here is DashBoard' });
};
// map view routes
const mapView = async (req, res) => {
    res.status(200).json({ message: 'Here is Map View' });
};
// Profile routes

const profile = async (req, res) => {
    let [results, fields] = await findUserByEmail(emailGlobal);

    res.status(200).json({ message: 'Here is Profile' });
};
// Setting routes
const setting = async (req, res) => {
    res.status(200).json({ message: 'Here is Setting' });
};

const deleteAccount = async (req, res) => {
    res.status(200).json({ message: 'Here is Delete Account' });
};

const changePassword = async (req, res) => {
    let changePass = req.body;
    let [results, fields] = await findUserByEmail(changePass.email);
    if (bcrypt.compareSync(changePass.oldpassword, results.password)) {
        hashedPassword = bcrypt.hashSync(changePass.newpassword, 10);
        await updatePassword(hashedPassword, changePass.email);
        res.status(200).json({ message: 'ChangePassword successfully' });
    }
    else {
        res.status(200).json({ message: 'Error : Password current incorrect' });
    }

};

// API routes


const api = async (req, res) => {
    res.status(200).json({ message: 'Here is API' });
};

// admin routes
const update = async (req, res) => {
    let users = req.body;
    emailGlobal = users.email;
    hashedPassword = bcrypt.hashSync(users.newpassword, 10);
    await updatePassword(hashedPassword, users.email);
    res.status(200).json({ message: 'Update successfully' });
};

module.exports = {
    signUp,
    logIn,
    logOut,
    forgetPassword,
    resendCode,
    verifyCode,
    changeForget,
    dashBoard,
    profile,
    mapView,
    setting,
    deleteAccount,
    changePassword,
    api,
    update

};