import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import auth from '@react-native-firebase/auth';
import { checkEmail } from "../../../utils/checkEmail";
import { useToast } from "../../../hooks/ToastContext";
import { ForgotPasswordFormType, ForgotPasswordViewModalType } from "./ForgotPassword.modal";
import { useNavigation } from "@react-navigation/native";

const useForgotPasswordViewModal = (email?: string, fromProfile?: boolean): ForgotPasswordViewModalType => {
    const [formData, setFormData] = useState<ForgotPasswordFormType>({
        email: ''
    });
    const [errors, setErrors] = useState<ForgotPasswordFormType>({
        email: ''
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { showToast } = useToast();
    const navigation = useNavigation<any>();
    useEffect(() => {
        if (email) {
            setFormData(prev => ({
                ...prev,
                email: email
            }));
        }
    }, [email]);

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
        const emailValue = formData.email.trim();
        let valid = true;
        const newErrors: ForgotPasswordFormType = {
            email: ''
        };

        if (emailValue === '') {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!checkEmail(emailValue)) {
            newErrors.email = 'Provide a valid email';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const onSubmit = async () => {
        Keyboard.dismiss();
        setSubmitting(true);

        const ok = validateForm();
        if (!ok) {
            setSubmitting(false);
            return;
        }

        try {
            console.log('====================================');
            console.log(formData);
            console.log('====================================');
            const response = await auth().sendPasswordResetEmail(formData.email.trim());
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            showToast('Password reset link sent to your email', {
                type: 'success',
                duration: 5000,
            });
            if (fromProfile) {
                navigation.goBack();
            } else {
                navigation.popTo('Login', { email: formData.email });
            }
        } catch (error: any) {
            console.error(error);

            if (error?.code === 'auth/user-not-found') {
                showToast('No account found for this email', {
                    type: 'error',
                    duration: 5000,
                });
            } else {
                showToast(error?.message?.split(']')[1]?.trim() || 'Failed to send password reset email', {
                    type: 'error',
                    duration: 5000,
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return {
        formData,
        submitting,
        handleChange,
        errors,
        onSubmit
    };
};

export default useForgotPasswordViewModal;
