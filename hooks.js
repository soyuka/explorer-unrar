function registerHooks(locals, config) {
  return {
    directory: function() {
      let tree = locals.tree
      let l = locals.tree.length
      let found = false

      while(l-- && !found) {
        var e = locals.tree[l]

        if(!e) {
          continue; 
        }

        if(/^\.(rar|r[0-9]{2,})$/.test(e.ext)) {
          found = true
        }
      }

      if(found === false)
        return ''
      
      return '<dd><a href="plugin/unrar?path='+locals.path+'">Unrar</a></dd>'
    }
  }
}

module.exports = registerHooks
