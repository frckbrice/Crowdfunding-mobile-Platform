// libs
import React from "react";
import { View, Text, Image } from "react-native";
import { Href, router } from "expo-router";

// constants
import { images } from "../constants";

// components
import CustomButton from "./custom-button";

type ESProps = {
  title: string;
  subtitle: string;
  label: string;
  route?: string | (() => void);
  subtitleStyle?: string;
  titleStyle?: string
}

function EmptyState({
  title,
  subtitle,
  label,
  titleStyle,
  subtitleStyle,
  route }: ESProps) {

  let handler;
  if (route)
    handler = route

  return (
    <View className="justify-center items-center px-4 pb-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[215px]"
      />
      <View className="mb-5 flex justify-center items-center gap-2">
        <Text className={"text-sm font-pmedium " + titleStyle}>{title}</Text>
        <Text className={subtitleStyle}>{subtitle}</Text>
      </View>

      {/* Add a button here */}
      <CustomButton
        containerStyles="my-4 w-full ring border border-none  bg-blue-500 "
        title={label}
        handlePress={route as () => void}
        textStyles="text-white font-bold"
      />
    </View>
  );
}

export default EmptyState;
