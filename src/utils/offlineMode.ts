const OFFLINE_MODE_KEY = 'offline_mode';

export const isOfflineMode = (): boolean => {
    return localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
};

export const setOfflineMode = (enabled: boolean): void => {
    if (enabled) {
        localStorage.setItem(OFFLINE_MODE_KEY, 'true');
    } else {
        localStorage.removeItem(OFFLINE_MODE_KEY);
    }
};

export const getMockUser = () => ({
    email: 'offline@local.dev',
    displayName: 'Offline User',
    uid: 'offline-123',
});
