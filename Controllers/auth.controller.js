import { User } from "../Models/User.js";
import Jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    return res.json({ ok: true });
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Ya existe este usuario" });
    }
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(403).json({ error: "No existe este usuario" });

    const respuestaPassword = user.comparePassword(password);
    if (!respuestaPassword)
      return res.status(403).json({ error: "Contraseña incorrecta" });

    const token = Jwt.sign({ uid: user.id }, process.env.JWT_SECRET)

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};
