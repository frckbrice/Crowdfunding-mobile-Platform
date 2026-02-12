import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.sectionTitle}>{children}</Text>
);

const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.subsectionTitle}>{children}</Text>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.paragraph}>{children}</Text>
);

const BulletList = ({ items }: { items: string[] }) => (
    <View style={styles.bulletList}>
        {items.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
            </View>
        ))}
    </View>
);

function PrivacyPolicy() {
    return (
        <SafeAreaView className="flex-1 bg-gray-800 ">
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Politique de Confidentialité</Text>
                <Text style={styles.date}>Dernière mise à jour : 07 fevrier 2025</Text>

                <SectionTitle>Introduction</SectionTitle>
                <Paragraph>
                    Cette politique	de confidentialité décrit comment 1 RICHE 1 PAUVRE collecte, utilise et protège les informations personnelles des utilisateurs. En	utilisant notre application, vous acceptez les pratiques décrites dans cette politique.
                </Paragraph>

                <SectionTitle>Informations Collectées</SectionTitle>
                <SubsectionTitle>Données Personnelles</SubsectionTitle>
                <BulletList items={[
                    'Nom et prénom',
                    'Adresse email',
                    'Numéro de téléphone',
                    'pièce	d\’identité	et passport',
                    'ville',
                    'Photo de profil'
                ]} />
                {/* 
                <SubsectionTitle>2.2 Données de Transaction</SubsectionTitle>
                <BulletList items={[
                    'Historique des dons',
                    'Projets créés',
                    'Interactions avec les projets'
                ]} /> */}

                <SectionTitle> Utilisation des Données</SectionTitle>
                <Paragraph>Nous utilisons vos données pour :</Paragraph>
                <BulletList items={[
                    'Améliorer	notre	application',
                    'Personnaliser	l’expérience d’utilisateur',
                    'Communiquer avec les utilisateurs concernant des mises	à jours	et des offres',
                    'Réaliser les rêves	des	utilisateurs',
                ]} />

                <SectionTitle>Protection des Informations</SectionTitle>
                <Paragraph>
                    {"Nous mettons en	œuvre des	mesures	de	sécurité	appropriées	pour	protéger	vos	informations	personnelles	contre	l’accès	non	autorisé,	l’utilisation ou	la	divulgation."}
                </Paragraph>
                {/* <BulletList items={[
                    'Chiffrement des données sensibles',
                    'Authentification sécurisée',
                    'Accès restreint aux données personnelles',
                    'Sauvegardes régulières'
                ]} /> */}

                <SectionTitle>Partage des Informations</SectionTitle>
                <Paragraph>{"Nous	ne	vendons	ni	ne	louons	vos	informations	personnelles	à	des	tiers.	Nous	pouvons	partager	des	informations	avec	des	prestataires	de	services	qui	nous	aident	à	exploiter	notre	application."}</Paragraph>
                {/* <BulletList items={[
                    'Les prestataires de paiement pour traiter les transactions',
                    'Les autorités sur demande légale',
                    'Les partenaires de vérification d\'identité'
                ]} /> */}

                <SectionTitle>Droits des Utilisateurs</SectionTitle>
                <Paragraph>{"Les	utilisateurs	ont	le	droit	d’accéder	à	leurs	informations	personnelles	de	demander	des	corrections	et	de	demander	la	suppression	de	leurs	données."}</Paragraph>
                {/* <BulletList items={[
                    'Accès à vos données',
                    'Rectification des informations',
                    'Suppression de votre compte',
                    'Opposition au traitement',
                    'Portabilité des données'
                ]} /> */}

                <SectionTitle>Modifications	de	la	Politique	</SectionTitle>
                <Paragraph>{"Nous	nous	réservons le	droit	de	modifier	cette	politique	de	confidentialité.	Toute	modification	sera	publiée	dans	l’application avec	une	date	d’entrée	en	vigueur.	"}</Paragraph>
                {/* <BulletList items={[
                    'Pendant la durée de votre inscription',
                    '5 ans après la dernière activité',
                    'Selon les obligations légales'
                ]} /> */}

                <SectionTitle>Contact</SectionTitle>
                <Paragraph>{"Pour	toute	question	concernant	cette	politique,	veuillez	nous	contacter	à "}</Paragraph>
                <Text className="text-white ml-4 text-sm">Email :Unricheunpauvre@gmail.com</Text>
                <Text style={styles.contactInfo}>– 6 rue du loing 75014 Paris</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#f5f5f5',
    // },
    scrollView: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f5f5f5',
        marginBottom: 8,
        marginTop: 24,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ccc',
        marginTop: 24,
        marginBottom: 12,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ccc',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 16,
        color: '#f5f5f5',
        lineHeight: 24,
        marginBottom: 12,
    },
    bulletList: {
        marginLeft: 8,
        marginBottom: 16,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: '#ccc',
        marginRight: 8,
        marginTop: 2,
    },
    bulletText: {
        flex: 1,
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
    },
    contactInfo: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 24,
        marginLeft: 16,
    },
});

export default PrivacyPolicy;