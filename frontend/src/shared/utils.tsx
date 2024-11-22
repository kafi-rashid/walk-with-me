export const logout = (setUser, navigate) => {
    localStorage.clear();
    setUser({
        user: null,
        isAuthenticated: false,
    });
    navigate('/public/login');
};
