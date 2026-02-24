import { Dayjs } from "dayjs"

export interface AddEditTaskFormType {
    title: string,
    description: string,
    startDateTime: Dayjs | null | string,
    endDateTime: Dayjs | null | string,
}

export interface AddEditTaskErrorsType {
    title: string,
    startDateTime: string,
    endDateTime: string,
}

export interface AddEditTaskViewModalType {
    formData: AddEditTaskFormType,
    errors: AddEditTaskErrorsType,
    handleChange: (field: string, value: any) => void,
    onSubmit: () => Promise<void>,
    submitting: boolean
}
