/**
 * registerHooks
 * @param object locals explorer locals (see https://github.com/soyuka/explorer/blob/master/Plugins.md)
 * @param object config explorer configuration
 * @return string
 */
function registerHooks(config) {
  return {
    //hooking on directory
    directory: function(tree) {
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
      
      //Directory hook wants a <dd> element, adding our route
      return '<dd><a href="/p/unrar?path='+e.dirname+'">Unrar</a></dd>'
    }
  }
}

module.exports = registerHooks
