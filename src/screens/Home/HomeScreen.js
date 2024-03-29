import React, { useLayoutEffect, useEffect } from "react";
import { FlatList, Text, View, Image, NativeModules } from "react-native";
import styles from "./styles";
import { recipes } from "../../data/dataArrays";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName } from "../../data/MockDataAPI";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeScreen(props) {
  const { navigation } = props;

  const { AlanManager } = NativeModules;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      AlanManager.setVisualState({ screen: "home" });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPressRecipe(item)}>
        <View>
          <Image style={styles.photo} source={{ uri: item.photo_url }} />

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.category}>
            {getCategoryName(item.categoryId)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={recipes}
        renderItem={renderRecipes}
        keyExtractor={(item) => `${item.recipeId}`}
      />
    </View>
  );
}
