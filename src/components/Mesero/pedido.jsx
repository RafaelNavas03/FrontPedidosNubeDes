import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Select,
  InputNumber,
  Table,
  message,
  notification,
} from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

const { Option } = Select;

const RealizarPedidoMesa = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const handlePedidoSubmit = async (values) => {
    try {
      setLoading(true);

      // Construir el objeto de detalles_pedido
      const detalles_pedido = {
        detalles_pedido: values.detalles_pedido.map((detalle) => ({
          id_producto: detalle.id_producto,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          impuesto: detalle.impuesto,
          descuento: detalle.descuento,
        })),
      };

      const formData = new FormData();
      formData.append("id_mesa", values.id_mesa);
      formData.append("id_cliente", values.id_cliente);
      formData.append("tipo_de_pedido", values.tipo_de_pedido);
      formData.append("metodo_de_pago", values.metodo_de_pago);
      formData.append("puntos", values.puntos);
      formData.append(
        "fecha_pedido",
        values.fecha_pedido.format("YYYY-MM-DD HH:mm:ss")
      );
      formData.append(
        "fecha_entrega",
        values.fecha_entrega.format("YYYY-MM-DD HH:mm:ss")
      );
      formData.append("estado_del_pedido", values.estado_del_pedido);
      formData.append(
        "observacion_del_cliente",
        values.observacion_del_cliente
      );
      formData.append("detalles_pedido", JSON.stringify(detalles_pedido));

      const response = await fetch(
        `https://gestorpedidosbaknube-production.up.railway.app/Mesero/tomar_pedido/1/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Pedido creado con éxito");
        onClose();
      } else {
        const data = await response.json();
        message.error(data.error || "Error al crear el pedido");
      }
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      message.error("Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  const columns = [];

  return (
    <Modal
      visible={visible}
      title="Realizar Pedido"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          <ShoppingOutlined /> Realizar Pedido
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handlePedidoSubmit} layout="vertical">

        <Form.Item
          label="Producto"
          name={["detalles_pedido", 0, "id_producto"]}
          rules={[
            { required: true, message: "Por favor, selecciona un producto" },
          ]}
        >
          <Select>
            {productos.map((producto) => (
              <Option key={producto.id} value={producto.id}>
                {producto.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Cantidad"
          name={["detalles_pedido", 0, "cantidad"]}
          rules={[
            { required: true, message: "Por favor, ingresa la cantidad" },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Table
          dataSource={productos}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Form>
    </Modal>
  );
};

export default RealizarPedidoMesa;
