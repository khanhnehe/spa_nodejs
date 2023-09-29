//import db để check đc email dưới db
import db from "../models/index";
//dung để hash pass nên có mới compare đc password
import bcrypt from "bcryptjs";


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

module.exports = {
    handleUserLogin: handleUserLogin
}