import { defineStore } from 'pinia'
import { reactive } from 'vue';

const LOCAL_STORE_NAME = 'user';

const defaultUser = {
    isAuthenticated: false,
    token: null,
    id: null,
    email: null,
    userData: {
        balance: null
    }

};

export const useUserStore = defineStore('user', () => {
    let user = reactive(process.client ? JSON.parse(localStorage.getItem(LOCAL_STORE_NAME)) || defaultUser : defaultUser);
    const config = useRuntimeConfig();

    async function getUserData() {
        const response = await fetchAuth(`${config.public.baseURL}/users/${user.id}/`, {
            method: 'GET',
        });
        Object.assign(user.userData, response);
        return response;
    }

    const setUserData = (data) => {
        user.isAuthenticated = true;
        user.token = data.token;
        user.id = data.id;
        user.email = data.email;
        localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(user));
    }

    const setUserEmail = (email) => {
        user.email = email;
        localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(user));
    }

    const Logout = () => {
        Object.assign(user, defaultUser);
        localStorage.removeItem(LOCAL_STORE_NAME);
    }


    return {
        user,
        setUserData,
        getUserData,
        setUserEmail,
        Logout
    }
})    
