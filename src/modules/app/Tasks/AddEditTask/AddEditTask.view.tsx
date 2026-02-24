import { Text, View } from 'react-native'
import React from 'react'
import { getGlobalStyles } from '../../../../styles/globalStyles'
import Navbar from '../../../../components/Navbar';
import useAddEditTaskViewModal from './AddEditTask.viewModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import InputField from '../../../../components/InputField';
import DateInputField from '../../../../components/DateInputField';
import CustomButton from '../../../../components/CustomButton';

const AddEditTask = ({ route }: any) => {
    const { task } = route.params
    const globalStyles = getGlobalStyles();
    const { formData, errors, handleChange, onSubmit } = useAddEditTaskViewModal(task);

    return (
        <View style={globalStyles.container}>
            <Navbar title={task ? 'Edit Task' : 'Add Task'} />
            <KeyboardAwareScrollView contentContainerStyle={globalStyles.formContentContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={[globalStyles.column]}>
                    <Text allowFontScaling={false} style={globalStyles.heading}>{task ? 'Edit Task' : 'Create Task'}</Text>
                    <Text allowFontScaling={false} style={globalStyles.subHeading}>Add details to track your task</Text>
                </View>
                <InputField
                    label={'Title'}
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                    error={!!errors.title}
                    errorMessage={errors.title}
                    maxLength={250}
                    required
                />
                <InputField
                    label={'Description'}
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                    maxLength={1000}
                    textarea
                />
                <DateInputField
                    label={'Start At'}
                    value={formData.startDateTime}
                    onChange={(value) => handleChange('startDateTime', value)}
                    error={!!errors.startDateTime}
                    errorMessage={errors.startDateTime}
                    required
                    use12Hours
                    timePicker
                    minDate={new Date()}
                />
                {formData.startDateTime &&
                    <DateInputField
                        label={'End At'}
                        value={formData.endDateTime}
                        onChange={(value) => handleChange('endDateTime', value)}
                        error={!!errors.endDateTime}
                        errorMessage={errors.endDateTime}
                        required
                        use12Hours
                        timePicker
                        minDate={formData.startDateTime}
                    />
                }
                <CustomButton
                    title={task ? 'Update Task' : 'Create Task'}
                    onPress={onSubmit}
                />
            </KeyboardAwareScrollView>
        </View>
    )
}

export default AddEditTask
