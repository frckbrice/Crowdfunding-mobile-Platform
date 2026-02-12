
// import lib

// import the client library
import { AppError } from '@/utils/error-class';
// import { tokenCache } from '@/store/persist-token-cache';
import axios from 'axios';
import { Comment, Jaime, Post, User } from '@/lib/types';
import * as FileSystem from 'expo-file-system';
// appWrite config

import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    ImageGravity,
    Query,
    Storage
} from 'react-native-appwrite';
import { tokenCache } from '@/store/persist-token-cache';
import { API_URL, collectionId, databaseId, platform, projectId, storageId } from '@/constants/constants';
// import { supabase } from '@/utils/supabase';


export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform,
    projectId,
    databaseId,
    collectionId,
    storageId
}


// Init your React Native SDK
const client = new Client();


client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId!) // Your project ID
    .setPlatform(config.platform!) // Your application ID or bundle ID.
    ;

// Init account instance
const account = new Account(client);
// Init avatar
const avatars = new Avatars(client);
// create instance of DB
const databases = new Databases(client);
// storage
const storage = new Storage(client);

// getthe current user
export const getCurrentUser = async () => {
    try {
        // const currentAccount = await account.get();

        // if (!currentAccount) new AppError("\n\nNo account found");

        const currentUser = await databases.listDocuments(
            config.databaseId!,
            config.collectionId!,
            [Query.equal('accountId', "66d6e445001e3ab12932")],
        );
        console.log("current user appwrite account: ", currentUser)
        if (!currentUser) new AppError("\n\nerror getting current user");
        return currentUser.documents[0];

    } catch (error: any) {
        console.log(`error getting current user`, error);
        throw new Error(error);
    }
}


// returns the url of the file from the bucket
export const getFilePreview = async (fileId: string, type: string) => {
    let fileUrl;
    console.log("fileId: ", fileId);
    try {
        if (type === 'video' || type === 'pdf') {
            fileUrl = storage.getFileView(config.storageId!, fileId);
        }
        else if (type === 'image')
            fileUrl = storage.getFilePreview(config.storageId!, fileId, 2000, 2000, 'top' as ImageGravity, 100);
        else
            throw new AppError('File type not supported');

        if (!fileUrl) throw new AppError('File not found');
        // return the file url
        return fileUrl;
    } catch (error: any) {
        console.log(` error getting file ${error}`);
        throw new AppError(`Error getting ${error.message}`);
    }
}

// store the file and get the url from the bucket.
export const uploadFile = async (file: any, type: string) => {
    if (!file) return;

    // Convert local file URI to Blob/File for Appwrite
    const fileBlob = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64
    });
    let asset: any
    if (file.uri.split('.').pop() === 'pdf')
        asset = {
            name: file.name,
            type: file.type,
            size: file.size,
            uri: file.uri ?? fileBlob,
        }; // to format it in a format understood by appwrite
    else
        asset = {
            name: file.fileName,
            type: file.mimeType,
            size: file.fileSize,
            uri: file.uri ?? fileBlob,
        }; // to format it in a format understood by appwrite

    console.log(` asset :`, file);
    console.log("\n\n storage ID: ", { storageId: config.storageId, id: ID.unique(), asset })

    try {

        // ID.unique() assigns a unique Id to this file
        const uploadedFile = await storage.createFile(config.storageId!, ID.unique(), asset);
        console.log(` uploadedFile file : ${uploadedFile}`);
        const fileUrl = await getFilePreview(uploadedFile?.$id, type);// getFilePreview is a bit different from audio and video.
        return fileUrl;
    } catch (error: any) {
        console.log(` error uploading file ${error?.stack}`);
        throw new AppError(`Error uploading ${error.message}`);
    }
}

// upload video
export const getFileUrlFromProvider = async (asset: {
    name: string,
    type: string,
    size: number,
    uri: string,
}) => {

    // store the files and get the urls.
    try {
        const thumbnailUrl = await uploadFile(asset, 'image');

        return thumbnailUrl;
    } catch (e: any) {
        console.log(`error creating file url link `, e);
        throw new AppError(e.message);
    }
}

// console.log("\n\n API_URL: ", {
//     API_URL
// },)

type TConnect = User;

