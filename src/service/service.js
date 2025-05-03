import axios from 'axios';

export const Ping = async () => {
    return await axios.get('/front/ping');
}

export const queryServerClock  = async () => {
    return await axios.get('/front/clock');
}

export const queryDevices = async () => {
    return await axios.get('/front/queryDevices');
}