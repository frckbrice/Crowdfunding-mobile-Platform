// // CategoryList.tsx
// import React, { useState, memo, useEffect } from "react";
// import { View, TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
// import { getAllResourcesByTarget } from "@/lib/api";
// import { Category } from "@/lib/types";

// type CategoryType = {
//   categories: Category[],
//   onCategorySelect: (data: any) => void,
// }

// const CategoryList = ({ categories, onCategorySelect }: CategoryType) => {
//   const [loading, setLoading] = useState(false);
//   const [selectedId, setSelectedId] = useState("");
//   const [cats, setCats] = useState<Category[]>([]);

//   useEffect(() => {
//     setCats(categories);
//   }, []);

//   console.log("from category list: ", cats);

//   const handleCategoryPress = async (categoryId: string) => {
//     setSelectedId(categoryId);
//     setLoading(true);
//     try {
//       const { data } = await getAllResourcesByTarget(
//         "publications",
//         categoryId,
//         "idCat"
//       );
//       onCategorySelect(data || []);
//     } catch (error) {
//       console.error("Category fetch error:", error);
//       Alert.alert("Error", "Impossible de charger les publications de cette categorie");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View className="space-y-1">
//       {cats?.map((category) => {

//         console.log("from category list: ", category);
//         return (
//           // <TouchableOpacity
//           //   key={category.id}
//           //   onPress={() => handleCategoryPress(category.id)}
//           //   className="bg-white/90 rounded-lg px-4 py-2 h-10"
//           // >
//           //   <View className="flex-row justify-between">
//           //     <Text className="text-black-100">{category.nomCat}</Text>
//           //     <View>
//           //       <Text>
//           //         {loading && category.id === selectedId && (
//           //           <ActivityIndicator size="small" color="black" animating={loading} />
//           //         )}
//           //       </Text>
//           //     </View>
//           //   </View>
//           // </TouchableOpacity>
//           (
//             <TouchableOpacity
//               key={category.id}
//               onPress={() => handleCategoryPress(category.id)}
//               className="bg-red-500 rounded-lg px-4 py-2 h-10"
//             >
//               <View className="flex-row justify-between">
//                 <Text className="text-black-100">{category.name}</Text>
//                 {loading && selectedId === category.id && (
//                   <ActivityIndicator size="small" color="black" />
//                 )}
//               </View>
//             </TouchableOpacity>
//           )
//         );
//       })}
//     </View>
//   );
// };

// export default CategoryList;
