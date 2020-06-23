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
    /**
     * Body parameters 
     * @param username, password
    */
    // Query to fetch user details.
    let userDetails = await Models.User.findOne({ attributes: { exclude: ["createdAt", "updatedAt"] }, where: { username: req.body.username }});
    
    //Execute instance method to validate password.
    let isMatch = userDetails._modelOptions.instanceMethods.validPassword(req.body.password, userDetails.password);    
    
    // Delete password from the jaon after validating
    delete userDetails.dataValues.password;

    if(!isMatch){
        res.status(403);
        res.json({
            message: "Invalid Credentials."
        })
    }else{
        // ? If admin then send all the user details else send images of the registered user.
        if(userDetails.role === 'admin'){
            // Find all the users with role as user.
            let users= await Models.User.findAll({attributes: { exclude: ["password", "createdAt", "updatedAt", "images"] }, where: {role: 'user'}});
            let userArray = [];
            users.forEach((user)=>{
                userArray.push(user.dataValues);
            })
            // console.log(userArray);
            userDetails.dataValues.userArray = userArray;
        }else{
            let images = [];
            /**
             * Creating a path to a folder where uploaded images are stored.
             * *Path is creadtd by continating base path stored in db with userid, "-", username.
            */ 
            let folderPath = __dirname + userDetails.images + userDetails.id.toString() + "-" + userDetails.username.toString();
            
            /**
             * Read the directory to get name of all images
             * @param folderPath
             * This returns array of all the images in the given folder.
             */
            try{
                fs.readdirSync(folderPath).forEach((image)=>{
                    // Creating a url to fetch image from the client
                    var imagesPath = "http://localhost:3001/uploads/" + userDetails.id.toString() + "-" + userDetails.username.toString() + "/" + image;
                    images.push(imagesPath);
                })
            
            }catch(error){
                console.error(error);
            }
            userDetails.dataValues.images = images;
            // console.log(userDetails.dataValues);
        }
        // console.log(userDetails.dataValues)    

        // Sign and get jwt token
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

    /**
     * Body parameters
     * @param name, email, username, gender, dob, password, array of image
     */
    let userDetails = req.body;
    userDetails.images = "/../public/uploads/"; //Setting a base of the image folder
    userDetails.role = "user"; // **Default role set to user
    // console.log(userDetails);
    
    try {
        // Create a new user.
        let newUser = await Models.User.create(userDetails);
        // console.log(newUser);
        let userId = newUser.id;
        /**
         * *Creating a new unique directory inside the base folder for the images
         * *Path is a concatination of - base path + userId+"-"+username.
         */
        let dirName = __dirname + "/../public/uploads/"+userId.toString()+"-"+newUser.username;

        // If following dosen't exist create new.
        if (!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, { recursive: true });
        }
        // console.log(__dirname);
        
        /**
         * Storing images in folder created.
         * *Steps - convert the base64 encoded image to it's original format. 
         * *Image names is a concatination of "images"+[index of image in a array]
         */
        await req.body.image.forEach((image, x)=>{
            let matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            response = {};
            // console.log(matches);
            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }
            
            response.type = matches[1]; //Image extension
            response.data = new Buffer.from(matches[2], 'base64'); //Encoded image
            // console.log(response);
            let decodedImg = response;
            let imageBuffer = decodedImg.data;
            let type = decodedImg.type;
            let extension = mime.extension(type); //Making extension of given type.
            let fileName = "image" + x.toString() + "." + extension; //forming image name
            // console.log({ fileName, imageBuffer });
            fs.writeFileSync(path.join(dirName, fileName), imageBuffer, 'utf8'); //Save images
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