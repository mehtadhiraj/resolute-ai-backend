const jwt =  require('jsonwebtoken');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
const User = require('../models/User');

const home = function(req, res){
    res.json({
        message: "Heelo"
    })
}

const login = function(req, res){
    // TODO: validate from database
    jwt.sign(req.body, process.env.JWT_SECRET_KEY, function(error, token){
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

const register = async function(req, res){
    // console.info(req.body.image);
    let dirName = __dirname + "/../public/uploads/userid";
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName, { recursive: true });
    }
    console.log(__dirname);
    
    await req.body.image.forEach((image, x)=>{
        // to declare some path to store your converted image
        var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
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
}

module.exports = { 
    home,
    login,
    register
}