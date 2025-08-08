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

import { useEffect,useState } from 'react';

// @asseinfo/react-kanban components
import Board, { moveCard } from '@asseinfo/react-kanban';

// html-react-parser components
// uuid is a library for generating unique id
import { v4 as uuidv4 } from 'uuid';

// @mui material components

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Kanban application components
import Header from 'layouts/ecommerce/kanban/components/Header';

// Data
// import boards from 'layouts/ecommerce/kanban/data';
import { useNavigate } from 'react-router-dom';

function Kanbansec() {
  const navigate = useNavigate();

  const handlebox = () => {
    navigate('/product/production/details');
  };

  const boards = {
    columns: [
      {
        id: 1,
        title: <SoftTypography variant="h6">Production Request</SoftTypography>,
        cards: [
          {
            id: uuidv4(),
            data: ['PR001', 'Item Name', '300 kgs', 'Required Data - 20/06/2023'],
            description: 
                <SoftBox
                  onClick={handlebox}
                  // key={id}
                  // dragging={dragging.toString() || undefined}
                  display="block"
                  width="calc(450px - 40px)"
                  bgColor="white"
                  color="text"
                  borderRadius="md"
                  mt={2.5}
                  py={1.875}
                  px={1.875}
                  lineHeight={1.5}
                  sx={{
                    fontSize: ({ typography: { size } }) => size.md,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                  }}
                >
                  <SoftTypography variant="h6">PR001</SoftTypography>
                  <SoftTypography variant="h6">Item Name</SoftTypography>
                  <SoftTypography variant="h6">300 kgs</SoftTypography>
                  <SoftTypography variant="h6">Required Date - 20/06/2023</SoftTypography>
                </SoftBox>
            
          },
          {
            id: uuidv4(),
            description: (
              <SoftBox
                onClick={handlebox}
                // key={id}
                // dragging={dragging.toString() || undefined}
                display="block"
                width="calc(450px - 40px)"
                bgColor="white"
                color="text"
                borderRadius="md"
                mt={2.5}
                py={1.875}
                px={1.875}
                lineHeight={1.5}
                sx={{
                  fontSize: ({ typography: { size } }) => size.md,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <SoftTypography variant="h6">PR001</SoftTypography>
                <SoftTypography variant="h6">Item Name</SoftTypography>
                <SoftTypography variant="h6">300 kgs</SoftTypography>
                <SoftTypography variant="h6">Required Date - 20/06/2023</SoftTypography>
              </SoftBox>
            )
          },
          {
            id: uuidv4(),
            description: (
              <SoftBox
                onClick={handlebox}
                // key={id}
                // dragging={dragging.toString() || undefined}
                display="block"
                width="calc(450px - 40px)"
                bgColor="white"
                color="text"
                borderRadius="md"
                mt={2.5}
                py={1.875}
                px={1.875}
                lineHeight={1.5}
                sx={{
                  fontSize: ({ typography: { size } }) => size.md,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <SoftTypography variant="h6">PR001</SoftTypography>
                <SoftTypography variant="h6">Item Name</SoftTypography>
                <SoftTypography variant="h6">300 kgs</SoftTypography>
                <SoftTypography variant="h6">Required Date - 20/06/2023</SoftTypography>
              </SoftBox>
            )
          },
          {
            id: uuidv4(),
            description: (
              <SoftBox
                onClick={handlebox}
                // key={id}
                // dragging={dragging.toString() || undefined}
                display="block"
                width="calc(450px - 40px)"
                bgColor="white"
                color="text"
                borderRadius="md"
                mt={2.5}
                py={1.875}
                px={1.875}
                lineHeight={1.5}
                sx={{
                  fontSize: ({ typography: { size } }) => size.md,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <SoftTypography variant="h6">PR001</SoftTypography>
                <SoftTypography variant="h6">Item Name</SoftTypography>
                <SoftTypography variant="h6">300 kgs</SoftTypography>
                <SoftTypography variant="h6">Required Date - 20/06/2023</SoftTypography>
              </SoftBox>
            )
          },
          {
            id: uuidv4(),
            description: (
              <SoftBox
                onClick={handlebox}
                // key={id}
                // dragging={dragging.toString() || undefined}
                display="block"
                width="calc(450px - 40px)"
                bgColor="white"
                color="text"
                borderRadius="md"
                mt={2.5}
                py={1.875}
                px={1.875}
                lineHeight={1.5}
                sx={{
                  fontSize: ({ typography: { size } }) => size.md,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <SoftTypography variant="h6">PR001</SoftTypography>
                <SoftTypography variant="h6">Item Name</SoftTypography>
                <SoftTypography variant="h6">300 kgs</SoftTypography>
                <SoftTypography variant="h6">Required Date - 20/06/2023</SoftTypography>
              </SoftBox>
            )
          }
        ],
      },
      {
        id: 2,
        title: <SoftTypography variant="h6">Pre Cleaning</SoftTypography>,
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
        id: 3,
        title: <SoftTypography variant="h6">Packing</SoftTypography>,
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
        id: 4,
        title: <SoftTypography variant="h6">Fresh Good Racks</SoftTypography>,
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
    ],
  };

  const [controlledBoard, setBoard] = useState(boards);

  const handleCardMove = (_card, source, destination) => {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  };
  // const [newCardForm, setNewCardForm] = useState(false);
  // const [formValue, setFormValue] = useState('');

  // const openNewCardForm = (event, id) => setNewCardForm(id);
  // const closeNewCardForm = () => setNewCardForm(false);
  // const handeSetFormValue = ({ currentTarget }) => {
  //   setFormValue(currentTarget.value);
  // };


  const handleSubmit  = ()=>{
    const toSaveProdReq = 
              {
                id: uuidv4(),
                data:['PR002','Orange','10 kgs','20/07/2023'],
                description: (
                  <SoftBox
                    onClick={handlebox}
                    // key={id}
                    // dragging={dragging.toString() || undefined}
                    display="block"
                    width="calc(450px - 40px)"
                    bgColor="white"
                    color="text"
                    borderRadius="md"
                    mt={2.5}
                    py={1.875}
                    px={1.875}
                    lineHeight={1.5}
                    sx={{
                      fontSize: ({ typography: { size } }) => size.md,
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                    }}
                  >
                    <SoftTypography variant="h6">PR001</SoftTypography>
                    <SoftTypography variant="h6">Item Name</SoftTypography>
                    <SoftTypography variant="h6">300 kgs</SoftTypography>
                    <SoftTypography variant="h6">Required Date - 20/06/2023</SoftTypography>
                  </SoftBox>
                )
              };
    const newControlledBoard  = {...controlledBoard};
    const columns = newControlledBoard['columns'];
    columns[0]['cards'] = [toSaveProdReq,...columns[0]['cards']];
    setBoard(newControlledBoard);
  };

  useEffect(()=>{
  },[controlledBoard]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox display="flex" justifyContent="flex-end" m={2}>
          <Header handleSubmit={handleSubmit} />
        </SoftBox>

        <SoftBox
          position="relative"
          my={4}
          sx={({ palette: { light }, functions: { pxToRem }, borders: { borderRadius } }) => ({
            '& .react-kanban-column': {
              backgroundColor: light.main,
              width: pxToRem(450),
              margin: `0 ${pxToRem(10)}`,
              padding: pxToRem(20),
              borderRadius: borderRadius.lg,
            },
          })}
        >
          <Board onCardDragEnd={handleCardMove} disableColumnDrag>
            {controlledBoard}
          </Board>
          {/* <Board
            initialBoard={boards}
            // allowAddCard
            // allowAddColumn
            renderColumnHeader={({ id, title }, { addCard }) => (
              <>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <SoftTypography variant="h6">{title}</SoftTypography>
                </SoftBox>
                {newCardForm === id ? (
                  <SoftBox my={2.5}>
                    <SoftInput value={formValue} inputProps={{ rows: 2 }} onChange={handeSetFormValue} multiline />
                    <SoftBox display="flex" mt={2}>
                      <SoftButton
                        variant="gradient"
                        color="success"
                        size="small"
                        onClick={() => {
                          addCard({ id: uuidv4(), template: formValue });
                          setFormValue('');
                        }}
                      >
                        add
                      </SoftButton>
                      <SoftBox ml={1}>
                        <SoftButton variant="gradient" color="light" size="small" onClick={closeNewCardForm}>
                          cancel
                        </SoftButton>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                ) : null}
              </>
            )}
            renderCard={({ id, template }, { dragging }) => (
              <SoftBox
                onClick={handlebox}
                key={id}
                dragging={dragging.toString() || undefined}
                display="block"
                width="calc(450px - 40px)"
                bgColor="white"
                color="text"
                borderRadius="md"
                mt={2.5}
                py={1.875}
                px={1.875}
                lineHeight={1.5}
                sx={{
                  fontSize: ({ typography: { size } }) => size.md,
                }}
              >
                {typeof template === 'string' ? parse(template) : template}
              </SoftBox>
            )}
            onCardNew={() => null}
          /> */}
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Kanbansec;
