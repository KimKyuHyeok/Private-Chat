const messageModel = require("../models/messages.model");

const saveMessages = async ({from, to, message, time}) => {
    const token = getToken(from, to);
    const data = {
        from, message, time
    };

    try {
        await messageModel.updateOne(
            { userToken: token },
            { $push: { message: data } }
        );
        console.log('메시지가 생성되었습니다.');
    } catch (err) {
        console.error('메시지 생성 중 오류 발생:', err);
    }
}

const getToken = (sender, receiver) => {
    const key = [sender, receiver].sort().join("_");
    return key;
}

module.exports = {
    saveMessages
};
