window.onload = () => {
  let navbar = document.body.querySelector('u-navbar'),
    toast = document.body.querySelector('u-toast'),
    search = document.body.querySelector('u-search');

  /* TODO: SLIDE 82 */

  //set listeners for page clicks and navbar menu button
  if (!!navbar || !!toast)
    document.body.addEventListener('click', (e) => {
      //get cross-platform compatible event path
      let path =
        e.composed && e.composedPath
          ? e.composedPath()
          : e.path
          ? e.path
          : e.originalTarget
          ? [e.originalTarget]
          : [e.target];

      let src = path[0];
      let link = src.tagName == 'A' ? src : src.closest('a');
      let button = src.tagName == 'BUTTON' ? src : src.closest('button');
      let id = navbar ? navbar.getAttribute('id') : false;
      if (!!link) {
        e.preventDefault();
        toast.show('Link Clicked', link.textContent);
      } else if (!!button && !!id && button.getAttribute('controls') == id) {
        navbar.expanded = !navbar.expanded;
      }
    });
};
