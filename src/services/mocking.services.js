import {faker} from '@faker-js/faker'
import {createHash} from '../utils/index.js'
class MockingService {


    static async generateMockingUsers(num) { 

        const users = [];

        
        for (let i = 0; i < num; i++) {
            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),    
                password: await createHash("adoptame"),
                role:faker.helpers.arrayElement(["user","admin"]),
                pets: []
            });
            console.log(users);
           
        }
        return users;

    }




    static async generateMockingPets(num) { // Cambiado a estático
        const pets = [];
        for (let i = 0; i < num; i++) {
            const numAleatorio = Math.floor(Math.random() * 100);
            pets.push({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                adopted: false,
                birthdate: faker.date.birthdate(),
                image: "https://via.placeholder.com/"+numAleatorio,
            });
        }
        
        return pets;
    }
}

export default MockingService;