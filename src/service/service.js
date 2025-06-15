import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:55155';
export const Ping = async () => {
    return await axios.get('/front/ping');
}

export const queryServerClock  = async () => {
    return await axios.get('/front/clock');
}

export const queryDevices = async () => {
    return await axios.get('/front/queryDevices');
}

export const startTaskAll = async (requestBashAbstract, requestBashText, randomList, totalRequestNums, usingThreadsNums, timeConstraint) => {
    return await axios.post('/front/startTaskAll', {
        request_bash_abstract: requestBashAbstract,
        request_bash_text: requestBashText,
        random_list: randomList,
        enable_random_params: [],
        total_request_nums: Number(totalRequestNums),
        using_threads_nums: Number(usingThreadsNums),
        time_constraint: Number(timeConstraint),
    });
}

export const switchDeviceAll = async (isWorking, deviceID) => {
    return await axios.post('/front/switchDeviceAll', {
        is_working: isWorking,
        device_id: deviceID
    });
}

export const getDefaultRequestBashText = async () => {
    return await axios.get('/front/getDefaultRequestBashText');
}

export const getNewestRequestInfo = async () => {
    return await axios.get('/front/getNewestRequestInfo');
}

export const singleAttack = async (reqBashText) => {
    return await axios.post('/front/singleAttack', {
        request_bash_text: reqBashText
    })
}

export const getPaginatedRecords = async (page, size) => {
    return await axios.get('/front/getPaginatedRecords', {
        params: {
            page: page,
            size: size
        }
    });
}
