var express = require('express');
const { getPhoneCard, handleBuyPhoneCard, getPhonecardByUser, getNetworkProviderFee } = require('../controllers/phone_card.controller');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

router.get('/phone-card', getPhoneCard)
router.post('/phone-card', handleBuyPhoneCard)
router.get('/phonecard/api',getPhonecardByUser)
router.get('/phone-card/fee?', getNetworkProviderFee)

module.exports = router;
