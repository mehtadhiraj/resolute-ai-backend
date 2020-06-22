const jwt =  require('jsonwebtoken');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const Models = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
// const User = require('../models/User');

const home = function(req, res){
    res.json({
        message: "Heelo"
    })
}

const login = async function(req, res){
    // TODO: validate from database
    let userDetails = await Models.User.findOne({ attributes: { exclude: ["createdAt", "updatedAt"] }, where: { username: req.body.username }});
    let isMatch = userDetails._modelOptions.instanceMethods.validPassword(req.body.password, userDetails.password);    
    delete userDetails.dataValues.password;
    // console.log(userDetails.dataValues, isMatch);
    if(!isMatch){
        res.status(403);
        res.json({
            message: "Invalid Credentials."
        })
    }else{
        jwt.sign(userDetails.dataValues, process.env.JWT_SECRET_KEY, function(error, token){
            if(error){
                res.status(403);
                res.json({
                    message: error
                });
            }else{
                console.log(token);
                res.json({
                    message: "success",
                    token
                })
            }
        })
    }
}

const register = async function(req, res){
    // console.info(req.body.image);
    let userDetails = req.body;
    userDetails.images = "/../public/uploads/";
    userDetails.role = "user";
    // console.log(userDetails);
    try {
        let newUser = await Models.User.create(userDetails);
        console.log(newUser);
        let userId = newUser.id;
        let dirName = __dirname + "/../public/uploads/"+userId.toString()+"-"+newUser.username;
        if (!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, { recursive: true });
        }
        // console.log(__dirname);
        
        await req.body.image.forEach((image, x)=>{
            // to declare some path to store your converted image
            let matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            response = {};
            // console.log(matches);
            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }
            
            response.type = matches[1];
            response.data = new Buffer.from(matches[2], 'base64');
            // console.log(response);
            let decodedImg = response;
            let imageBuffer = decodedImg.data;
            let type = decodedImg.type;
            let extension = mime.extension(type);
            let fileName = "image" + x.toString() + "." + extension;
            // console.log({ fileName, imageBuffer });
            fs.writeFileSync(path.join(dirName, fileName), imageBuffer, 'utf8');
        }) 
        res.json({
            message: "registered successfully."
        })  
    } catch (error) {
        // console.log(error);
        res.json({
            error: error.errors[0].message
        });
    }
}

module.exports = { 
    home,
    login,
    register
}