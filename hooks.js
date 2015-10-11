/**
 * registerHooks
 * @see Plugins
 * @return string
 */
function registerHooks(config, user, utils) {
  return {
    //hooking on directory
    directory: function(tree, path) {
      var l = tree.length
      var found = false

      //searches for a .rar|.r{00.999} in the tree
      while(l-- && !found) {
        var e = tree[l]

        if(!e) {
          continue; 
        }

        if(/^\.(rar|r[0-9]{2,})$/.test(e.ext)) {
          found = true
        }
      }

      if(found === false)
        return '' //don't polute view
      
      return '<dd><a href="/p/unrar?path='+path+'">Unrar</a></dd>'
    }
  }
}

module.exports = registerHooks
