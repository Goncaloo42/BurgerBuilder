import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burgerbuilder-4e46b-default-rtdb.firebaseio.com/'
});

export default instance;