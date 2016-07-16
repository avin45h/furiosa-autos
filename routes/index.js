var express = require('express');
var router = express.Router();
var api = require('../lib/api');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

/*
 * Task 1:
 * Make models alphabetically sortable (ascending, descending, default)
 */

router.get('/models', function (req, res, next) {
    api.fetchModels().then(function (models) {
        switch (req.query.type) {
            case 'alpha_asc':
                models = models.sort();
                break;
            case 'alpha_desc':
                models = models.sort().reverse();
                break;
        }
        res.render('models', {models: models});
    })

});

/*
 * Task 2:
 * Make services filterable by type (repair, maintenance, cosmetic)
 */
router.all('/services', function (req, res, next) {
    // use api to get services and render output
    // use api to get models and render output
    var types = ["all","cosmetic","repair","maintenance"];
    var requiredType = req.body.type;
    // Checking and resetting required Type if someone sends in wrong type deliberately
    requiredType =  types.indexOf(requiredType) > -1 ? requiredType : "all";

    api.fetchServices().then(function (services) {
        if (requiredType !== "all") {
            services = services.filter(function (d) {
                return (d.type === req.body.type);
            });
        }
        res.render('services', {services: services, opt: req.body.type || "", types: types});
    });
});

/*
 * Task 3:
 * Bugfix: Something prevents reviews from being rendered
 * Make reviews searchable (content and source)
 */
router.all('/reviews', function (req, res, next) {
    return Promise.all([api.fetchCustomerReviews(), api.fetchCorporateReviews()])
        .then(function (reviews) {
            reviews = reviews[0].concat(reviews[1]);
            if (req.body.q) {
                reviews = reviews.filter(function (d) {
                    return (d.content.indexOf(req.body.q) > -1 || d.source.indexOf(req.body.q) > -1);
                });
            }
            res.render('reviews', {reviews: reviews, searchStr: req.body.q});
        });
});

module.exports = router;
