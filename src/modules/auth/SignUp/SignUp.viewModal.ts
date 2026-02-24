import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { checkEmail } from "../../../utils/checkEmail";
import { signupUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { SignUpViewModalType, SignUpFormType, SignUpErrorType } from "./SignUp.modal";
import { PasswordStrengthType } from "../../../components/PasswordStrength";
import { useToast } from "../../../hooks/ToastContext";

const useSignUpViewModal = (email?: string): SignUpViewModalType => {
    const [formData, setFormData] = useState<SignUpFormType>({
        email: '',
        password: '',
        confirmPassword: '',
        passwordStrength: null
    });
    const [errors, setErrors] = useState<SignUpErrorType>({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const { showToast } = useToast();

    useEffect(() => {
        if (email) {
            setFormData(prev => ({
                ...prev,
                email: email
            }));
        }
    }, [email])
    const handleChange = (field: string, value: string | PasswordStrengthType) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setErrors(prev => ({
            ...prev,
            [field]: ''
        }));
    };

    const validateForm = (): boolean => {
        console.log('====================================');
        console.log(formData);
        console.log('====================================');
        let valid = true;
        let newErrors: any = {};
        if (formData.email === '') {
            newErrors.email = 'Email is required';
            valid = false;
        }
        else if (checkEmail(formData.email) === false) {
            newErrors.email = 'Provide a valid email';
            valid = false;
        }
        if (formData.password === '') {
            newErrors.password = 'Password is required';
            valid = false;
        }
        if (formData.confirmPassword === '') {
            newErrors.confirmPassword = 'Confirm Password is required';
            valid = false;
        }
        if (formData.password && formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
                valid = false;
            }
        }
        if (formData.password && formData.passwordStrength?.strength === 'Weak') {
            newErrors.password = 'Provide a strong password';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    }

    const onSubmit = async () => {
        Keyboard.dismiss();
        setSubmitting(true);
        const ok = validateForm();
        if (!ok) {
            setSubmitting(false);
            return;
        }
        try {
            const user = await dispatch(
                signupUser({ email: formData.email, password: formData.password })
            ).unwrap();   // 🔥 THIS IS THE FIX

            console.log("User:", user);

        } catch (error: any) {
            console.log("Signup error:", error);
            if (error?.code === 'auth/email-already-in-use') {
                navigation.popTo('Login', { email: formData.email });
                showToast('Account already exists. Please login', {
                    type: "error",
                    duration: 5000,
                });
            }
            else {
                showToast(error?.message?.split(']')[1]?.trim(), {
                    type: "error",
                    duration: 5000,
                });
            }
        } finally {
            setSubmitting(false);
        }
    }

    const login = () => {
        navigation.popTo('Login', { email: formData.email });
    }

    return {
        formData,
        submitting,
        handleChange,
        errors,
        onSubmit,
        login
    }
}

export default useSignUpViewModal