import { Router } from "express";
import mocksController from "../controllers/mocking.controller.js";
const router = Router();



router.get("/mockingpets", mocksController.getMockingPets); 
router.get("/mockingusers", mocksController.getMockingUsers)




export default router;