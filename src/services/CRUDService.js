import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10); // làm theo thư viện, thư viện lo ko cần lo lắm

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonemumber: data.phonemumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("ok create a new user succeed");
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  //reject là từ chối
  //Promise đảm bảo cái hàm này lun trả ra kết quả trách việc xử lý bất đồng bộ của js
  //function async luôn trả về 1 promise rồi nên khỏi new Promise cx đc làm vậy cho chắc ă hơn thui
  return new Promise(async (resolve, reject) => {
    //dùng bắp inception
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
  hashUserPassword: hashUserPassword,
};
