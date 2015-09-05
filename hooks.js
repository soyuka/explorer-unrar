/**
 * registerHooks
 * @param object locals explorer locals (see https://github.com/soyuka/explorer/blob/master/Plugins.md)
 * @param object config explorer configuration
 */
function registerHooks(locals, config) {
  return {
    //hooking on directory
    directory: function() {
      let tree = locals.tree
      let l = locals.tree.length
      let found = false

      //searches for a .rar|.r{00.999} in the tree
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
        return '' //don't polute view
      
      //Directory hook wants a <dd> element, adding our route
      return '<dd><a href="plugin/unrar?path='+locals.path+'">Unrar</a></dd>'
    }
  }
}

module.exports = registerHooks
