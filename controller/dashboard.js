var Warehouse = require('../models/warehouse');
var OtherD = require('../models/otherd');
var FabricD = require('../models/fabricd');
var FinishD = require('../models/finishd');
var FactoryD = require('../models/factoryd');
var OutPlaceD = require('../models/outplaced');
var ReceivePlaceD = require('../models/receiveplace');
var FabricTypeD = require('../models/fabrictype');
var BuyerD = require('../models/buyer');
var Const = require('../config/const');

exports.index = function(req, res){
  res.render('dashboard/index');
}

exports.manage = function(req, res) {
  var l_factory, l_outplace, l_receiveplace;
  var all_promises = [];
  all_promises.push(
    new Promise((resolve, reject) => {
      FactoryD.getA(function(err, result) {
        if(err) {
          l_factory = [];
        } else {
          l_factory = result;
        }
        resolve();
      })
    })
  );
  all_promises.push(
    new Promise((resolve, reject) => {
      OutPlaceD.getA(function(err, result) {
        if(err) {
          l_outplace = [];
        } else {
          l_outplace = result;
        }
        resolve();
      })
    })
  );
  all_promises.push(
    new Promise((resolve, reject) => {
      ReceivePlaceD.getA(function(err, result) {
        if(err) {
          l_receiveplace = [];
        } else {
          l_receiveplace = result;
        }
        resolve();
      })
    })
  );
  Promise.all(all_promises).then(()=> {
    res.render('dashboard/manage', {l_factory: l_factory, l_outplace: l_outplace, l_receiveplace: l_receiveplace});
  })  
}

exports.add_warehouse = function(req, res) {
  Warehouse.addWarehouse(req.body, function(err, b) {
    if(err) {
      res.json({status: 0});
    } else {      
      res.json({status: b?1:0});
    }
  })  
}

exports.load_warehouse = function(req, res) {
  Warehouse.allWarehouse(function(err, result) {
    if(err) {
      res.json({status: 0});
    } else {
      res.json({status: 1, list: result});
    }
  })
}

exports.update_warehouse = function(req, res) {
  Warehouse.updateWarehouse(req.body, function(err) {
    if(err) {
      res.json({status: 0});
    } else {
      res.json({status: 1});
    }
  })
}

exports.delete_warehouse = function(req, res) {
  Warehouse.removeWarehouse(req.body.idx, function(err) {
    if(err) {      
      res.json({status: 0});
    } else {
      switch(req.body.type) {
        case 'T':
          FabricD.remove(req.body.refno, function(err) {
            if(err) {
              res.json({status: 2})
            } else {
              res.json({status: 1});
            }
          })
          break;
        case 'F':
          FinishD.remove(req.body.refno, function(err) {
            if(err) {
              res.json({status: 2});
            } else {
              res.json({status: 1});
            }
          })
          break;
        case 'O':
          OtherD.remove(req.body.refno, function(err) {
            if(err) {
              res.json({status: 2});
            } else {
              res.json({status: 1});
            }
          })
          break;
      }
    }
  })
}

exports.detail = function(req, res) {
  var id = req.query.id;
  var type = req.query.type;
  switch(type) {
    case 'T':
      var l_fabrictype, l_buyer;
      var all_promises = [];
      all_promises.push(
        new Promise((resolve, reject) => {
          FabricTypeD.getA(function(err, result) {
            if(err) {
              l_fabrictype = [];
            } else {
              l_fabrictype = result;
            }
            resolve();
          })
        })
      )
      all_promises.push(
        new Promise((resolve, reject) => {
          BuyerD.getA(function(err, result) {
            if(err) {
              l_buyer = [];
            } else {
              l_buyer = result;
            }
            resolve();
          })
        })
      )
      Promise.all(all_promises).then(() => {
        FabricD.get(id, function(err, result) {
          if(err) {
            res.redirect('/dashboard');
          } else {
            if(result.length == 0) {
              res.render('dashboard/empty');
            } else {
              res.render('dashboard/detail1', {data: result[0], l_fabrictype: l_fabrictype, l_buyer: l_buyer, l_movestatus: Const.movestatus});
            }
          }
        })
      })
      
      break;
    case 'F':
      FinishD.get(id, function(err, result) {
        if(err) {
          res.redirect('/dashboard');
        } else {
          if(result.length == 0) {
            res.render('dashboard/empty');
          } else {
            res.render('dashboard/detail2', {data: result[0], l_movestatus: Const.movestatus});
          }
        }
      })
      break;
    case 'O':
      OtherD.get(id, function(err, result) {
        if(err){
          res.redirect('/dashboard');
        } else {
          if(result.length == 0) {
            res.render('dashboard/empty');
          } else {
            res.render('dashboard/detail3', {data: result[0], l_movestatus: Const.movestatus});
          }
        }
      })
      break;
  }
}

exports.detail_update = function(req, res) {
  var type = req.body.type;
  switch(type) {
    case 'T':
      FabricD.update(req.body, function(err) {
        if(err) {
          res.json({status: 0});
        } else {
          res.json({status: 1});
        }
      })
      break;
    case 'F':
      FinishD.update(req.body, function(err) {
        if(err) {
          res.json({status: 0});
        } else {
          res.json({status: 1});
        }
      })
      break;
    case 'O':
      OtherD.update(req.body, function(err) {
        if(err) {
          res.json({status: 0});
        } else {
          res.json({status: 1});
        }
      })
      break;
  }
}

exports.read_qr = function(req, res) {
  res.render('dashboard/read');
}