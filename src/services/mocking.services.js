import {faker} from '@faker-js/faker'
import {createHash} from '../utils/index'
class MockingService {


async generateMockingUser(num) {

    

}


async generateMockingPets(num) {

    const pets = []; 


    for (let i = 0; i <num; i++) {
        
        
        pets.push({
            name:AnimalModule.dog(),
            specie:faker.animal.type(),
            adopted:false
        })
        
    }

    return pets;


}


}

export default MockingService;