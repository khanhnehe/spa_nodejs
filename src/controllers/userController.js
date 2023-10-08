import userService from '../services/userService';

let handleLogin = async (req, res) => {
    //dối vs express dùng req.body lấy giá trị ra thui 
    let email = req.body.email;
    let password = req.body.password;

    //việc dùng ! trước email => nõ sẽ check rằng cái email này có null hay ko 
    //tức giá trị == null, undefine, empty
    //check thêm đk nữa nếu we ko truyền vào email hoặc || ko truyền pass
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: `you're missing your email or password`
        })
    }

    //3.Return userInfor trả lại tt ngdung sau khi check các đk trên
    let userData = await userService.handleUserLogin(email, password);


    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        //nếu check trường hợp thằng userData có thông tin của ngdung thì sẽ trả ra gía trị của nó lun
        //trong trường hợp check ko thấy thông tin ngdung thì trả ra 1 object rỗng 
        user: userData.user ? userData.user : {}
    })

}

let handleGetAllUsers = async (req, res) => {
    //id ở đây sẽ là id or ALL -> có 2 kiểu này tức là ta sẽ viết 2 api trong 1 lun
    //nếu api là lấy all ngdung nếu mk chuyển id = ALL thì lấy all ngdung ra 
    //nếu truyền id của ngdung tức là  1 2 3  thì we sẽ lấy chính xác ngdung ấy ra 
    let id = req.query.id;
    if (!id) {
        //nếu ta ko truyền lên id thì ta sẽ báo lỗi như này lun
        return res.status(200).json({
            errCode: 1,
            errMessage: `missing required parameters`,
            users: []

        })

    }
    let users = await userService.getAllUser(id);
    console.log(users)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users

    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message)

}

let handleDeleteUser = async (req, res) => {
    //validate
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)

}

//ở đây ta chỉ update 1 user
let handleEditUser = async (req, res) => {
    //hàm req.body giúp we có thể lấy đc tất cả các input đã đặt cái name
    //ta đặt name là gì thì req.body chấm name đó thì sẽ ra đc số liệu đó
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)


}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
}