export interface ForgotPasswordViewModalType {
    formData: ForgotPasswordFormType,
    submitting: boolean,
    handleChange: (field: string, value: string) => void,
    errors: ForgotPasswordFormType,
    onSubmit: () => void
}

export interface ForgotPasswordFormType {
    email: string
}
