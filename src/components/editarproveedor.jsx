import React, { useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EditarProveedor = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues]);

    const handleUpdateProveedor = async (values) => {
        try {
            const formData = new FormData();
            for (const key in values) {
                if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            }

            const response = await axios.post(`https://gestorpedidosbaknube-production.up.railway.app/Proveedores/editar_proveedor/${initialValues.id_proveedor}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success(response.data.mensaje);
            await fetchProveedores();
            onFinish(values);
        } catch (error) {
            if (error.response) {
                message.error(error.response.data.error);
            }
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleUpdateProveedor}
            >
            <Form.Item label="Nombres" name="nombreproveedor">
                <Input />
            </Form.Item>

            <Form.Item label="Dirección" name="direccionproveedor">
                <Input />
            </Form.Item>

            <Form.Item label="Teléfono" name="telefonoproveedor">
                <Input />
            </Form.Item>

            <Form.Item label="Correo" name="correoproveedor">
                <Input />
            </Form.Item>

            <Form.Item label="Estado" name="sestado">
                <Select>
                    <Option value="1">Activo</Option>
                    <Option value="0">Desactivo</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Guardar cambios
                </Button>
                <Button onClick={onCancel}>Cancelar</Button>
            </Form.Item>
        </Form>
    );
};

export default EditarProveedor;