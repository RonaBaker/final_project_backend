import joi from 'joi';

export const userSchema = joi.object().keys({
  username: joi.string().min(1),
  email: joi.string().email(),
  password: joi.string().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8}/)
  
});

export const tweetSchema = joi.object().keys({
  id: joi.string().length(36),
  content: joi.string().min(1).max(240)
});

