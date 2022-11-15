import { User } from "../Models/User.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../Utils/tokenManager.js";

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

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);
    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    res.json({ user: user.email });
  } catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const refreshToken = (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe token");

    const { uid } = jwt.verify(token, process.env.JWT_REFRESH);
    const { token, expiresIn } = generateToken(uid);

    return res.json({ token, expiresIn })
  } catch (error) {
    console.log(error);
    const TokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es valida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token no valido",
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato no valido",
    };

    return res
      .status(401)
      .json({ error: TokenVerificationErrors[error.message] });
  }
};

export const logout = (req, res) =>{
  res.clearCookie('refreshToken')
  res.json({ ok: true })
}