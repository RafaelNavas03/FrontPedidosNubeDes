import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input, Select, InputNumber, Drawer, Tag, Tooltip, Popover, Popconfirm, notification } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { EditFilled, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import CrearComponenteForm from './CrearComponente';

const { Item } = Form;
const { Option } = Select;

const EditarComponenteForm = () => {
  const [componentes, setComponentes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editComponente, setEditComponente] = useState(null);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [opencom, setOpencom] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [form] = Form.useForm();

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/producto/listar_categorias/');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categorias);
      } else {
        const errorData = await response.json();
        message.error(errorData.error);
      }
    } catch (error) {
      console.error('Error al cargar las categorías:', error);
      message.error('Hubo un error al cargar las categorías');
    }
  };
  const eliminarcomp = async (rec) => {
    try {
      const formDataObject = new FormData();
      formDataObject.append('id_componente', rec.id_componente);
      console.log(rec.id_componente);
      const response = await fetch('http://127.0.0.1:8000/producto/eliminarcomponente/', {
        method: 'POST',
        body: formDataObject,
      });
      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Éxito',
          description: 'Artículo eliminado con éxito',
        });
        fetchComponentes();
      } else {
        notification.error({
          message: 'Error',
          description: 'Algo salío mal: '+data.error,
        });
      }
    } catch (error) {
      message.error('Ocurrió un error al eliminar el artículo' + error);
    }
  };

  const showDrawercom = () => {
    setOpencom(true);
  };

  const onClosecom = () => {
    setOpencom(false);
    form.resetFields();
    setEditComponente(null);
    fetchComponentes();
  };
  
  const fetchComponentes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/producto/listarcomponentes/');
      if (response.ok) {
        const data = await response.json();
        setComponentes(data.componentes);
      } else {
        const errorData = await response.json();
        message.error(errorData.error);
      }
    } catch (error) {
      console.error('Error al cargar los componentes:', error);
      message.error('Hubo un error al cargar los componentes');
    }
  };

  useEffect(() => {


    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/producto/listarum/');
        if (response.ok) {
          const data = await response.json();
          setUnidadesMedida(data.unidades_medida);
        } else {
          const errorData = await response.json();
          message.error(errorData.error);
        }
      } catch (error) {
        console.error('Error al cargar las unidades de medida:', error);
        message.error('Hubo un error al cargar las unidades de medida');
      }
    };

    fetchComponentes();
    fetchCategorias();
    fetchUnidadesMedida();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_componente',
      key: 'id_componente',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Categoría',
      dataIndex: 'id_categoria',
      key: 'id_categoria',
      render: (id_categoria) => (
        <Tag color="blue">{id_categoria ? id_categoria.catnombre : 'Sin categoría'}</Tag>
      ),
    },
    {
      title: 'Costo',
      dataIndex: 'costo',
      key: 'costo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (text) => (text === 'N' ? 'Normal' : text === 'F' ? 'Fabricado' : text),
    },
    {
      title: 'Unidad de Medida',
      dataIndex: 'nombre_um',
      key: 'nombre_um',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, record) => (
        <Row>
          <Col md={3}>
            <Tooltip title='Editar artículo'>
              <Button
                icon={<EditFilled />}
                onClick={() => handleEdit(record)}
              >
              </Button>
            </Tooltip>
          </Col >
          <Col md={3}>
            <Tooltip title='Eliminar producto'>
              <Popconfirm
                title="Eliminar artículo"
                description="¿Seguro que desea eliminar este artículo?"
                onConfirm={() => eliminarcomp(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                >
                </Button>
              </Popconfirm>
            </Tooltip>
          </Col >
          <Col md={3}>
            <Tooltip
              title='Ver componente'
              overlayStyle={{ width: 300 }}
            >
              {record.detalle && (
                <Popover title={<Tag color="#000000">Ensamble de componente:</Tag>} trigger="click"
                  content={
                    <div>

                      <p>Generado por ensamble: {record.detalle.padrecant}</p>
                      <hr />
                      {record.detalle.detalle.map((detalleItem, index) => (
                        <div key={index}>
                          <Tag color="#55971A">{detalleItem.id_componentehijo.nombre}</Tag>
                          <p>Cantidad: {detalleItem.cantidadhijo}</p>
                          <p>Unidad de Medida: {detalleItem.um.nombre}</p>
                          <hr />
                        </div>
                      ))}
                    </div>
                  }>
                  <Button
                    icon={<EyeOutlined />}
                  >
                  </Button>
                </Popover>
              )}

            </Tooltip>
          </Col >
        </Row>
      ),
    },
  ];
  const handleEditPrev = async (record) => {
    form.resetFields();
    setEditComponente(
      null
    );
    handleEdit(record);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditComponente(record);
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      const formDataObject = new FormData();
      formDataObject.append('nombre', values.nombre);
      formDataObject.append('descripcion', values.description);
      formDataObject.append('tipo', values.tipo);
      formDataObject.append('costo', values.costo.replace('$', '').replace(',', '.'));
      formDataObject.append('categoria', values.id_categoria);
      formDataObject.append('id_um', values.id_um);
      const response = await fetch(`http://127.0.0.1:8000/producto/editarcomponente/${editComponente.id_componente}/`, {
        method: 'POST',
        body: formDataObject,
      });
      const data = await response.json();
      if (response.ok) {
        message.success(data.mensaje);
        setComponentes((prevComponentes) =>
          prevComponentes.map((c) =>
            c.id_componente === editComponente.id_componente ? { ...c, ...data.componente } : c
          )
        );
        setModalVisible(false);
        fetchComponentes();
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.error('Error al editar el componente:', error);
      message.error('Ocurrió un error al editar el componente');
    }
  };
  useEffect(() => {
    if (modalVisible && editComponente) {
      form.setFieldsValue({
        nombre: editComponente.nombre,
        descripcion: editComponente.descripcion,
        costo: editComponente.costo,
        id_categoria: editComponente.id_categoria.id_categoria,
        tipo: editComponente.tipo,
        id_um: editComponente.id_um.id_um,
      });
    }
  }, [modalVisible, editComponente, form]);



  return (
    <div>
      <Row>
        <Col md={12}>
          <Button type="primary" style={{ width: '100%', margin: '2%' }} onClick={showDrawercom}>
            Crear artículo
          </Button>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table dataSource={componentes} columns={columns} />
      </div>
      {editComponente && (
        <Modal
        title="Editar Componente"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditComponente(null);
        }}
        footer={null}
      >
          <Form
            form={form}
            onFinish={handleModalOk}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Item label="Nombre" name="nombre" values={editComponente.nombre} rules={[{ required: true, message: 'Por favor, ingrese el nombre del componente' }]}>
              <Input />
            </Item>

            <Item label="Descripción" name="descripcion" initialValue={editComponente.descripcion}>
              <Input.TextArea />
            </Item>

            <Item label="Costo" name="costo" initialValue={editComponente.costo} rules={[{ required: false }, { type: 'decimal', message: 'Por favor, ingrese un valor numérico válido para el costo' }]}>
              <InputNumber
                step={0.01}
              />
            </Item>
            <Form.Item name="id_categoria" label="Categoría" rules={[{ required: true }]} initialValue={editComponente.id_categoria.id_categoria}>
              <Select placeholder="Seleccione una categoría">
                {categorias.map((categoria) => (
                  <Option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.catnombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Item label="Tipo" name="tipo" initialValue={editComponente.tipo} rules={[{ required: true, message: 'Por favor, seleccione el tipo del componente' }]}>
              <Select>
                <Option value="N">Normal</Option>
                <Option value="F">Fabricado</Option>
              </Select>
            </Item>

            <Item label="Unidad de Medida" name="id_um" initialValue={editComponente.id_um} rules={[{ required: true, message: 'Por favor, seleccione la unidad de medida' }]}>
              <Select>
                {unidadesMedida.map((um) => (
                  <Option key={um.id_um} value={um.id_um}>
                    {um.nombre_um}
                  </Option>
                ))}
              </Select>
            </Item>

            <Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Guardar Cambios
              </Button>
            </Item>
          </Form>
        </Modal>
      )}

      <Drawer
        title="Crear artículo"
        width={720}
        open={opencom}
        onClose={onClosecom}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <CrearComponenteForm />
      </Drawer>
    </div>
  );
};

export default EditarComponenteForm;