// getthe current user
export const createUserAccount = async (
    mdpUser: string,
    username: string,
    endPoint: string,
    nomUser?: string) => {
    let dataObj, resouce;
    if (endPoint.includes('users')) {
        dataObj = {
            nomUser: nomUser,
            mdpUser: mdpUser,
            username: username,
            etatUser: false,
            docUser: '',
        } as TConnect;
    }
    else if (endPoint.includes('auth/login')) {
        dataObj = {
            username,
            password: mdpUser,
        }
    }
    resouce = endPoint;
    console.log("\n\ndata object: ", {
        dataObj, API_URL: `${API_URL}/${resouce}`
    },
        "resource: ", resouce
    )
    try {

        const options = {
            method: 'POST',
            // url: `${API_URL}/${resouce}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: dataObj
        }

        // const response = await axios.request(options);
        const data = await fetch(`${API_URL}/${resouce}`, options);
        const response = await data.json();
        console.log("\n\nfrom api file connect fct", response?.data);
        return response?.data
    } catch (error: any) {
        console.error("Failed to connect to app : ", error);
        throw new Error(error);
    }
}


export const updatedUserPwd = async (
    newPassw: string,
    idUser: number
) => {

    const dataObj = {
        mdpUser: newPassw,
    };

    console.log(`${API_URL}/users/${idUser}`);

    try {
        const token = await tokenCache.getToken('currentUser');
        if (!token)
            return console.error("\n\n in updatedUserPwd fct, No token found");

        const options = {
            method: 'PATCH',
            url: `${API_URL}/users/${idUser}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',

            },
            data: JSON.stringify(dataObj)
        }

        // const response = await axios.request(options);
        // console.log("\n\nfrom api file connect fct", response?.data);
        const data = await fetch(`${API_URL}/users/${idUser}`, options);
        const response = await data.json();
        return response
    } catch (error: any) {
        console.error("Failed to connect to app : ", error);
        throw new Error(error);
    }
}

export const getAllResourcesByTarget = async <T>(
    resource: string,
    id?: string,
    target1?: string,
    target2?: string,
    value?: boolean | number
): Promise<T[] | any> => {


    try {
        const token = await tokenCache.getToken('currentUser');
        if (!token)
            return console.error("\n\n in getAllResourcesByTarget fct, No token found");

        if (!id || !resource) {
            console.error(` from api file Resource ${resource} not found or resource id ${id} is missing`);
            return [];
        }

        let query: string = "";
        if (target1)
            query += `${target1}=${id}`;
        if (target2)
            query += `&${target2}=${value}`;
        if (target1 && target2)
            query += `${target1}=${id}&${target2}=${value}`;


        const url = `${API_URL}/${resource}?` + query;

        console.log("\n\n url: ", { url, resource, query });

        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token ?? ""}`,
            },
        };

        const response = await fetch(url, options);

        // Check if response is OK
        if (!response.ok) {
            console.error(
                `Error: HTTP status ${response.status} (${response.statusText}) for resource "${resource}"`
            );
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Safely parse JSON
        try {
            const data = await response.json();
            // console.log("from api file on getAllResourcesByTarget fct and resource " + resource, "data is:", data);
            if (resource === "publications") {
                const value = data?.data?.map((resp: any) => ({
                    id: resp?.id,
                    idPub: resp?.id,
                    location: resp?.location ?? "origine inconnue",

                    content: resp?.libelePub ?? "pas de contenu",
                    imageUrl: resp?.imagePub,
                    documentUrl: resp?.documentUrl,
                    montant: resp?.montantEstime,
                    comments: resp?.commentaires as Comment[] ?? [],

                    timeAgo: resp?.datePub ?? "",
                    idUser: resp?.idUser,
                    idCat: resp?.idCat,
                    statePub: resp?.etat,
                    author: resp?.user,
                    category: resp?.categorie ?? "categorie inconnue",
                    likes: resp?.likes as Jaime[] ?? []
                }))

                return {
                    data: value,
                    total: data?.total,
                    page: data?.page,
                    pageSize: data?.perPage,
                    message: data?.message,
                    status: data?.status
                }
            }
            return data;
        } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            throw new Error("Failed to parse JSON response");
        }
    } catch (error: any) {
        console.error(
            `from api file getAllResourcesByTarget fct. Error fetching all resources "${resource}" by id ${id} : ${error.message}`
        );
        throw error;
    }
}

