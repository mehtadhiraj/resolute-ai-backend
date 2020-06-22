const jwt =  require('jsonwebtoken');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const Models = require('../models');

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
    if(userDetails.role === 'admin'){
        let users= await Models.User.findAll({attributes: { exclude: ["password", "createdAt", "updatedAt", "images"] }, where: {role: 'user'}});
        let userArray = [];
        users.forEach((user)=>{
            userArray.push(user.dataValues);
        })
        // userArray = userArray.dataValues;
        // console.log(userArray);
        userDetails.dataValues.userArray = userArray;
    }else{
        let images = [];
        let folderPath = __dirname + userDetails.images + userDetails.id.toString() + "-" + userDetails.username.toString();
        try{
            fs.readdirSync(folderPath).forEach((image)=>{
                var imagesPath = "http://localhost:3001/uploads/" + userDetails.id.toString() + "-" + userDetails.username.toString() + "/" + image;
                images.push(imagesPath);
            })
        
        }catch(error){
            console.error(error);
        }
        userDetails.dataValues.images = images;
        // console.log(userDetails.dataValues);
    }
    // console.log(userDetails.dataValues);
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
                // console.log(token);
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
        // console.log(newUser);
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