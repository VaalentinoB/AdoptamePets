class UserDTO {
    static getUserTokenFrom(user) {
        return {
            id: user._id,
            email: user.email,
            role: user.role,
        };
    }
}

export default UserDTO;
