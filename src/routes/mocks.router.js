import { Router, Router } from "express";

const router = Router();


router.get("mockingpets", mocksController.getMockingPets);

router.get("mockingusers", mocksController.getMockingUsers)

router.post("/generatedata",mocksController.generateData);


export default router;