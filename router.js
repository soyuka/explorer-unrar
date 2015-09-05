var Spawner = require('promise-spawner')
var spawner = new Spawner()
var fs = require('fs')

function unrarRouter(app, utils) {
  var HTTPError = utils.HTTPError

  function unrarPath(req, res, next) {
    utils.interactor.ipc.send('call', 'unrar.create', req.user, req.query.path)

    return res.handle('back', {info: 'Unrar launched'}, 201)
  }

  app.get('/plugin/unrar', utils.prepareTree, unrarPath)
}

export default unrarRouter
