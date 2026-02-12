

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string[];
}

const slides: Slide[] = [
  {
    id: "1",
    title: "BIENVENUE SUR UN RICHE UN PAUVRE",
    description: [
      "NOUS SOMMES TOUS LE RICHE D'UN PAUVRE ET NOUS SOMMES TOUS LE PAUVRE D'UN RICHE.",
      "Cependant, avant tout, nous sommes des êtres humains, chacun d'entre nous ayant des rêves que nous aspirons à réaliser.",
      "Il arrive parfois que nous ne puissions pas concrétiser nos rêves par nous-mêmes, que ce soit par manque de moyens ou de soutien, et nous avons alors besoin de l'aide d'autrui pour les réaliser."
    ],
  },
  {
    id: "2",
    title: "",
    description: [
      "Cette application vous offre la possibilité de partager vos rêves, et quelqu'un sur cette terre pourra les concrétiser pour vous, selon sa propre volonté.",
      "Quel que soit le rêve, qu'il soit matériel, lié à la santé, à une carrière, à l'humain, au social, à l'humanitaire ou à tout autre domaine, vous pourrez l'exprimer librement sur ce site, permettant ainsi à autrui de le réaliser.",
      "Retrouvez votre humanité en partageant vos désirs et en contribuant à la réalisation des souhaits des autres.",
      "Ce qui peut sembler insignifiant pour vous peut revêtir une grande importance pour autrui, et vice versa."
    ],
  },
  {
    id: "3",
    title: "",
    description: [
      "Retrouvez votre humanité en partageant vos désirs et en contribuant à la réalisation des souhaits des autres.",
      "Ce qui peut sembler insignifiant pour vous peut revêtir une grande importance pour autrui, et vice versa.",
      "Les transactions effectuées sur ce site sont sécurisées et suivies.",
      "En tant qu'utilisateur, vous serez amené à valider votre identité dès que votre rêve sera réalisé, afin d'éviter toute usurpation."
    ],
  },
  {
    id: "4",
    title: "",
    description: [
      "Vous ne pourrez pas communiquer directement avec les autres utilisateurs, mais uniquement avec les administrateurs.",
      "Vous aurez la possibilité d'apprécier et de commenter les publications, ainsi que de les ajouter à vos favoris pour éventuellement les réaliser à votre convenance.",
      "Donner pour aider, recevoir pour rêver.",
      "Vous êtes le seul capable de transformer votre avenir, tout en influençant celui des autres."
    ],
  },
];

type OnboardingScreenProps = {
  onComplete?: () => void;
};

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleOnboardingComplete = async () => {
    console.log("inside the onboarding component! First time user, showing onboarding");
    // onComplete();
    console.log("has just onboarded...");
    // Mark onboarding as seen
    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
    // Navigate to login
    router.replace('/login');
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const updateCurrentSlideIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentIndex + 1;
    if (nextSlideIndex !== slides.length) {
      slidesRef.current?.scrollToIndex({
        index: nextSlideIndex,
        animated: true,
      });
      setCurrentIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    slidesRef.current?.scrollToIndex({
      index: slides.length - 1,
      animated: true,
    });
    setCurrentIndex(slides.length - 1);
    router.replace("/register");
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slideContainer, { width }]}>
        {item.title && (
          <Text style={styles.title}>
            {item.title}
          </Text>
        )}
        <View style={styles.paragraphContainer}>
          {item.description.map((paragraph, index) => (
            <Text
              key={index}
              style={styles.paragraph}
            >
              {paragraph}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const containerPadding = {
    paddingTop: insets.top + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <View style={[styles.container, containerPadding]}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/favicon.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />

      <View style={[
        styles.paginationContainer,
        { bottom: currentIndex === slides.length - 1 ? 120 : 160 }
      ]}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleOnboardingComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Commencez l'expérience
            </Text>
            <AntDesign name="arrowright" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={goToNextSlide}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                Suivant
              </Text>
              <AntDesign name="arrowright" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={skip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>
                Passer
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  slideContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: height * 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 24,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  paragraphContainer: {
    // gap: 16,
  },
  paragraph: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'justify',
    lineHeight: 24,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  flatListContent: {
    paddingTop: 20,
  },
  paginationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#2563EB',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  skipButton: {
    padding: 16,
    borderRadius: 12,
  },
  skipButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
});

export default OnboardingScreen;