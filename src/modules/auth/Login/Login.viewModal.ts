import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { checkEmail } from "../../../utils/checkEmail";
import { loginUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { LoginFormType, LoginViewModalType } from "./Login.modal";
import { useToast } from "../../../hooks/ToastContext";

const useLoginViewModal = (email?: string): LoginViewModalType => {
    console.log('====================================');
    console.log(email);
    console.log('====================================');
    const [formData, setFormData] = useState<LoginFormType>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<LoginFormType>({
        email: '',
        password: ''
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

    const handleChange = (field: string, value: string) => {
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
                loginUser({ email: formData.email, password: formData.password })
            ).unwrap();   // 🔥 THIS IS THE FIX

            console.log("User:", user);

        } catch (error: any) {
            console.log("Signup error:", error);
            if (error?.code === 'auth/invalid-credential') {
                showToast('Invalid email or password', {
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

    const signUp = () => {
        setSubmitting(false);
        navigation.navigate('SignUp', { email: formData.email });
    }

    const forgotPassword = () => {
        setSubmitting(false);
        navigation.navigate('ForgotPassword', { email: formData.email });
    }

    return {
        formData,
        submitting,
        handleChange,
        errors,
        onSubmit,
        signUp,
        forgotPassword
    }
}

export default useLoginViewModal