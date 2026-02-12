export type Post = {
    id: string;
    author: User;
    location: string;
    content: string;
    imageUrl: string;
    likes?: Jaime[];
    comments: Comment[];
    favorites?: any[];
    timeAgo: string;
    idUser: string | undefined;
    statePub: boolean;
    category: string;
    montant?: number | string;
    documentUrl: string | any
};

export interface IUser {
    id?: string;
    nomUser: string;
    mdpUser: string;
    username: string;
    etatUser: boolean;
    localisation: string;
    docUser?: string;
    photoUser?: string;
    pieceIdf?: string;
    pieceIdb?: string;
    dateCrea?: string;
    dateNaiss?: string
}

export interface TUser {
    username: string;
    password: string;
    role?: string;
}

export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>
    saveToken: (key: string, token: string) => Promise<void>
    clearToken?: (key: string) => void
}


export type Category = {
    id: string;
    nomCat: string;
    typeCat: string;
}

export type Publication = {
    id?: string
    idUser: string | undefined;
    idCat: string | undefined;
    libelePub: string;
    imagePub: string | any;
    datePub?: string;
    favories?: boolean;
    etat?: boolean;
    // videoPub?: string | any;
    montantEstime: number | string;
    documentUrl?: string | any;
}


export type Jaime = {
    id?: string,
    idPub: string,
    idUser: string,
    dateJaime: string
}

export interface Comment {
    idPub: string;
    idUser: string;
    idParent?: string | null;  // Add this for nested replies
    createdAt: string;
    etatCom: boolean;
    libeleCom: string;
    userName?: string;
    userAvatar?: string;
    replies?: Comment[];
    id?: string;
    replyToUser?: string;
    likes?: number; // the number of likes of this message
}

/**
 *   const handleLike = () => {
        setIsLiked(!isLiked);
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();
        onLike(comment?.idCom);
    }
 */

export type User = {
    id?: string;
    nomUser: string;
    mdpUser: string;
    username: string;
    etatUser: boolean;
    localisation: string;
    docUser?: string;
    photoUser?: string;
    pieceIdf?: string;
    pieceIdb?: string;
    createdAt?: string | undefined;
    dateNaiss?: string
}


export type Don = {
    id: string;
    idPub: number;
    idUser: number;
    nomDons: string;
    montantDons: number;
    dateDons: string;
}

export type DonationResponse = {
    id: string;
    status: string;
    amount: {
        value: string;
        currency_code: string;
    };
};
