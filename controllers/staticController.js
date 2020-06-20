const home = function(req, res, next){
    res.json({
        message: "Heelo"
    })
}

module.exports = { 
    home
}