const { User } = require('../models/index')
const { generateToken } = require('../helpers/jwt')
const { handleClientError, handleServerError } = require('../helpers/errorHandler')
const bcrypt = require('bcrypt')


exports.register = async (req, res) => {
  try {
    const { nameUser, noHp, password } = req.body
    if (!nameUser) return handleClientError(res, 404, "Name is required");
    if (!noHp) return handleClientError(res, 404, "No Hp is required");
    if (!password) return handleClientError(res, 404, "Password is required");

    const passwordValidationRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{7,}$/;
    if (!passwordValidationRegex.test(password)) {
      return handleClientError(res, 400, "Password must be at least 7 characters long, contain at least one number and one special character.");
    }

    const findUserName = await User.findOne({ where: { nameUser: nameUser } });
    if (findUserName) return handleClientError(res, 404, "nama telah digunakan");

    const findUser = await User.findOne({ where: { noHp: noHp } });
    if (findUser) return handleClientError(res, 404, "Nomor telah digunakan");

    let userRole = 'user';
    if (nameUser === 'fadil_mimin' || nameUser === 'reihan_mimin') {
      userRole = 'admin';
    }

    const user = await User.create({ nameUser, noHp, password, role: userRole, })
    res.status(201).json({
      id: user.id,
      noHp: user.noHp,
      role: userRole,
    });
  } catch (err) {
    handleServerError(res, err.message);
  }
}

exports.login = async (req, res) => {
  try {
    const { nameUser, password } = req.body;

    if (!nameUser) return handleClientError(res, 404, "Name is required");
    if (!password) return handleClientError(res, 404, "Password is required");

    const findUser = await User.findOne({ where: { nameUser: nameUser } });
    if (!findUser) return handleClientError(res, 404, "Name not found");

    const passwordValidasi = bcrypt.compareSync(password, findUser.password);
    if (!passwordValidasi) return handleClientError(res, 404, "Password is not correct");

    const token = generateToken({
      id: findUser.id,
      nameUser: findUser.nameUser,
      role: findUser.role
    });

    res.status(200).json({
      id: findUser.id,
      name: findUser.nameUser,
      level: findUser.level,
      exp: findUser.exp,
      hp: findUser.noHp,
      token: token,
      role: findUser.role,
      point: findUser.point,
      join: findUser.createdAt
    });

  } catch (err) {
    handleServerError(res, err.message);
  }
}

exports.getMyExp = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (err) {
    handleServerError(res, err.message);
  }
}

exports.getMyExpByid = async (req, res) => {
  const userId = req.params.id;
  // const { exp, level } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user,
      message: 'User updated successfully.'
    });
  } catch (err) {
    handleServerError(res, err.message);
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.findAll({
      order: [['id', 'ASC']]
    })

    res.status(200).json({
      user
    })
  } catch (err) {
    handleServerError(res, err.message);
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const findUser = await User.findByPk(id);

    if (!findUser) throw { name: "Not Found" };

    await User.destroy({
      where: { id },
    });
    res.status(200).json({
      message: `Product with id ${id} has been deleted`,
    });
  } catch (err) {
    handleServerError(res, err.message);
  }
}

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { exp, level, point } = req.body
    const data = await User.update({ exp, level, point }, {
      where: { id: id },
      returning: true
    })

    if (!data) throw { name: "Not Found" }
    res.status(201).json({
      message: data
    })
  } catch (err) {
    handleServerError(res, err.message);
  }
}