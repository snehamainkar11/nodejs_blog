const express = require('express');
const router = express.Router();

let Blog = require('../models/blog');
let User = require('../models/user');

//Add Blog
router.get('/add',ensureAuthenticated, function(req,res){
    res.render('add_blog',{
      title:"Add Blog"
    });
  })
  
  //Submit blog
router.post('/add',function(req,res){
  
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('add_blog', {
        title:'Add Blog',
        errors:errors
      });
    } else {
      let blog=new Blog();
      blog.title=req.body.title;
      blog.author = req.user._id;
      blog.body = req.body.body;

      blog.save(function(err){

      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Blog Added');
        res.redirect('/');
      }
    });
  }
});
 
//Update get Blog Route
router.get('/edit/:id',ensureAuthenticated,  function(req, res){
      Blog.findById(req.params.id, function(err, blog){
        if(blog.author != req.user._id){
          req.flash('danger', 'Not Authorized');
          return res.redirect('/');
        }
        res.render('edit_blog', {
          title:'Edit Blog',
          blog:blog
        });
      });
});
  
   
//Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let blog = {};
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.body = req.body.body;
  
    let query = {_id:req.params.id}
  
    Blog.updateOne(query, blog, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Blog Updated');
        res.redirect('/');
      }
    });
});
  
  
  // Delete Blog
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }
    let query = {_id:req.params.id}

  Blog.findById(req.params.id, function(err, blogs){
    if(blogs.author != req.user._id){
      res.status(500).send();
    } else {
          Blog.remove(query, function(err){
          if(err){
            console.log(err);
          }
          req.flash('success','Blog Deleted');
          res.send('Success');
        });
      }
    });
  });


 //view single Blog
 router.get('/:id', function(req, res){
  Blog.findById(req.params.id, function(err, blogs){
    User.findById(blogs.author, function(err, user){
      res.render('blogs', {
        blogs:blogs,
        author:user.name
      });
    });
  });
});

    function ensureAuthenticated(req, res, next){
      if(req.isAuthenticated()){
        return next();
      } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
      }
    }
module.exports=router;