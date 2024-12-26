import express from "express";
import { getUserInfo, addBalance, Editprofile, getAllUser, deleteUser, createUser, getUser, Addfunds } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/:id", getUserInfo);
router.post("/",addBalance);
router.put("/update/:id", Editprofile);

router.get("/admin/all", getAllUser);
router.delete("/admin/:id", deleteUser);
router.post("/admin/create", createUser);
router.put("/admin/update/:id", Editprofile)

router.get("/wallet/all", getUser);
router.put("/wallet/:id", Addfunds);

export default router;