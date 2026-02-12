import Constants from "expo-constants";
const { manifest } = Constants;

// get the local IP address at run time.
const uri =
    Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':5000') ??
    'yourapi.com';

// export const API_URL = `http://${uri}/api`;
export const API_URL = process.env.EXPO_PUBLIC_PROD_API_URL;

export const TOKEN_KEY = process.env.EXPO_PUBLIC_JWT_SECRET_KEY;
export const PAYPAL_DONATION_BUTTON_ID = process.env.EXPO_PUBLIC_PAYPAL_DONNATION_BUTTON_ID


export const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID
export const PAYPAL_SECRET = process.env.EXPO_PUBLIC_PAYPAL_SECRET;

console.log({ PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_DONATION_BUTTON_ID })
export const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;
export const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
export const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID;
export const storageId = process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID;


// message for toast.
export const MESSAGES = {
    emptyQuery: {
        en: "Please enter a search query",
        fr: "Veuillez saisir une recherche",
    },
    searchError: {
        en: "Failed to perform search",
        fr: "Échec de la recherche",
    },
    Mauvais_mot_de_passe: {
        en: "Please enter a right pass word",
        fr: "Veuillez saisir un mot de passe correct",
    },
    Non_Correspondance_de_mots_de_passes: {
        en: "Failed to correspond the passwords",
        fr: "les mots de passe ne correspondent pas",
    },
    error_de_modification_de_mot_de_passe: {
        en: "Failed to update the password",
        fr: "Echec de la modification du mots de passe",
    },
    success_de_modification_de_mot_de_passe: {
        en: "successfully updated the password",
        fr: "success de la modification du mots de passe",
    },
    No_Current_user_ID: {
        en: "No current user Id found",
        fr: "Pas d'identifiant pour l'utilisateur courant",
    },
    mauvais_identifiants: {
        en: "Bad credentials username or password",
        fr: "une erreur s'est produite lors de l'authentification",
    },
    erreur_de_connection: {
        en: "Failed to Connect to the server",
        fr: "Echec de la connexion au serveur",
    },
    Error_resetting_password: {
        en: "Failed to reset the password",
        fr: "Erreur de mise a jour du mot de passe",
    },
    // handle any other error
    '': {
        en: "An error occurred",
        fr: "Une erreur s'est produite",
    },


};
