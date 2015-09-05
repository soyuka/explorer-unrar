var Spawner = require('promise-spawner')
var spawner = new Spawner()
var fs = require('fs')

/**
 * unrarRouter
 * @param Express app our app instances
 * @param object utils explorer utils (see https://github.com/soyuka/explorer/blob/master/Plugins.md 
 */
function unrarRouter(app, utils) {
  var HTTPError = utils.HTTPError

  function unrarPath(req, res, next) {
    utils.interactor.ipc.send('call', 'unrar.create', req.user, req.query.path)

    //explorer is adding a notification with info
    return res.handle('back', {info: 'Unrar launched'}, 201)
  }

  app.get('/plugin/unrar', utils.prepareTree, unrarPath)
}

export default unrarRouter
