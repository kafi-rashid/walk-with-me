export const logout = (setUser, navigate) => {
    setUser({
        user: null,
        isAuthenticated: false,
    });
    navigate('/public/login');
};
