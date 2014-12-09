var express = require('express');
var request = require('request');
var assert = require('assert');

var middleware = require('../')

var port = 60000;
var url = 'http://localhost:' + port;

describe('express testing',function(){
    before(function(done){
        var app = new express();

        app.get('/',function(req,res,next){
            res.send('works!');
        })

        app.get('/error/sync',function(req,res,next){
            throw new Error('sync error');
        })

        app.get('/error/async',middleware.Handler,function(req,res,next){
            setTimeout(function(){
                throw new Error('async error');
            },500)
        })

        app.use(function(err,req,res,next){
            res.status(400).send(err.message);
        })

        app.listen(port,done)
    })

    it('should receive response from app',function(done){
        request.get(url,function(error,response,data){
            assert.equal(response.statusCode,200);
            assert.equal(data,'works!');
            done();
        })
    })

    it('should catch sync error without middleware',function(done){
        request.get(url + '/error/sync',function(error,response,data){
            assert.equal(response.statusCode,400);
            assert.equal(data,'sync error');
            done();
        })
    })

    it('should catch ssync error with middleware as well',function(done){
        request.get(url + '/error/async',function(error,response,data){
            assert.equal(response.statusCode,400);
            assert.equal(data,'async error');
            done();
        })
    })
})