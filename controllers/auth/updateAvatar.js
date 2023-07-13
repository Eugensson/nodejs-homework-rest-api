const path = require('path');

const fs = require('fs/promises');

const { User } = require('../../models/user');

const avatarsDir = path.join(__dirname, '../', '../', 'public', 'avatars');

const Jimp = require('jimp');

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const avatarName = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, avatarName);

  Jimp.read(tempUpload, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).write(tempUpload, () => {
      fs.rename(tempUpload, resultUpload);
      const avatarURL = path.join('avatars', avatarName);

      User.findByIdAndUpdate(_id, { avatarURL }).then(() => {
        res.json({ avatarURL });
      });
    });
  });
};

module.exports = { updateAvatar };
