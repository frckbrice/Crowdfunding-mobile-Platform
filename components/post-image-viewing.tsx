import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import ImageViewing from "react-native-image-viewing";

type PostImageProps = {
    imageUrl: string;
};

const PostImage: React.FC<PostImageProps> = ({ imageUrl }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View className="items-center justify-center mb-3">
            {/* Post Image (Clickable) */}
            <TouchableOpacity onPress={() => setVisible(true)} className=" rounded-xl">
                <Image
                    source={imageUrl ? { uri: imageUrl } : require('../assets/images/appdonateimg.jpg')}
                    className="w-96 h-48 rounded-xl sm:w-full sm:h-64"
                    resizeMode="cover"
                />

            </TouchableOpacity>

            {/* Fullscreen Image Viewer */}
            <ImageViewing
                images={[{ uri: imageUrl }]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />
        </View>
    );
};

export default PostImage;
