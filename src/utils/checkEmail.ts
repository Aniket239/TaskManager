export const checkEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[a-zA-Z]+\.[a-zA-Z.]+$/;
    return emailRegex.test(email);
};

// export const checkEmail = (email: string) => {
//     const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
//     return emailRegex.test(email);
// };
