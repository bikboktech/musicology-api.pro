import knex from '../../common/data/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_EXPIRY_TIME_MINUTES = 60;

const generateUserAccessToken = async (tokenData, rememberMe=false) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const tokenPayload = tokenData;

    if (rememberMe)
      return jwt.sign(tokenPayload, JWT_SECRET_KEY)

    const expiresIn = JWT_EXPIRY_TIME_MINUTES * 60;

    return jwt.sign(tokenPayload, JWT_SECRET_KEY, {
      expiresIn
    })
}

const login = async (req, res) => {
  // res.status(200).json("ejla");
  const { email, password } = req.body;
  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  if (!isValidEmail) {
    res.status(406).json({ message:  `Please provide a valid email` });
    return;
  }

  const user = await knex('accounts').where('email', email).first();

  if (!user){
    res.status(404).json({ message:  `User not found` });
    return;
  }

  console.log("Login successful")
  
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    res.status(400).json({ message: "The provided password is invalid" }); 
    
  }
  const userAccessToken = await generateUserAccessToken(user);
  console.log("Generated JWT");
  res.status(200).json(userAccessToken);
}

export default login;
