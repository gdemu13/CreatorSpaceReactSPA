import axios from 'axios';

const ax = axios.create();

ax.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

//interceptors
let counter = 0;

const count = (val) => {
    if (val > 0 || counter > 0) counter += val;

    const loader = document.getElementById('loader');
    if (counter > 0) {
        loader.style.display = 'flex';
    } else {
        loader.style.display = 'none';
    }
};

ax.interceptors.request.use(
    function (config) {
        var token = localStorage.getItem('token');
        if (!!token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (!config.skipLoader) {
            count(1);
        }
        return config;
    },
    function (error) {
        count(-1);
        return Promise.reject(error);
    }
);

ax.interceptors.response.use(
    function (response) {
        count(-1);
        return response;
    },
    function (error) {
        count(-1);
        return Promise.reject(error);
    }
);

//request config

const responseBody = (response) => response.data;

const requests = {
    get: (url, params, skipLoader = false) => {
        return ax
            .get(url, {
                params: params,
                skipLoader: skipLoader,
            })
            .then(responseBody);
    },
    post: (url, body, headers = {}, skipLoader = false) => {
        return ax
            .post(url, body, { headers: headers, skipLoader: skipLoader })
            .then(responseBody);
    },
    put: (url, body, headers = {}) => {
        return ax.put(url, body, { headers: headers }).then(responseBody);
    },
    del: (url, headers = {}, data) => {
        return ax
            .delete(url, { headers: headers, data: data })
            .then(responseBody);
    },
};

export default requests;
