const { User } = require('../../models/user');

const { HttpError, ctrlWrapper, transport } = require('../../helpers');

const { BASE_URL } = process.env;

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, 'Not Found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    from: 'eco2023@meta.ua',
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to virify email </a>`,
  };

  await transport.sendMail(verifyEmail);

  res.status(200).json({
    message: 'Verification successful',
  });
};

module.exports = { resendVerifyEmail: ctrlWrapper(resendVerifyEmail) };
