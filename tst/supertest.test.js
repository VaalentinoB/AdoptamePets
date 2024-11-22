import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";
import User from "../src/dao/models/User.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

let cookie; // Variable para almacenar la cookie

describe("Testing de la app web", () => {
    // Limpia la base de datos antes de cada prueba
    beforeEach(async () => {
        // Asegúrate de que la conexión a MongoDB esté abierta
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect('mongodb://localhost:27017/tu_basedatos', { useNewUrlParser: true, useUnifiedTopology: true });
        }

        // Eliminar cualquier usuario con este correo
        try {
            await User.deleteOne({ email: "maria@ejemplo.com" }); // Cambiado el correo
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            throw err; // Lanza el error si no se puede eliminar
        }
    });

    describe("Testing de mascotas", () => {
        it("Endpoint POST /api/pets debe crear una nueva mascota", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const ramboMock = {
                name: "Rambo",
                specie: "Pitbull",
                birthDate: "2019-08-28",
            };

            const { statusCode, _body } = await requester.post("/api/pets").send(ramboMock);
            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("_id");
        });

        it("Debe corroborar que la propiedad adopted sea false", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const nuevaMascota = {
                name: "Ciro",
                specie: "Pomerania",
                birthDate: "2019-08-28",
            };

            const { statusCode, _body } = await requester.post("/api/pets").send(nuevaMascota);
            expect(statusCode).to.equal(200);
            expect(_body.payload).to.have.property("adopted").that.equals(false);
        });

        it("Debe devolver status 400 si falta el campo nombre", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const mockSinNombre = {
                specie: "Leon",
                birthDate: "2019-08-28",
            };

            const { statusCode } = await requester.post("/api/pets").send(mockSinNombre);
            expect(statusCode).to.equal(400);
        });

        it("Debe devolver un arreglo con las mascotas", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const { statusCode, _body } = await requester.get("/api/pets");
            expect(statusCode).to.equal(200);
            expect(_body).to.have.property("status").that.equals("success");
            expect(_body.payload).to.be.an("array");
        });

        it("Debe actualizar correctamente una mascota", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const idMascota = "673fa3f68e6b464b531bc941";
            const datosActualizados = {
                name: "Ciro",
                specie: "Pomerania",
                birthDate: "2019-08-28",
            };

            const { statusCode } = await requester.put(`/api/pets/${idMascota}`).send(datosActualizados);
            expect(statusCode).to.equal(200);
        });
    });

    describe("Testing de sesiones", () => {
        it("Debe registrar correctamente un usuario", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const mockUsuario = {
                first_name: "Maria",
                last_name: "Ejemplo",
                email: "maria@ejemplo.com",  // Cambiado el correo
                password: "contraseña123",
            };

            const { statusCode, _body } = await requester.post("/api/sessions/register").send(mockUsuario);
            expect(statusCode).to.equal(200);
            expect(_body.status).to.equal("success");
        });

        it("Debe loguear al usuario y recuperar la cookie", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const mockUsuario = {
                email: "maria@ejemplo.com",  // Cambiado el correo
                password: "contraseña123",
            };

            const resultado = await requester.post("/api/sessions/login").send(mockUsuario);

            // Validamos que la cookie esté presente
            expect(resultado.header["set-cookie"]).to.be.an("array").that.is.not.empty;

            const cookieResultado = resultado.header["set-cookie"][0];
            cookie = {
                name: cookieResultado.split("=")[0],
                value: cookieResultado.split("=")[1],
            };

            expect(cookie.name).to.equal("coderCookie");
            expect(cookie.value).to.be.ok;
        });

        it("Debe enviar la cookie que contiene el usuario", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const { _body } = await requester.get("/api/sessions/current")
                .set("Cookie", [`${cookie.name}=${cookie.value}`]);

            expect(_body.status).to.equal("success");
            expect(_body.payload.email).to.equal("maria@ejemplo.com");  // Cambiado el correo
        });

        it("Debe devolver un error si no hay token en la cookie", async function () {
            this.timeout(5000); // Aumenta el timeout para esta prueba específica

            const { statusCode, _body } = await requester.get("/api/sessions/current");
            expect(statusCode).to.equal(401); // Error de autenticación
            expect(_body.error).to.equal("No token provided");
        });

        it("Debe loguear un usuario no protegido y recuperar su cookie", async function () {
            this.timeout(5000);
        
            const mockUsuario = {
                email: "maria@ejemplo.com",  // Cambiado el correo
                password: "contraseña123",
            };
        
            const resultado = await requester.post("/api/sessions/unprotectedLogin").send(mockUsuario);
        
            expect(resultado.header).to.have.property("set-cookie").that.is.an("array").that.is.not.empty;
        
            const cookieResultado = resultado.header["set-cookie"][0];
            cookie = {
                name: cookieResultado.split("=")[0],
                value: cookieResultado.split("=")[1],
            };
        
            expect(cookie.name).to.equal("unprotectedCookie");
            expect(cookie.value).to.be.ok;
        });
        
        it("Debe enviar la cookie no protegida que contiene el usuario", async function () {
            this.timeout(5000);
        
            const { _body } = await requester.get("/api/sessions/unprotectedCurrent")
                .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        
            expect(_body.status).to.equal("success");
            expect(_body.payload.email).to.equal("maria@ejemplo.com");  // Cambiado el correo
        });
        
    });
});
