import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";
import User from "../src/dao/models/User.js";
import Pet from "../src/dao/models/Pet.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de Adopciones", () => {
    before(async () => {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect("mongodb+srv://valentinoburioni:vburioni1234@apivb.vym0xct.mongodb.net/Pets", { useNewUrlParser: true, useUnifiedTopology: true });
        }
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Pet.deleteMany({});
    });

    describe("GET /api/adoptions/:aid", () => {
        it("Debe devolver una adopción específica", async () => {
            const user = await User.create({
                first_name: "Maria",
                last_name: "Ejemplo",
                email: "maria@ejemplo.com",
                password: "password123",
                pets: []
            });

            const pet = await Pet.create({
                name: "Rex",
                specie: "Perro",
                birthDate: "2019-08-28",
                adopted: false
            });

            const adoption = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);
            const adoptionId = adoption.body.payload._id;

            const { statusCode, body } = await requester.get(`/api/adoptions/${adoptionId}`);
            expect(statusCode).to.equal(200);
            expect(body.payload).to.have.property("_id").that.equals(adoptionId);
        });
    });

    describe("POST /api/adoptions/:uid/:pid", () => {
        it("Debe crear una nueva adopción", async () => {
            const user = await User.create({
                first_name: "Maria",
                last_name: "Ejemplo",
                email: "maria@ejemplo.com",
                password: "password123",
                pets: []
            });

            const pet = await Pet.create({
                name: "Rex",
                specie: "Perro",
                birthDate: "2019-08-28",
                adopted: false
            });

            const { statusCode, body } = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);
            expect(statusCode).to.equal(200);
            expect(body.status).to.equal("success");
        });

        it("Debe devolver un error si la mascota no existe", async () => {
            const user = await User.create({
                first_name: "Maria",
                last_name: "Ejemplo",
                email: "maria@ejemplo.com",
                password: "password123",
                pets: []
            });

            const invalidPetId = mongoose.Types.ObjectId();
            const { statusCode, body } = await requester.post(`/api/adoptions/${user._id}/${invalidPetId}`);
            expect(statusCode).to.equal(404);
            expect(body.error).to.equal("Pet not found");
        });

        it("Debe devolver un error si la mascota ya está adoptada", async () => {
            const user = await User.create({
                first_name: "Maria",
                last_name: "Ejemplo",
                email: "maria@ejemplo.com",
                password: "password123",
                pets: []
            });

            const pet = await Pet.create({
                name: "Rex",
                specie: "Perro",
                birthDate: "2019-08-28",
                adopted: true
            });

            const { statusCode, body } = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);
            expect(statusCode).to.equal(400);
            expect(body.error).to.equal("Pet is already adopted");
        });
    });
});
