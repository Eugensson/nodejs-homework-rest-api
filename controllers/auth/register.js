const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');

const { User } = require('../../models/user');

const { HttpError, ctrlWrapper, transport } = require('../../helpers');

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const { BASE_URL } = process.env;

  const verifyEmail = {
    to: email,
    from: 'eco2023@meta.ua',
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click virify email</a>`,
  };
  await transport.sendMail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      password: hashPassword,
    },
  });
};

module.exports = { register: ctrlWrapper(register) };
