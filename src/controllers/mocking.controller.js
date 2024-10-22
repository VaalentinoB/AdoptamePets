
import MockingService from "../services/mocking.services.js";
import {usersService} from "../services/index.js";
import { petsService } from "../services/index.js";
const getMockingPets = async (req, res) => {
    const pets = await MockingService.generateMockingPets(100); 
    res.send({ status: "success", payload: pets });
}


const getMockingUsers = async (req, res) => {
    const users = await MockingService.generateMockingUsers(50); 
    res.send({ status: "success", payload: users });
}


const generateData = async (req, res) => {
    const { pets, users } = req.body;

    try {
        
        const mockingusers = await MockingService.generateMockingUsers(users);

        const mockingpets = await MockingService.generateMockingPets(pets);


        await Promise.all(mockingusers.map(user => usersService.create(user)));
        await Promise.all(mockingpets.map(pet => petsService.create(pet)));
        res.send({ status: "success", payload: {users:mockingusers, pets:mockingpets} });


    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: error.message });
        
    }
}
export default {
    getMockingPets,
    getMockingUsers,
    generateData
}
