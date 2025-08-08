/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// uuid is a library for generating unique id
import { v4 as uuidv4 } from "uuid";

// Kanban application components

const boards = {
  columns: [
    {
      id: uuidv4(),
      title: "Orders",
      cards: [
        {
          id: uuidv4(),
          template: "Bays",
        },
        {
          id: uuidv4(),
          template: "Zone",
        },
        {
          id: uuidv4(),
          template: "Racks",
        },
        {
          id: uuidv4(),
          template: "Building",
        },
        {
          id: uuidv4(),
          template: "Floor",
        },
      ],
    },
  ],
};

export default boards;
