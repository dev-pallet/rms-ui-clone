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
import { v4 as uuidv4 } from 'uuid';

// Kanban application components

// Images


const boards = {
  columns: [
    {
      id: uuidv4(),
      title: 'Packages, Not Shipped',
      cards: [
        {
          id: uuidv4(),
          template: 'Change me to change title',
        },
        {
          id: uuidv4(),
          template: 'Drag me to \'In progress\' section',
        },
       
      ],
    },
    {
      id: uuidv4(),
      title: 'Shipped Packages',
      cards: [
        {
          id: uuidv4(),
          template: 'Change me to change title',
        },
        {
          id: uuidv4(),
          template: 'Drag me to \'In progress\' section',
        },
        
      ],
    },
    {
      id: uuidv4(),
      title: 'Delivered Packages',
      cards: [
        {
          id: uuidv4(),
          template: 'Change me to change title',
        },
        {
          id: uuidv4(),
          template: 'Drag me to \'In progress\' section',
        },
      ],
    }
  ],
};

export default boards;