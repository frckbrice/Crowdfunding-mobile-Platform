

import React, { memo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { getAllResourcesByTarget } from "@/lib/api";
import { icons } from "@/constants";
import { MESSAGES } from "@/constants/constants";
import CustomToast from "./custom-toast";


const SearchInput = ({ placeholder, onSearchResults }: { placeholder: string, onSearchResults: (results: any) => void }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });

  const showToast = (messageKey: "emptyQuery" | "searchError", type = "error") => {
    // You can determine the language based on your app's language settings
    const language = "fr"; // or "en" based on your app's language setting
    setToast({
      visible: true,
      message: MESSAGES[messageKey][language],
      type,
    });

    // Hide toast after 3.5 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      showToast("emptyQuery");
      return;
    }

    setLoading(true);
    try {
      const { data } = await getAllResourcesByTarget(
        "publications",
        query,
        "searchString"
      );
      onSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      showToast("searchError");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="relative">
      <CustomToast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
      />
      <View className="border-2 border-black-200 rounded-2xl w-full px-4 h-14 focus:border-secondary items-center bg-gray-700 flex-row justify-between space-x-4">
        <TextInput
          placeholder={placeholder}
          className="font-pregular text-white mt-0.5 flex-1 font-psemibold text-base"
          value={query}
          onChangeText={setQuery}
          onBlur={handleSearch}
          placeholderTextColor="#CDCDE0"
        />
        <TouchableOpacity onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator size="small" color="#60A5FA" />
          ) : (
            <Image
              source={icons.search}
              className="w-5 h-5"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(SearchInput);
