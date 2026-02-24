export interface LoginViewModalType {
    formData: LoginFormType,
    submitting: boolean,
    handleChange: (field: string, value: string) => void,
    errors: LoginFormType,
    onSubmit: () => void,
    signUp: () => void,
    forgotPassword: () => void
}

export interface LoginFormType {
    email: string,
    password: string
}