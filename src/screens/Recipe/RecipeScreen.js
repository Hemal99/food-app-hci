import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  NativeModules,
} from "react-native";
import styles from "./styles";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  getIngredientName,
  getCategoryName,
  getCategoryById,
} from "../../data/MockDataAPI";
import BackButton from "../../components/BackButton/BackButton";
import ViewIngredientsButton from "../../components/ViewIngredientsButton/ViewIngredientsButton";
import { ingredients } from "../../data/dataArrays";

const { width: viewportWidth } = Dimensions.get("window");

const getIngredients = (ing) => {
  const idArr = [];
  const nameArr = [];

  for (let i = 0; i < ing.length; i++) {
    idArr.push(ing[i][0]);
  }

  for (let i = 0; i < idArr.length; i++) {
    nameArr.push(ingredients[idArr[i]]);
  }

  const ingredientArr = nameArr.map((e) => e.name);

  return ingredientArr;
};

export default function RecipeScreen(props) {
  const { navigation, route } = props;

  const item = route.params?.item;
  const ingredient = getIngredients(item.ingredients);

  const category = getCategoryById(item?.categoryId);
  const title = getCategoryName(category?.id);

  const [activeSlide, setActiveSlide] = useState(0);

  const slider1Ref = useRef();

  const { AlanManager } = NativeModules;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      AlanManager.setVisualState({ recipe: item, screen: "recipe" });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );

  const onPressIngredient = (item) => {
    var name = getIngredientName(item);
    let ingredient = item;
    navigation.navigate("Ingredient", { ingredient, name });
  };

  const sendIngredients = () => {
    AlanManager.activate();
    /// Provide any params with json
    AlanManager.callProjectApi(
      "script::getIngredientsList",
      { data: ingredient },
      (error, result) => {
        if (error) {
          console.error(error);
        } else {
          console.log(result);
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.carousel}>
          <Carousel
            ref={slider1Ref}
            data={item.photosArray}
            renderItem={renderImage}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            firstItem={0}
            loop={false}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => setActiveSlide(0)}
          />
          <Pagination
            dotsLength={item.photosArray.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotColor="rgba(255, 255, 255, 0.92)"
            dotStyle={styles.paginationDot}
            inactiveDotColor="white"
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={slider1Ref.current}
            tappableDots={!!slider1Ref.current}
          />
        </View>
      </View>
      <View style={styles.infoRecipeContainer}>
        <Text style={styles.infoRecipeName}>{item.title}</Text>
        <View style={styles.infoContainer}>
          <TouchableHighlight
            onPress={() =>
              navigation.navigate("RecipesList", { category, title })
            }
          >
            <Text style={styles.category}>
              {getCategoryName(item?.categoryId).toUpperCase()}
            </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.infoContainer}>
          <Image
            style={styles.infoPhoto}
            source={require("../../../assets/icons/time.png")}
          />
          <Text style={styles.infoRecipe}>{item.time} minutes </Text>
        </View>

        <View style={styles.infoContainer}>
          <ViewIngredientsButton
            onPress={() => {
              let ingredients = item.ingredients;
              let title = "Ingredients for " + item.title;
              navigation.navigate("IngredientsDetails", { ingredients, title });
              sendIngredients();
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoDescriptionRecipe}>{item.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