// pull all videos
export const getAllPublications = async (page?: number, pageSize?: number): Promise<Post[] | any> => {

    const token = await tokenCache.getToken('currentUser');
    if (!token)
        return console.error("\n\n in getAllPublications fct, No token found");
    try {

        if (!page) page = 1;
        if (!pageSize) pageSize = 10;

        const options = {
            method: 'GET',
            // params: {
            //     page,
            //     pageSize
            // }, 
            url: `${API_URL}/publications?page=${page}&perPage=${pageSize}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
        }

        const response = await axios.request(options);
        // console.log("\n\nfrom api file getAllPublications fct", response?.data?.data);

        const data = response?.data?.data?.map((resp: any) => ({
            id: resp?.id,
            idPub: resp?.id,
            // author: resp?.nomUser ?? "ANONYMOUS",
            location: resp?.location ?? "origine inconnue",
            content: resp?.libelePub ?? "pas de contenu",
            imageUrl: resp?.imagePub,
            documentUrl: resp?.documentUrl,
            montant: resp?.montantEstime,
            comments: resp?.commentaires as Comment[] ?? [],
            timeAgo: resp?.datePub ?? "",
            idUser: resp?.idUser,
            idCat: resp?.idCat,
            statePub: resp?.etat,
            author: resp?.user,
            category: resp?.categorie ?? "categorie inconnue",
            likes: resp?.likes as Jaime[] ?? []
        }))

        return {
            data,
            total: response?.data?.total,
            page: response?.data?.page,
            pageSize: response?.data?.perPage,
            message: response?.data?.message,
            status: response?.data?.status
        }

    } catch (error: any) {
        console.error(`from api file. Error fetching Publication data : ${error}`);
        throw new Error(error);
    }
}

// update pub
export const updateResource = async <T>(resource: string, id: string, value: Partial<T>): Promise<T | any> => {

    try {

        const token = await tokenCache.getToken('currentUser');
        if (!token)
            return console.error("\n\n in updateResource fct, No token found");

        if (!id || !resource)
            return console.error("\n\n No user Id or resource provided!")

        const options = {
            method: 'PUT',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
            data: value
        };

        const response = await axios.request(options);
        console.log("\n\n from updateResource request fct", response?.data.data);
        return response?.data.data;
    } catch (error: any) {
        console.error(`inside updateResource fct on api file. Error updating resource ${resource} with id ${id} : ${error}`);
        throw new Error(error);
    }
}


// update pub
export const patchResource = async <T>(resource: string, id: string, value: Partial<T>): Promise<T | any> => {

    try {

        const token = await tokenCache.getToken('currentUser');
        if (!token)
            return console.error("\n\n in updateResource fct, No token found");

        if (!id || !resource)
            return console.error("\n\n No user Id or resource provided!")

        const options = {
            method: 'Patch',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
            data: value
        }

        const response = await axios.request(options);
        console.log("\n\n from patchResource request fct", response?.data.data);
        return response?.data.data;
    } catch (error: any) {
        console.error(`inside patchResource fct on api file. Error updating resource ${resource} with id ${id} : ${error}`);
        throw new Error(error);
    }
}


// pull latest videos
export const getSingleResource = async (resource: string, id: string) => {

    // const token = await tokenCache.getToken("token");
    console.log("from api file API_URL: ", `${API_URL}/${resource}/${id}`);
    try {
        const token = await tokenCache.getToken('currentUser');
        if (!token)
            return console.error("\n\n in getSingleResource fct, No token found");

        const options = {
            method: 'GET',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await axios.request(options);
        // console.log("from api file getSingleResource fct:", response?.data);

        if (resource.toLocaleLowerCase().includes('publication'))
            return {
                id: response?.data.data.id,
                author: response?.data.data.user,
                content: response?.data.data.libelePub ?? "",
                imageUrl: response?.data.data.imagePub ?? "",
                likes: response?.data.data.likes ?? [],
                comments: response?.data.data.commentaires ?? [],
                timeAgo: response?.data.data.datePub ?? "",
                idUser: response?.data.data.idUser,
                idPub: response?.data.data.idPub,
                idCat: response?.data.data.idCat,
                statePub: response?.data.data.etat
            };
        else if (resource.toLocaleLowerCase().includes('categorie'))
            return response.data.data?.map((cat: any) => ({
                id: cat?.id,
                idUser: cat?.idUser,
                name: cat?.nomCat,
                type: cat?.typeCat,
            }))
        else return response?.data;

    } catch (error: any) {
        console.error(`inside getSingleResource failed fetching resouce ${resource} with id: ${id} : ${error}`);
        throw new Error(error);
    }
}

// logout

export const getAllCategories = async () => {

    const token = await tokenCache.getToken('currentUser');
    if (!token)
        return console.error("\n\n in getAllCategories fct, No token found");

    try {

        const options = {
            method: 'GET',
            // url: `${API_URL}/Categorie`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
        }

        // const response = await axios.request(options);
        // console.log("\n\nfrom api file getAllCategories fct", response?.data);
        const data = await fetch(`${API_URL}/categories`, options);
        const response = await data.json();

        // console.log("\n\nfrom api file getAllCategories fct", response);

        return response?.data.map((cat: any) => ({
            id: cat?.id,
            idUser: cat?.idUser,
            name: cat?.nomCat,
            type: cat?.typeCat,
        }))

    } catch (error: any) {
        console.error(`from api file getAllCategories ftc. Error fetching Publication data : ${error}`);
        throw new Error(error);
    }
}

// store the file and get the url from the bucket.
export const uploadResourceData = async <T>(
    dataValues: T, resource: string
): Promise<T | null | any> => {

    const token = await tokenCache.getToken('currentUser');
    if (!token)
        return console.error("\n\n in uploadResourceData fct, No token found");

    console.log("\n\n dataValues and resource: ", dataValues, resource);

    try {

        console.log("\n\n from api file url ", `${API_URL}/${resource}`);
        const options = {
            method: 'POST',
            url: `${API_URL}/${resource}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                // Accept: 'application/json'

            },
            data: dataValues
        }

        const response = await axios.request(options);
        // console.log(`\n\nfrom api file uploadResourceData fct, and resource: ${resource}`, response?.data);
        if (response.data)
            return response.data.data;
        return null;

    } catch (error: any) {
        console.error(`from api file uploadResourceData fct. failed creating resource ${resource} : ${error}`);
        throw Error(error);
    }
}

