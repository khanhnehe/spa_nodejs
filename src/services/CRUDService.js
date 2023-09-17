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

//lấy all user ko cần có input đầu vào
let getAllUser = () => {
  //tránh bất đồng bộ xảy ra ta dùng Promise để js chờ
  //dung async await báo cho js bt đây là 1 hàm bất đồng bộ
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        //raw: true in ra dữ liệu gốc
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserIntoId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        //dùng đk where, ở đây id sẽ bằng userId mà ta truyền vào
        where: { id: userId },
        raw: true,
      });

      //nếu ta tìm thấy ngdung thì trả ra thằng ngdung lun
      if (user) {
        resolve(user);

        //trả về 1 [] thui
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        //đk where 1 cái object{ id chính = data.id} tức kà ta tìm đc thằng user
        //vs đk cái id chính = cái id mà we truyền vào
        where: { id: data.id },
      });
      //sau khi ìm xong ta dùng 1 vòng if ở đây
      //nếu we có user thì we sẽ update user và chấm cái trường tương ứng
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonemumber = data.phonemumber;

        //sau cùng ta cần lưu nó lại
        await user.save();

        //render ra user sau khi update tức lấy all ngdung
        let allUser = await db.User.findAll();

        //để thoát ra khỏi Promise này ta   resolve(allUser);
        resolve(allUser);
      } else {
        resolve();
      }
    } catch (e) {
      console.log(e);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  hashUserPassword: hashUserPassword,
  getAllUser: getAllUser,
  getUserIntoId: getUserIntoId,
  updateUserData: updateUserData,
};
