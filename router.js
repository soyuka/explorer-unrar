/**
 * unrarRouter
 * @param Express.Router router
 * @param object utils explorer utils (see https://github.com/soyuka/explorer/blob/master/Plugins.md 
 */
function unrarRouter(router, utils) {
  var HTTPError = utils.HTTPError

  function unrarPath(req, res, next) {
    utils.interactor.ipc.send('call', 'unrar.create', req.user, req.query.path)

    //explorer is adding a notification with info
    return res.handle('back', {info: 'Unrar launched'}, 201)
  }

  router.get('/plugin/unrar', utils.prepareTree, unrarPath)

  return router
}

module.exports = unrarRouter
