var Spawner = require('promise-spawner')
var spawner = new Spawner()
var p = require('path')
var eol = require('os').EOL

/**
 * UnrarJob
 * @param IPCEE ipc our process communication instance
 * @param Stat stat the Stat used for notifications
 */
function UnrarJob(ipc, stat) {
  if(!(this instanceof UnrarJob)) { return new UnrarJob(ipc, stat) }
  this.ipc = ipc
  this.stat = stat
}

/**
 * Create 
 * Launch unrar
 * We're calling unrar.create in the router with user and path
 * @param User user
 * @param string path
 */
UnrarJob.prototype.create = function(user, path) {
  var self = this
  
  //Notify user that we've started
  self.stat.add(user.username, {message: 'Unrar launched in '+path, name: p.basename(path)})

  //We could easily support progress here
  //by using:
  //stderr: readStream(fn()) + check for [0-9]{1-3}%
  spawner.spawn('unrar e -ierr -or .', {cwd: path})
  .then(function() {
    var from, to
    var data = this.data.err

    //Dirty parsing command to get what we need
    //using a stream would be prettier
    for(var i in data) {
      if(from && to)
        break;

      data[i] = data[i].replace(eol, '').trim()

      if(/^Extracting from/.test(data[i])) {
        from = data[i].replace('Extracting from ', '').trim()
      } else {
        var matches = data[i].match(/^Extracting[\s]+([^\s].\S+).+/)
        if(matches) {
          to = matches[1]
        }
      }
    }

    //Notify user it's good to go!
    return self.stat.add(user.username, {message: path+' extracted from '+form+' to '+to, path: path, name: to})
  })
  .catch(function(err) {
    self.ipc.send('error', this.data.err.join(eol))

    //Handling javascript errors
    if(err instanceof Error) {
      return self.stat.add(user.username, {error: err.message})
    //Handling unrar errors
    } else {
      return self.stat.add(user.username, {error: this.data.err.join(eol)})
    }
  })
}

/**
 * Called to get unrar notifications
 */
UnrarJob.prototype.info = function() {
  return this.stat.get()
}

/**
 * Called to remove unrar notifications
 */
UnrarJob.prototype.clear = function(user) {
  return this.stat.remove(user)
}

module.exports = UnrarJob
