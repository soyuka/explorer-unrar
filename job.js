var Spawner = require('promise-spawner')
var spawner = new Spawner()
var p = require('path')
var eol = require('os').EOL

function UnrarJob(ipc = null, stat) {
  if(!(this instanceof UnrarJob)) { return new UnrarJob(ipc, stat) }
  this.ipc = ipc
  this.stat = stat
}

UnrarJob.prototype.create = function(user, path) {
  var self = this
  
  self.stat.add(user.username, {message: `Unrar launched in ${path}`, name: p.basename(path)})

  //We could easily support progress here
  //by using:
  //stderr: readStream(fn()) + check for [0-9]{1-3}%
  spawner.spawn('unrar e -ierr -or .', {cwd: path})
  .then(function() {
    var from, to
    var data = this.data.err

    for(var i in data) {
      if(from && to)
        break;

      data[i] = data[i].replace(eol, '').trim()

      console.log(data[i]);
      if(/^Extracting from/.test(data[i])) {
        from = data[i].replace('Extracting from ', '').trim()
      } else {
        var matches = data[i].match(/^Extracting[\s]+([^\s].\S+).+/)
        if(matches) {
          to = matches[1]
        }
      }
    }

    return self.stat.add(user.username, {message: `${path} extracted from ${from} to ${to}`, path: path, name: to})
  })
  .catch(function(err) {
    self.ipc.send('unrar.error', this.data.err.join(' '))

    if(err instanceof Error) {
      return self.stat.add(user.username, {error: err.message})
    } else {
      return self.stat.add(user.username, {error: this.data.err.join(eol)})
    }
  })
}

UnrarJob.prototype.info = function() {
  return this.stat.get()
}

UnrarJob.prototype.clear = function(user) {
  return this.stat.remove(user)
}

module.exports = UnrarJob
