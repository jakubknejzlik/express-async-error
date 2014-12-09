var domain = require('domain');

module.exports.Handler = function(req,res,next){
    var d = domain.create();

    d.on('error',next)

    d.run(function(){
        next();
    })
}