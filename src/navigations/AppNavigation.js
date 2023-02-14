import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/Home/HomeScreen";
import CategoriesScreen from "../screens/Categories/CategoriesScreen";
import RecipeScreen from "../screens/Recipe/RecipeScreen";
import RecipesListScreen from "../screens/RecipesList/RecipesListScreen";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import IngredientScreen from "../screens/Ingredient/IngredientScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import IngredientsDetailsScreen from "../screens/IngredientsDetails/IngredientsDetailsScreen";
import { AlanView } from "@alan-ai/alan-sdk-react-native";
import { NativeEventEmitter, NativeModules } from "react-native";
import { navigationRef } from "./RootNavigation";
import * as RootNavigation from "./RootNavigation.js";
import { recipes } from "../data/dataArrays";

const Stack = createStackNavigator();

const getRecipe = (name) => {
  let myRecipe = recipes.find((data) => data.title == name);
  return myRecipe;
};

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
          textAlign: "center",
          alignSelf: "center",
          flex: 1,
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
      <Stack.Screen name="RecipesList" component={RecipesListScreen} />
      <Stack.Screen name="Ingredient" component={IngredientScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen
        name="IngredientsDetails"
        component={IngredientsDetailsScreen}
      />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerStack() {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      initialRouteName="Main"
      drawerStyle={{
        width: 250,
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={({ navigation }) => (
        <DrawerContainer navigation={navigation} />
      )}
    >
      <Drawer.Screen name="Main" component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  const { AlanEventEmitter } = NativeModules;
  const alanEventEmitter = new NativeEventEmitter(AlanEventEmitter);

  useEffect(() => {
    alanEventEmitter.addListener("onCommand", (data) => {
      if (data.command == "openCategories") {
        RootNavigation.navigate("Categories");
      } else if (data.command == "goBack") {
        RootNavigation.navigate("Home");
      } else if (data.command == "openRecipe") {
        let item = getRecipe(data.name);
        console.log("item", item);
        RootNavigation.navigate("Recipe", { item });
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <DrawerStack />
      <AlanView projectid={""} />
    </NavigationContainer>
  );
}

console.disableYellowBox = true;
