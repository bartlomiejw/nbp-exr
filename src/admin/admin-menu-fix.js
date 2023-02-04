// @ts-ignore
const menuFix = (slug) =>{
  const currentUrl  = window.location.href
  const isLocal     = currentUrl.indexOf('admin.html') > 0
  const menuRoot    = document.querySelector(isLocal ? '.wp-menu-open' : `#toplevel_page_${slug}`)

  const currentPath = currentUrl.substr(currentUrl.indexOf(isLocal ? '#/' : 'admin.php'))

  if (menuRoot) {
    menuRoot.addEventListener('click', function (e) {
      const target  = e.target
      const myItems = this.querySelectorAll('li')
      for (let i = 0; i < myItems.length; i++) {
        let  node = myItems[i];
        if (node !== e.target.parentElement) {
          node.classList.remove('current')
        } else {
          target.parentElement.classList.add('current')
        }
      }
    })

    // remove all current
    const items = menuRoot.querySelectorAll(`.current`)
    for (let i = 0; i < items.length; i++) {
      let node = items[i];
      node.classList.remove('current')
    }

    let menu = menuRoot.querySelector(`.wp-submenu a[href="${currentPath}"`)

    if (! isLocal && currentPath.endsWith('#/')) {
      menu = menuRoot.querySelector(`.wp-submenu a.wp-first-item`)
    }

    if (menu) {
      console.log(menu)
      menu.parentElement.classList.add('current')
    }
  }
}

export default menuFix
