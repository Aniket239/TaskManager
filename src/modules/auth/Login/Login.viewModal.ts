import { useState } from "react";
import { Keyboard } from "react-native";
import { checkEmail } from "../../../utils/checkEmail";
import { loginUser, signupUser } from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";

const useLoginViewModal = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
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
        setLoading(true);
        const ok = validateForm();
        if (!ok) {
            setLoading(false);
            return;
        }
        else {
            const response = await dispatch(loginUser({ email: formData.email, password: formData.password }));
            // const response = await dispatch(signupUser({ email: formData.email, password: formData.password }));
            console.log('====================================');
            console.log(response);
            console.log('====================================');
        }
    }

    return {
        formData,
        loading,
        handleChange,
        errors,
        onSubmit
    }
}

export default useLoginViewModal