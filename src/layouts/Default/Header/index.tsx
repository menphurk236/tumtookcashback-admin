import { Fragment, useEffect, useState } from "react";

import clsx from "clsx";
import { Link } from "react-router-dom";

import Container from "@/components/Container";
import { Logo, SvgIcon } from "@/components/UI";
import MenuItems from "@/components/Navbar/MenuItems.tsx";

import { menuItems } from "./menuItems";

const Header = () => {
  const [width, setWindowWidth] = useState(0);
  const [open, setOpen] = useState(false);
  const [openResponsive, setOpenResponsive] = useState([
    { key: 0, status: false },
    { key: 1, status: false },
    { key: 2, status: false },
    { key: 3, status: false },
  ]);
  const [openResponsiveProduct, setOpenResponsiveProduct] = useState([
    { key: 0, status: false },
    { key: 1, status: false },
    { key: 2, status: false },
  ]);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const responsive = width > 1023;

  function handleSetOpenResponsiveProduct(index) {
    const newStatus = openResponsiveProduct.map((c, i) => {
      if (i === index) {
        return {
          key: i,
          status: !c.status,
        };
      } else {
        return c;
      }
    });
    setOpenResponsiveProduct(newStatus);
  }

  function handleSetOpenResponsive(index) {
    const newStatus = openResponsive.map((c, i) => {
      if (i === index) {
        return {
          key: i,
          status: !c.status,
        };
      } else {
        return c;
      }
    });
    setOpenResponsive(newStatus);
  }

  return (
    <Fragment>
      <header className={clsx(`fixed top-0 z-20 w-full`)}>
        {open && (
          <Container
            style={{ backgroundColor: "#ee1e25" }}
            className={clsx(
              `main-space-x fixed w-screen bg-red-500 py-4 h-screen`
            )}
          >
            <div className={clsx(`flex justify-end`)}>
              <SvgIcon
                onClick={() => setOpen(false)}
                name="close"
                className={clsx(`h-8 w-8 cursor-pointer p-1 text-white-900`)}
              />
            </div>
            <div className={clsx(`flex flex-col`)}>
              {menuItems.map((menu, index) => {
                return (
                  <div>
                    <div
                      className={clsx(
                        `w-100 relative my-2 flex items-center justify-center`
                      )}
                    >
                      <div className={`text-white-900`} key={index}>
                        {menu.url ? (
                          <a href={menu.url}>{menu.title}</a>
                        ) : (
                          menu.title
                        )}
                      </div>
                      {menu.submenu && (
                        <div className={`absolute right-0`}>
                          <SvgIcon
                            onClick={() => handleSetOpenResponsive(index)}
                            name="arrow-down"
                            className={clsx(
                              `h-8 w-8 cursor-pointer p-1 text-white-900`,
                              openResponsive.find((itemResponse) => {
                                return itemResponse.key === index;
                              })?.status && `rotate-180`
                            )}
                          />
                        </div>
                      )}
                    </div>
                    {openResponsive.find((itemResponse) => {
                      return itemResponse.key === index;
                    })?.status &&
                      menu.submenu && (
                        <>
                          {menu.submenu.map((item, key) => {
                            return item.submenu ? (
                              <div className={clsx(`bg-white-900`)} key={key}>
                                <div
                                  className={clsx(
                                    `w-100 relative flex items-center justify-center bg-white-900`
                                  )}
                                >
                                  <div className={clsx(`font-bold`)}>
                                    {item.title}
                                  </div>
                                  <div className={`absolute right-0`}>
                                    <SvgIcon
                                      onClick={() =>
                                        handleSetOpenResponsiveProduct(key)
                                      }
                                      name="arrow-down"
                                      className={clsx(
                                        `h-8 w-8 cursor-pointer p-1 text-red-600`,
                                        openResponsiveProduct.find(
                                          (itemResponse) => {
                                            return itemResponse.key === key;
                                          }
                                        )?.status && `rotate-180`
                                      )}
                                    />
                                  </div>
                                </div>
                                {openResponsiveProduct.find((itemResponse) => {
                                  return itemResponse.key === key;
                                })?.status &&
                                  item.submenu.map((itemSub, keySub) => {
                                    return (
                                      <div
                                        className={clsx(
                                          `flex justify-center hover:text-red-600`
                                        )}
                                        key={keySub}
                                      >
                                        <a href={itemSub.url}>
                                          {itemSub.title}
                                        </a>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              <div
                                className={clsx(
                                  `w-100 relative flex items-center justify-center bg-white-900 font-bold hover:text-red-600`
                                )}
                              >
                                <a href={item.url}>{item.title}</a>
                              </div>
                            );
                          })}
                        </>
                      )}
                    <hr className={clsx(``)} />
                  </div>
                );
              })}
            </div>
          </Container>
        )}
        <div style={{ backgroundColor: "#ee1e25" }}>
          <Container
            className={clsx(
              `main-space-x  flex items-center justify-between py-1`
            )}
          >
            <Logo type="white" className={clsx(`w-[180px]`, `sm:w-[100px]`)} />

            {responsive ? (
              <ul className="menus text-2xl font-black">
                {menuItems.map((menu, index) => {
                  const depthLevel = 0;
                  return (
                    <MenuItems
                      items={menu}
                      key={index}
                      depthLevel={depthLevel}
                    />
                  );
                })}
              </ul>
            ) : (
              <div>
                <SvgIcon
                  onClick={() => setOpen(true)}
                  name="menu"
                  className={clsx(
                    `h-8 w-8 cursor-pointer rounded border-2 border-white-900 p-1 text-white-900`
                  )}
                />
              </div>
            )}
          </Container>
        </div>
        <Container className={clsx(`main-space-x  flex justify-end py-4`)}>
          <Link to="/login">
            {/*<span className={clsx(`text-white-900 underline`)}>สำหรับผู้ดูแลระบบ</span>*/}
            <span>สำหรับผู้ดูแลระบบ</span>
          </Link>
        </Container>
      </header>
    </Fragment>
  );
};

export default Header;
