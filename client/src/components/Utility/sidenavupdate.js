

import { useEffect, useState } from "react";
import { useSoftUIController, setMiniSidenav, setLayout, setTransparentSidenav } from "context";
import { useLocation } from "react-router-dom";

const sideNavUpdate = () =>{

    const [controller, dispatch] = useSoftUIController();
    const { miniSidenav, sidenavColor,layout } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const { pathname } = useLocation();
  
      useEffect(() => {
         setLayout(dispatch, "settings");
         setTransparentSidenav(dispatch, false);
        }, [pathname]);

};

export default sideNavUpdate;