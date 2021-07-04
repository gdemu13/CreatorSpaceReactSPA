import requests from './axiosConfig';

export const Account = {
    getProfile: () => requests.get('/Account/GetProfile'),
    login: (body) => requests.post('/Account/Login', body),
    register: (body) => requests.post('/Account/Register', body),
    updateProfile: (body) => requests.post('/Account/UpdateProfile', body),
    changePassword: (body) => requests.post('/Account/ChangePassword', body),
    sendPasswordRecoveryEmail: (body) =>
        requests.post('/Account/SendPasswordRecoveryEmail', body),
    resetPassword: (body) => requests.post('/Account/ResetPassword', body),
};

export const Company = {
    get: () => requests.get('/Company'),
    update: (body) =>
        requests.put('/Company', body, {
            'Content-Type': 'multipart/form-data',
        }),
};

export const Goal = {
    getGoals: () => requests.get('/Goals'),
    get: (id) => requests.get(`/Goals/${id}`),
    add: (body) => requests.post('/Goals', body),
    update: (id, body) => requests.put(`/Goal/${id}`, body),
    delete: (id) => requests.del(`/Goals/${id}`),
    updateGoalsConfig: (body) => requests.put('/Goals/UpdateGoalsConfig', body),
};

export const Tier = {
    getTiers: () => requests.get('/Tiers'),
    get: (id) => requests.get(`/Tiers/${id}`),
    add: (body) =>
        requests.post('/Tiers', body, {
            'Content-Type': 'multipart/form-data',
        }),
    update: (id, body) =>
        requests.put(`/Tiers/${id}`, body, {
            'Content-Type': 'multipart/form-data',
        }),
    delete: (id) => requests.del(`/Tiers/${id}`),
};

export const Benefit = {
    add: (body) => requests.post('/Benefits', body),
    update: (id, body) => requests.put(`/Benefits/${id}`, body),
    delete: (id) => requests.del(`/Benefits/${id}`),
};

export const Post = {
    getPosts: (params) => requests.get('/Posts', params, true),
    get: (id) => requests.get(`/Posts/${id}`),
    add: (body) =>
        requests.post('/Posts', body, {
            'Content-Type': 'multipart/form-data',
        }),
    update: (id, body) =>
        requests.put(`/Posts/${id}`, body, {
            'Content-Type': 'multipart/form-data',
        }),
    delete: (id) => requests.del(`/Posts/${id}`),
    like: (id, body) => requests.post(`/Posts/Like/${id}`, body, {}, true),
};

export const Comment = {
    getComments: (postId) => requests.get('/Comments', { postId: postId }),
    add: (body) => requests.post('/Comments', body),
    update: (id, body) => requests.put(`/Comments/${id}`, body),
    delete: (id) => requests.del(`/Comments/${id}`),
};

export const Payment = {
    createCheckoutSession: (tierId) =>
        requests.post('/Payments/CreateCheckoutSession', { tierId: tierId }),
    createBillingPortalSession: () =>
        requests.post('/Payments/CreateBillingPortalSession'),
};

export const Subscription = {
    getSusbcriptions: () => requests.get('/Subscriptions'),
    pollForSubscriptionStatus: (sessionId) =>
        requests.get(
            '/Subscriptions/PollForSubscriptionStatus',
            { sessionId: sessionId },
            true
        ),
    cancel: (id) => requests.del(`/Subscriptions/${id}`),
};
