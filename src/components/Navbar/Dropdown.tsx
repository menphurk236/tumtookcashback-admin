import MenuItems from './MenuItems'
const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  // eslint-disable-next-line no-param-reassign
  depthLevel = depthLevel + 1
  const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : ''
  return (
    <ul className={`dropdown-navbar ${dropdownClass} ${dropdown ? 'show' : ''}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
  )
}

export default Dropdown