// get a resource by its id
export const getResourceByItsId = async (res_id: string, resource: string, origin?: string) => {

    console.log("\n\n getResourceByItsId", res_id, resource, origin);
    // console.log("\n\n from api file getResourceByItsId origin: ", origin ? origine : "undefined");
    const token = await tokenCache.getToken('currentUser');
    if (!token)
        return console.error("\n\n in getResourceByItsId fct, No token found");

    if (!res_id || !resource)
        return console.error(`Resource ${resource} not found or resource id is missing`);

    try {
        const options = {
            method: 'GET',
            url: `${API_URL}/${resource}/${res_id}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
        };

        const response = await axios.request(options);
        // console.log("\n\nfrom api file getResourceByItsId fct", response?.data);
        return response.data.data;

    } catch (error: any) {
        console.error(`from api file getResourceByItsId fct. failed to fetch a resource ${resource} by its id ${res_id} : ${error}`);
        throw Error(error);
    }
}
/**
 * cm3om1qc10003c82uh2tbwuqd
 */

// format date en french in the format of "il ya 10min", "il ya 1 heure"
export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Moins d'une minute
    if (diffInSeconds < 60) {
        return `il y a ${diffInSeconds} seconde${diffInSeconds === 1 ? '' : 's'}`;
    }

    // Minutes (moins d'une heure)
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `il y a ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'}`;
    }

    // Heures (moins d'un jour)
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `il y a ${diffInHours} heure${diffInHours === 1 ? '' : 's'}`;
    }

    // Jours (moins d'un mois)
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `il y a ${diffInDays} jour${diffInDays === 1 ? '' : 's'}`;
    }

    // Mois (moins d'un an)
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `il y a ${diffInMonths} mois`;
    }

    // Années
    const diffInYears = Math.floor(diffInMonths / 12);
    return `il y a ${diffInYears} an${diffInYears === 1 ? '' : 's'}`;
};


export const deleteResourceData = async (resource: string, id: string) => {

    const token = await tokenCache.getToken('currentUser');
    if (!token)
        return console.error("\n\n in deleteResourceData fct, No token found");

    try {
        const options = {
            method: 'DELETE',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
        };

        const response = await axios.request(options);
        // console.log("\n\nfrom api file deleteResourceData fct", response?.data);
        return response.data.data;

    } catch (error: any) {
        console.error(`from api file deleteResourceData fct. failed to delete a resource ${resource} by its id ${id} : ${error}`);
        throw Error(error);
    }
}


export const deleteResourceWithUserAndPub = async (resource: string, idPub: string, idUser: string) => {

    const token = await tokenCache.getToken('currentUser');
    if (!token)
        return console.error("\n\n in deleteResourceData fct, No token found");

    try {
        const options = {
            method: 'DELETE',
            url: `${API_URL}/${resource}?idPub=${idPub}&idUser=${idUser}`,
            headers: {
                'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
        };

        const response = await axios.request(options);
        // console.log("\n\nfrom api file deleteResourceData fct", response?.data);
        return response.data.data;

    } catch (error: any) {
        console.error(`from api file deleteResourceData fct. failed to delete a resource ${resource} by its id pub ${idPub} and id user ${idUser} : ${error}`);
        throw Error(error);
    }
}

