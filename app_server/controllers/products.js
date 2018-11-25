var Pro = require('../../app_api/models/product');

module.exports.products = function(req, res, next) {
    if(req.params && req.params.category) {
      var category = req.params.category;
      Pro
        .find({category : category})
        .exec(function(err,products) {
          if(!products){
              res.json({"message" : "no products in this category found"});
            return;
          }
          else if (err){
            res.json({"message" : "category not found"});
            return;
          }
          var ProductChunk = [];
          var chunkSize = 4;
          for(var i = 0; i < products.length ; i+=chunkSize){
            ProductChunk.push(products.slice(i, i+chunkSize));
          }
          res.render('shop/productByCategory', {title: 'Techifier Kart' , products: ProductChunk, category: category});
        });
      } else{
        res.json({"message" : "No category in request"});
        }
    
};

module.exports.deleteReview = function(req, res, next) {
  if(req.user != null ){
    if(req.params && req.params.productid) {
      Pro
        .findById(req.params.productid)
        .exec(function(err,product) {
          var thisReview;
          if(!product){
              res.json({"message" : "productid not found"});
            return;
          }
          else if (err){
            res.json({"message" : "productid not found"});
            return;
          }
          if(product.reviews && product.reviews.length > 0){
            thisReview = product.reviews.id(req.params.reviewid);
            if(!thisReview){
              res.json({"message": "Review Id not found"});
              return;
            }
            else{
              product.reviews.id(req.params.reviewid).remove();
              product.save(function(err,product){
                if(err){
                  res.json({"message": err});
                }
                else{
                  res.redirect('/');
                }
              });
            }
            
          }
        });
      } else{
        res.json({"message" : "No productid in request"});
        }
  }
  else{
    console.log(req.user);
    var messages = [];
    messages.push("Login First then proceed to Edit a review");
    req.flash('error' , messages);
    res.redirect('/user/signin');
  }
};

module.exports.editReviewPage = function(req, res, next) {
  if(req.user != null ){
    if(req.params && req.params.productid) {
      Pro
        .findById(req.params.productid)
        .exec(function(err,product) {
          var thisReview;
          if(!product){
              res.json({"message" : "productid not found"});
            return;
          }
          else if (err){
            res.json({"message" : "productid not found"});
            return;
          }
          if(product.reviews && product.reviews.length > 0){
            thisReview = product.reviews.id(req.params.reviewid);
            if(!thisReview){
              res.json({"message": "Review Id not found"});
              return;
            }
            else{
              res.render('shop/editReview', {product: product, csrfToken: req.csrfToken(), review: thisReview});
            }
            
          }
        });
      } else{
        res.json({"message" : "No productid in request"});
        }
  }
  else{
    console.log(req.user);
    var messages = [];
    messages.push("Login First then proceed to Edit a review");
    req.flash('error' , messages);
    res.redirect('/user/signin');
  }
};
module.exports.editReview = function(req, res, next) {
  if(req.user != null ){
    if(req.params && req.params.productid) {
      Pro
        .findById(req.params.productid)
        .exec(function(err,product) {
          var thisReview;
          if(!product){
              res.json({"message" : "productid not found"});
            return;
          }
          else if (err){
            res.json({"message" : "productid not found"});
            return;
          }
          if(product.reviews && product.reviews.length > 0){
            thisReview = product.reviews.id(req.params.reviewid);
            if(!thisReview){
              res.json({"message": "Review Id not found"});
              return;
            }
            else{
              thisReview.reviewText = req.body.productReview;
              thisReview.rating = req.body.starRating;
              product.save(function(err,product){
                if(err){
                  res.json({"message": err});
                }
                else{
                  res.redirect('/');
                }
              });
            }
            
          }
        });
      } else{
        res.json({"message" : "No productid in request"});
        }
  }
  else{
    console.log(req.user);
    var messages = [];
    messages.push("Login First then proceed to Edit a review");
    req.flash('error' , messages);
    res.redirect('/user/signin');
  }
};

module.exports.productsaddreview = function(req, res, next) {
  if(req.user != null ){
    if(req.params && req.params.productid) {
      Pro
        .findById(req.params.productid)
        .exec(function(err,product) {
          if(!product){
              res.json({"message" : "productid not found"});
            return;
          }
          else if (err){
            res.json({"message" : "productid not found"});
            return;
          }
          else{
            doAddReview(req,res,product);
            return next();
          }
        });
      } else{
        res.json({"message" : "No productid in request"});
        return;
        }
  }
  else{
    console.log(req.user);
    var messages = [];
    messages.push("Login First then proceed to writing a review");
    req.flash('error' , messages);
    res.redirect('/user/signin');
  }
  
};

module.exports.updateRating = function(req, res, next) {
  if(req.user != null ){
    if(req.params && req.params.productid) {
      Pro
        .findById(req.params.productid)
        .exec(function(err,product) {
          if(!product){
            res.json({"message" : "productid not found"});
            return;
          }
          else if (err){
            res.json({"message" : "productid not found"});
            return;
          }
          else{
            updateAverageRating(req,res,product,req.body.starRating,1,false,next);
          }
        });
      } else{
        res.json({"message" : "No productid in request"});
        return;
        }
  }
  else{
    console.log(req.user);
    var messages = [];
    messages.push("Login First then proceed to writing a review");
    req.flash('error' , messages);
    res.redirect('/user/signin');
  }
  
};

module.exports.productsreadone = function(req, res){
  if(req.params && req.params.productid) {
    Pro
      .findById(req.params.productid)
      .exec(function(err,product) {
        if(!product){
            res.json({"message" : "productid not found"});
          return;
        }
        else if (err){
          res.json({"message" : "productid not found"});
          return;
        }
        var specs = [];
        var reviews = [];
        var haveReviews = 0;
        var haveSpecs = 0;
        if(product.specs != "Null")
        {
          haveSpecs = 1;
          specs = (product.specs).split(".");
        }
        if(product.reviews.length != 0)
        {
          reviews = product.reviews;
          haveReviews = 1;
        }
        res.render('shop/products',{product:product , haveSpecs: haveSpecs , specs:specs , haveReviews , reviews: reviews, csrfToken: req.csrfToken(), req: req});
      });
    } else{
      res.json({"message" : "No productid in request"});
      return;
      }
  };

  var doAddReview = function(req,res,product){
    product.reviews.push({
      author: req.user.fname+" "+req.user.lname,
      authorId: req.user._id,
      rating: req.body.starRating,
      reviewText: req.body.productReview
    });
    product.save(function(err,product){
      if(err){
        res.json({"error": "Error adding Review"});
        return;
      }
      return;
    });
  };
  var updateAverageRating = function(req,res,product, userRating , check , flag, next){
        var currentRating = 0;
        if(product.reviews.length > 0)
        {
          for(review in product.reviews){
            currentRating += review.rating;
          } 
          
          if(flag == true){
            currentRating -= userRating;
          }
          else{
            currentRating += userRating;
          }
          //for edit review only
          if(check == 0){
            currentRating -= (userRating*2);
            currentRating += req.body.starRating;
          }
          product.rating = currentRating/(product.reviews.length+check);
        }
        else{
          product.rating = userRating;
        }
        console.log(product._id);
        product.save(function(err,product){
          if(err){
            res.json({"error": "Error updating Rating"});
            return;
          }
        });
        res.redirect('/product/view/'+product._id);
        return next();
  };
  