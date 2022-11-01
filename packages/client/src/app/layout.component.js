import React from 'react';
import { LeftMenuComponent } from "./";
import { Element } from "react-scroll";

export const Layout = ({ children }) => <>
  <aside id="leftMenu">
    <LeftMenuComponent />
  </aside>
  <aside id="mainView">
    <Element name={`mainView`}>
      {children}
    </Element>
  </aside>
</>;