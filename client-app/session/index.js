const VALUES = {
    PROFILE: 'USER_PROFILE'
};

const setItem = (key, value) => {
    if (!window.sessionStorage) return;
    if (typeof value !== 'string') value = JSON.stringify(value);
    window.sessionStorage.setItem(key, value);
};

const getItem = (key) => {
    if (!window.sessionStorage) return '';
    let value = window.sessionStorage.getItem(key);
    if (value) {
        try { value = JSON.parse(value);} catch (e) {}
    }
    return value;
};

export default {
    getProfile() {
        return getItem(VALUES.PROFILE);
    },
    setProfile(profile) {
        return setItem(VALUES.PROFILE, profile);
    }
}