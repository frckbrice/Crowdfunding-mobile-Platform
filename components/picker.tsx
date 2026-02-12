import SelectDropdown from 'react-native-select-dropdown'
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category, Publication } from '@/lib/types';
import { getAllResourcesByTarget } from '@/lib/api';

type TPicker = {
    options: Category[];
    getCurrentCat?: (...event: any) => void
    onCategorySelect?: (data: any) => void,
    important?: boolean,
    isLoading?: boolean
}
export function SelectItem({
    options,
    getCurrentCat,
    onCategorySelect,
    important,
    isLoading
}: TPicker) {
    const [uploading, setUploading] = useState(false);
    const handleCategoryPress = async (categoryId: string) => {
        setUploading(true);
        try {
            const { data } = await getAllResourcesByTarget(  // get the publications of this category.
                "publications",
                categoryId,
                "idCat"
            );
            onCategorySelect && onCategorySelect(data || []);
        } catch (error) {
            console.error("Category fetch error:", error);
            Alert.alert("Error", "Impossible de charger les publications de cette categorie");
        } finally {
            setUploading(false);
        }
    };

    return (
        <SelectDropdown
            data={options}
            onSelect={(selectedItem, index) => {
                console.log("in select component: ", selectedItem, index);
                // send api call to get the category with current ID.
                //    handleCategoryPress(selectedItem.id);
                getCurrentCat ? getCurrentCat(selectedItem?.id) : handleCategoryPress(selectedItem.id);
            }}
            renderButton={(selectedItem, isOpened) => {
                return (
                    <View style={styles.dropdownButtonStyle}>
                        {
                            uploading ?
                                <ActivityIndicator size="small" color="white" /> :
                                <View className='flex-row items-center justify-between'>
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.name) || `Selectionnez une categorie `}
                                        {important && !selectedItem?.name && <Text className="text-red-500">*</Text>}
                                    </Text>
                                    {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text className='text-xs text-white'>▼</Text>}
                                </View>
                        }
                    </View>
                );
            }}
            renderItem={(item, index, isSelected) => {
                return (
                    <View style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && { backgroundColor: '#6b7280' })
                    }}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                    </View>
                );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
        />
    )
}



const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: '100%',
        height: 40,
        backgroundColor: '#1f2937',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginVertical: 2,
        marginTop: 0,

    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#fff',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        borderColor: '#6b7280',
        borderWidth: 0.5,
        marginTop: 0
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: '#111827',
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 14.5,
        fontWeight: '500',
        color: '#fff',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});