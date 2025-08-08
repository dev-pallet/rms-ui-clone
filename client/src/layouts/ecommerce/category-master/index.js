import './category-master.css';
import 'antd/dist/antd.css';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';



const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Beverages ${i}`,
    age: `Drinks ${i}`,
    address: `pepsi ${i}`,
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const Categorymaster = () => {
  sideNavUpdate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
    }
  };
  const columns = [
    {
      title: 'LEVEL-I',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
      title: 'LEVEL-II',
      dataIndex: 'age',
      width: '30%',
      editable: true,
    },
    {
      title: 'LEVEL-III',
      dataIndex: 'address',
      width: '30%',
      editable: true,
    },
    {
      title: 'Option',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link className=''
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              SAVE
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel} >
              <a>
                CANCEL
              </a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} className="typo-icon-font">
            EDIT 
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'text' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <Box className='category-top-box'>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
        Category
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Link to="/setting/product-master/category/main">
            <MenuItem onClick={handleClose}>LEVEL-I</MenuItem></Link>

          <Link to="/setting/product-master/category/sub">
            <MenuItem onClick={handleClose}>LEVEL-II</MenuItem></Link>

          <Link to="/setting/product-master/category/third">
            <MenuItem onClick={handleClose}>LEVEL-III</MenuItem></Link>
        </Menu>
                            
 
      </Box>
      

      <Form className='table-form' form={form} component={false}>
        <Table className='form'
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </DashboardLayout>
  );
};
export default Categorymaster;