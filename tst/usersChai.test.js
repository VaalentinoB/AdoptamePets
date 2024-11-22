import mongoose from "mongoose";
import chai from "chai";
import Users from "../src/dao/Users.dao.js";

const expect = chai.expect;

// Conexión a la base de datos
mongoose.connect("mongodb+srv://valentinoburioni:vburioni1234@apivb.vym0xct.mongodb.net/Pets", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

describe("Test de usuarios", function () {
    before(function () {
        // Inicializar el DAO de usuarios
        this.userDao = new Users();
    });

    beforeEach(async function () {
        // Eliminar documentos de la colección antes de cada prueba
        try {
            await mongoose.connection.collection("users").drop();
        } catch (error) {
            if (error.code === 26) {
                // Código 26 significa "NamespaceNotFound", es decir, la colección no existe
                console.warn("La colección 'users' no existe, saltando eliminación.");
            } else {
                throw error;
            }
        }
    });

    it("El método get de usuarios debe retornar un array", async function () {
        const resultChai = await this.userDao.get();
        expect(Array.isArray(resultChai)).to.be.true;
    });
});
