import {faker} from '@faker-js/faker'
import {createHash} from '../utils/index.js'
class MockingService {
    static async generateMockingPets(num) { // Cambiado a estático
        const pets = [];
        for (let i = 0; i < num; i++) {
            pets.push({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                adopted: false
            });
        }
        
        return pets;
    }
}

export default MockingService;