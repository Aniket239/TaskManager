import { PasswordStrengthType } from "../../../components/PasswordStrength"

export interface SignUpViewModalType {
    formData: SignUpFormType,
    submitting: boolean,
    handleChange: (field: string, value: string | PasswordStrengthType) => void
    errors: SignUpErrorType,
    onSubmit: () => void,
    login: () => void
}

export interface SignUpFormType {
    email: string,
    password: string,
    confirmPassword: string,
    passwordStrength: PasswordStrengthType | null
}

export interface SignUpErrorType {
    email: string,
    password: string,
    confirmPassword: string,
}