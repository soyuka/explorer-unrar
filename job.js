var Spawner = require('promise-spawner')
var spawner = new Spawner()
var p = require('path')
var eol = require('os').EOL

/**
 * UnrarJob
 * @param IPCEE ipc our process communication instance
 */
function UnrarJob(ipc) {
  if(!(this instanceof UnrarJob)) { return new UnrarJob(ipc) }
  this.ipc = ipc
}

/**
 * Create 
 * Launch unrar
 * We're calling unrar.create in the router with user and path
 * @param User user
 * @param string path
 */
UnrarJob.prototype.create = function(user, path, cb) {
  var self = this
  
  //Notify user that we've started
  self.ipc.send('unrar:notify', user.username, {
    message: 'Unrar launched in '+path
  })

  //We could easily support progress here
  //by using:
  //stderr: readStream(fn()) + check for [0-9]{1-3}%
  spawner.spawn('unrar e -ierr -or .', {cwd: path})
  .then(function() {
    var from, to

    var data = this.data.err.map(function(e) {
      return e.split(eol)
    })

    data = [].concat.apply([], data)

    //Dirty parsing command to get what we need
    //using a stream would be prettier
    for(var i in data) {
      if(from && to)
        break;

      data[i] = data[i].replace(eol, '').trim()

      if(/^Extracting from/.test(data[i])) {
        from = data[i].replace('Extracting from ', '').trim()
      } else if(/^Extracting /.test(data[i])) {
        to = data[i].replace(/Extracting\s+|OK|\d{2,}%|[\b]/g, '').trim()
      }
    }

    self.ipc.send('unrar:notify', user.username, {
      message: path+' extracted from '+from+' to '+to,
      path: path, 
      search: to
    })

    return cb ? cb() : null
  })
  .catch(function(err) {
    //Handling javascript errors
    if(err instanceof Error) {
      self.ipc.send('unrar:notify', user.username, {error: err.message})
    //Handling unrar errors
    } else {
      self.ipc.send('unrar:notify', user.username, {
        message: this.data.err.join(eol), error: true
      })
    }
  })
}

module.exports = UnrarJob
