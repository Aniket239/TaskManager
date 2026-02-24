/* eslint-disable react-native/no-inline-styles */
import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getGlobalStyles } from '../../../../styles/globalStyles';
import { useTheme } from '../../../../hooks/ThemeContext';
import Tooltip from '../../../../components/Tooltip';
import { formatDate } from '../../../../utils/formatDate';
import CardMenuItem from '../../../../components/CardMenuItem';
import CardMenuButton from '../../../../components/CardMenuButton';
import DialogBox from '../../../../components/DialogBox';
import { TaskCardType } from '../Tasks.modal';

const TaskCard = ({ task, changeStatus, deleteTask }: TaskCardType) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const globalStyles = getGlobalStyles();
    const navigation = useNavigation<any>();
    console.log('====================================');
    console.log(task);
    console.log('====================================');
    const { themeStyles } = useTheme();

    const editTask = () => {
        navigation.navigate("AddEditTask", { task: task });
    }

    return (
        <>
            <View style={globalStyles.cardContainer}>
                <View style={[globalStyles.row, { alignItems: 'flex-start' }]}>
                    <TouchableOpacity activeOpacity={0.7} style={[globalStyles.row, { justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'nowrap' }]} onPress={() => changeStatus(task?.id, task?.is_completed)}>
                        <View style={[globalStyles.cardButton, { marginLeft: -5, marginTop: -5 }]}>
                            <Image style={[globalStyles.cardButtonIcon, { tintColor: task?.is_completed ? themeStyles.textSecondary : themeStyles.text }]} source={task?.is_completed ? require('../../../../assets/images/common/checked.png') : require('../../../../assets/images/common/unChecked.png')} />
                        </View>
                        <Text allowFontScaling={false} style={[globalStyles.cardHeading, { flex: 1, marginTop: -3, textDecorationLine: task?.is_completed ? 'line-through' : 'none', color: task?.is_completed ? themeStyles.textSecondary : themeStyles.text }]}>{task?.title}</Text>
                    </TouchableOpacity>
                    <Tooltip
                        visible={showMenu}
                        onOpen={() => setShowMenu(true)}
                        onClose={() => setShowMenu(false)}
                        placement='bottom-left'
                        content={
                            <View style={globalStyles.column}>
                                <CardMenuItem type='EDIT' onPress={() => { editTask(); setShowMenu(false); }} />
                                <CardMenuItem type='DELETE' onPress={() => { setShowDeleteModal(true); setShowMenu(false); }} />
                            </View>
                        }
                    >
                        <CardMenuButton />
                    </Tooltip>
                </View>
                <View style={[globalStyles.column, { gap: 15 }]}>
                    {task?.description &&
                        <Text allowFontScaling={false} style={[globalStyles.cardLabel, { textDecorationLine: task?.is_completed ? 'line-through' : 'none', }]}>{task?.description}</Text>
                    }
                    <View style={globalStyles.row}>
                        <View style={globalStyles.column}>
                            <Text allowFontScaling={false} style={[globalStyles.cardLabel, { fontStyle: 'italic' }]}>Start At</Text>
                            <View style={[globalStyles.row, { justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'nowrap', flex: undefined }]}>
                                <Image style={globalStyles.cardIcon} source={require('../../../../assets/images/bottomNav/meetings.png')} />
                                <Text style={globalStyles.cardValue}>{formatDate(task?.start_date_time, true)}</Text>
                            </View>
                        </View>
                        <View style={globalStyles.column}>
                            <Text allowFontScaling={false} style={[globalStyles.cardLabel, { fontStyle: 'italic' }]}>End At</Text>
                            <View style={[globalStyles.row, { justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'nowrap', flex: undefined }]}>
                                <Image style={globalStyles.cardIcon} source={require('../../../../assets/images/bottomNav/meetings.png')} />
                                <Text style={globalStyles.cardValue}>{formatDate(task?.end_date_time, true)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <DialogBox
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={'Delete Task'}
                subTitle={'Are you sure you want to delete this task?'}
                onSubmit={() => { setShowDeleteModal(false); deleteTask(task?.id); }}
                confirmButtonText={'Delete'}
                confirmButtonColor={themeStyles.error}
            />
        </>
    )
}

export default TaskCard
