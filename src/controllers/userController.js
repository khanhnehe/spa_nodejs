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
            message: 'Missing input parameter! bạn đã bỏ trống email hoặc pass'
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

module.exports = {
    handleLogin: handleLogin
}