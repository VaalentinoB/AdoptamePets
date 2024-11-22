import Users from "../src/dao/Users.dao.js";
import mongoose from "mongoose";
import Assert from "assert";

describe("Test de usuarios", function () {
    // Tiempo máximo para evitar timeout en operaciones de base de datos
    this.timeout(5000);

    before(async function () {
        // Conexión a la base de datos
        await mongoose.connect("mongodb+srv://valentinoburioni:vburioni1234@apivb.vym0xct.mongodb.net/Pets", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a la base de datos');

        // Inicializar la instancia de Users
        this.Users = new Users();
    });

    after(async function () {
        // Cerrar conexión a la base de datos
        await mongoose.connection.close();
    });

    beforeEach(async function () {
        // Limpiar la colección antes de cada prueba
        await mongoose.connection.collection("users").deleteMany({});
    });

    it("Get de usuarios debe retornar un array", async function () {
        const result = await this.Users.get();
        Assert.strictEqual(Array.isArray(result), true);
    });

    it("Se debe poder agregar un usuario a la base de datos", async function () {
        const usuario = {
            first_name: "Chano",
            last_name: "Charpentier",
            email: "chano@tanbionica.com",
            password: "contraseña123",
        };

        const result = await this.Users.save(usuario);
        // Verificar que el resultado sea un objeto con una propiedad específica
        Assert.ok(result._id, "El usuario debería tener un ID después de guardarse");


        
    });

    it("Dao deve obtener usuario segun email", async function () {

      let usuario = {
        first_name: "Chano",
        last_name: "Charpentier",
        email: "chano@tanbionica.com",
        password: "contraseña123",
    };

     await this.Users.save(usuario);


      const user = await this.Users.getBy({ email: usuario.email })
      Assert.strictEqual(typeof user, "object")

    })
});
