//import db để check đc email dưới db
import db from "../models/index";
//dung để hash pass nên có mới compare đc password
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10); //hash password nên search kỹ lại

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            //let isExit check user có tồn tại hay ko
            let isExit = await checkUserEmail(email);
            if (isExit) {
                //check nếu user exist tồn tại rồi  == true ta sẽ compare password
                let user = await db.User.findOne({

                    attributes: ['email', 'roleId', 'password'],
                    where: {
                        //email thứ 2 là cái email mà ta truyền vào
                        email: email
                    },
                    //raw: true thì thằng user sẽ trả ra cho mk 1 cái biến object 
                    raw: true


                })

                if (user) {
                    let checkPass = await bcrypt.compareSync(password, user.password)
                    if (checkPass) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'user not found!!';
                }
            } else {
                //return  error
                userData.errCode = 1;
                userData.errMessage = 'Invalid email, try another email!'
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

//check xem email ngdung tồn tại tronh hệ thông hay chưa
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            //let use tìm ngdung
            let user = await db.User.findOne({
                where: {
                    //tức là ta chạy vào db ta sẽ quét all bản ghi trong db và nó sẽ tìm theo đk là 
                    //email của bảng ghi trên db nó có bằng vs email we truyền vào ko
                    email: userEmail
                }
            })
            //nếu ta tìm thấy ngdung thì biến user này sẽ là if user
            //hàm findOne()nếu ko tìm đc giá trị nó sẽ trả vê undefine
            //nếu giá trị nó khác undefine thì mặc định cái if này đc chạy vào
            //nếu giá trị == undefine chạy vào false

            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }

        } catch (e) {
            reject(e)
        }

    })


}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = 'abc';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        //exclude ngoại trừ cái mk ko muốn in ra 
                        exclude: ['password']
                    },
                })

            } if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {
                        //tức là id ta truyền vào phải bằng vs 1 cột id trong bd 
                        id: userId
                    },
                    attributes: {
                        //exclude ngoại trừ cái mk ko muốn in ra 
                        exclude: ['password']
                    },

                })
            }
            resolve(users)

        } catch (e) {
            reject(e)
        }
    })
}

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

//truyền vào data láy từ phía client lên
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check xem email có tồn tai trong hệ thống chưa bữa làm bị thiếu phần này
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email already exists, please try another email'

                })
            }
            else {
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
                resolve({
                    errCode: 0,
                    message: 'ok'
                });
            }

        } catch (e) {
            reject(e)
        }

    })

}

let deleteUser = async (userId) => {
    return new Promise(async (resolve, reject) => {

        try {
            let user = await db.User.findOne({
                where: {
                    id: userId
                },
            });

            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User not found'

                })
            }
            else {
                await db.User.destroy({
                    where: {
                        id: userId
                    }
                });
            }
            resolve({
                errCode: 0,
                message: 'User deleted',
            });

        } catch (e) {
            reject(e)
        }
    })

}

let updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                //raw = false => chuyển từ javascript object sang sequelize object
                raw: false
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonemumber = data.phonemumber;
                await user.save()

                resolve({
                    errCode: 0,
                    message: 'User information updated successfully'
                });
            }
            else {
                //trường hợp này là lỡ ngdung đang sửa bị ai đó xóa trong he thong
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}