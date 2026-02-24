import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"
import { AddEditTaskErrorsType, AddEditTaskFormType, AddEditTaskViewModalType } from "./AddEditTask.modal"
import { useToast } from "../../../../hooks/ToastContext"
import TaskService from "../services/Task.service"
import { TaskType } from "../Tasks.modal"
import { useNavigation } from "@react-navigation/native"

const useAddEditTaskViewModal = (task: TaskType): AddEditTaskViewModalType => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<AddEditTaskFormType>({
        title: '',
        description: '',
        startDateTime: null,
        endDateTime: null,
    })

    const [errors, setErrors] = useState<AddEditTaskErrorsType>({
        title: '',
        startDateTime: '',
        endDateTime: '',
    })

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                startDateTime: task.start_date_time ? task.start_date_time : null,
                endDateTime: task.end_date_time ? task.end_date_time : null,
            })
        }
    }, [task])

    const { showToast } = useToast();
    const navigation = useNavigation<any>();
    const userUid = useSelector((state: RootState) => state.auth.user?.uid)
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        setErrors(prev => ({
            ...prev,
            [field]: ''
        }))
    }

    const validateForm = (): boolean => {
        let valid = true;
        let newErrors: any = {};

        const now = new Date();
        const start = formData.startDateTime ? new Date(formData.startDateTime) : null;
        const end = formData.endDateTime ? new Date(formData.endDateTime) : null;

        if (formData.title.trim() === '') {
            newErrors.title = 'Title is required';
            valid = false;
        }

        if (!start) {
            newErrors.startDateTime = 'Start date is required';
            valid = false;
        } else if (start < now) {
            newErrors.startDateTime = 'Start date cannot be in the past';
            valid = false;
        }

        if (!end) {
            newErrors.endDateTime = 'Due date is required';
            valid = false;
        } else if (start && end <= start) {
            newErrors.endDateTime = 'Due date must be after start date';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const onSubmit = async () => {
        setSubmitting(true);
        const ok = validateForm();
        if (!ok) {
            setSubmitting(false);
            return;
        }
        if (!userUid) {
            console.warn('User is not authenticated. Cannot save task.');
            showToast("User is not authenticated. Cannot save task", {
                type: "error",
                duration: 5000
            })
            return;
        }
        if (task) {
            try {
                await TaskService.updateTask(task.id, formData);
                showToast("Task updated successfully", {
                    type: "success",
                    duration: 3000
                });
                navigation.goBack();
            } catch (error: any) {
                console.error(error);
                showToast(error.message || "Failed to update task", {
                    type: "error",
                    duration: 5000
                });
            }
            finally {
                setSubmitting(false);
            }
        }
        else {
            try {
                await TaskService.createTask(formData, userUid);

                showToast("Task created successfully", {
                    type: "success",
                    duration: 3000
                });
                navigation.goBack();

            } catch (error: any) {
                console.error(error);
                showToast(error.message || "Failed to save task", {
                    type: "error",
                    duration: 5000
                });
            }
            finally {
                setSubmitting(false);
            }
        }
    }
    return {
        formData,
        handleChange,
        errors,
        onSubmit,
        submitting
    }
}

export default useAddEditTaskViewModal
