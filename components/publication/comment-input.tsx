import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { memo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const CommentInput = ({ currentCom, setCurrentCom, handleAddComment }: {
    currentCom: string,
    setCurrentCom: React.Dispatch<React.SetStateAction<string>>,
    handleAddComment: () => void
}) => {

    const [start, setStart] = useState(false);
    const inputRef = useRef<TouchableOpacity | null>(null);



    const toggleStartMessage = () => {
        setStart(!start)
    }

    return (
        <View className="w-full px-2 py-1 mt-1 bg-gray-300 flex-row rounded-lg">
            {/* Add Comment Input */}
            <TextInput
                className={` text-black-200 text-xs p-2  flex-1`}
                placeholder="Ecrire un commentaire ..."
                placeholderTextColor="black"
                value={currentCom}
                onChangeText={(text) => setCurrentCom(text)}
                onFocus={() => {
                    if (inputRef && inputRef.current && inputRef.current) {

                    }
                }}
                // onBlur={toggleStartMessage}/
                onEndEditing={toggleStartMessage}
            />

            <TouchableOpacity
                ref={inputRef}
                onPress={handleAddComment}
                className='w-fit p-2 rounded-full bg-gray-200' >
                {start ? <Text className='text-blue-500'>🛩️</Text> : <Ionicons name='paper-plane' size={25} color={'blue'} className='m-1' />}
            </TouchableOpacity>

        </View>

    )
}

export default memo(CommentInput);
