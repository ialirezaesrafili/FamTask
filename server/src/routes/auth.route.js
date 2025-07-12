import express from "express";

const router = express.Router();

// Example route
router.post("/login", (req, res) => {
    res.json({ message: "Login successful" });
});

export default router;