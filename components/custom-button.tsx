import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export type TButtonPros = {
  title: string,
  handlePress: () => void,
  containerStyles?: string,
  textStyles?: string,
  isLoading?: boolean,
};

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: TButtonPros) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8} // opacity of the button when pressed
      className={`rounded-xl  justify-center items-center py-3 px-4 ${containerStyles} ${isLoading ? "opacity-50" : ""
        } `}
      disabled={isLoading}
    >
      <Text className={`${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
