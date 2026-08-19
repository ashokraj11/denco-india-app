import { Link, useLocation } from 'react-router-dom';

// In-page anchors like "#services" only work while already on the page that
// owns those section ids (Home) -- elsewhere (e.g. /careers) the hash just
// updates the URL with nothing to scroll to. This renders a plain anchor on
// Home (native/JS smooth scroll takes over, see useSmoothAnchorScroll) or a
// router Link to "/#services" anywhere else, so Home mounts first and then
// scrolls to the section itself.
export default function HashLink({ href, children, ...rest }) {
  const { pathname } = useLocation();
  if (pathname === '/') {
    return <a href={href} {...rest}>{children}</a>;
  }
  return <Link to={`/${href}`} {...rest}>{children}</Link>;
}
