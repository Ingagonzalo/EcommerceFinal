import { config } from "dotenv";
import { createTransport } from "nodemailer";

config();

const trasporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.PASSWORD_MAIL,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (
  usuario,
  nombre,
  apellido,
  email,
  tel,
  direccion,
  edad
) => {
  try {
    const mailOptions = {
      from: "lucianocoscia5@gmail.com",
      to: process.env.AUTH_MAIL,
      subject: "Nuevo registro",
      html: `
            <div class="container">
              <h2>Nuevo registro</h2>
              <div class="container">
                <p>Usuario: ${usuario}</p>
                <p>Nombre: ${nombre}</p>
                <p>Apellido: ${apellido}</p>
                <p>Mail: ${email}</p>
                <p>Telefono: ${tel}</p>
                <p>Direccion: ${direccion}</p>
                <p>Edad: ${edad}</p>
              </div>
            </div>
            `,
    };
    const info = await trasporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
const sendMailCart = async ({ orderToSend }) => {
  try {
    const mailOptions = {
      from: "lucianocoscia5@gmail.com",
      to: process.env.AUTH_MAIL,
      subject: `Nuevo pedido de ${orderToSend.user} con email ${orderToSend.email}`,
      html: `
          <div>
            <h4>Orden nº: ${orderToSend.orderNumber}</h4>
            <h4>Fecha y hora: ${orderToSend.time}</h4>
          </div>
          ${orderToSend.products.map((product, index) => {
            return `
            <div>
              <h2 style="font-weight= bold">Titulo del producto ${index}: ${product.title}</h2>                                             
              <h3 style="color: red;">Precio del producto ${index}: ${product.price}</h3>                                             
              <h5 style="color: black;">Image o URL del producto ${index}: ${product.thumbnail}</h5>  
            </div>
              `;
          })}`,
    };
    const info = await trasporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

export const SendMails = { sendMail, sendMailCart };
