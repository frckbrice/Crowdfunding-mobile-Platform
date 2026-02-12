import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, useRouter } from 'expo-router';
import { tokenCache } from '@/store/persist-token-cache';
import * as SecureStore from 'expo-secure-store'

type SProps = {
    icon?: typeof Ionicons.defaultProps,
    title?: string,
    hasNotification?: boolean,
    isLast?: boolean;
    route?: string;
}
const SettingsItem = ({
    icon,
    title,
    hasNotification,
    isLast,
    route
}: SProps) => {

    const router = useRouter();

    const handleRouting = async () => {
        if (route?.toLocaleLowerCase().includes('deconnexion')) {
            await SecureStore.deleteItemAsync('token')
            await SecureStore.deleteItemAsync('currentUser')
            return router.push('/login');
        } else
            router.push(route as Href<string>)
    }

    return (
        <TouchableOpacity
            style={[styles.settingsItem, !isLast && styles.borderBottom]}
            onPress={handleRouting}>
            <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
            <Text style={styles.settingsText}>{title}</Text>
            <View style={styles.rightContainer}>
                {hasNotification && <View style={styles.notificationDot} />}
                <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
        </TouchableOpacity>
    );
}

const SentProjects = () => {

    const router = useRouter();
    return (
        <SafeAreaView className=" h-full ">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/accueil")}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Paramètre de compte</Text>
                </View>
                <ScrollView>
                    <View style={styles.section}>
                        <SettingsItem icon="person-outline" title="Information du compte" route='/(settings)/edit-profile' />
                        {/* <SettingsItem icon="finger-print" title="Vérification
d’identification" hasNotification route='/(settings)/AccountIdentification' /> */}
                        {/* <SettingsItem icon="language" title="Langue" isLast /> */}
                    </View>
                    <View style={styles.section}>
                        <SettingsItem icon="lock-closed-outline" title="Modifier mot de passe" route='/(settings)/modifier-pwd' />
                        {/* <SettingsItem icon="call-outline" title="Modifier numéro de téléphone" isLast /> */}
                        {/* <SettingsItem icon="person" title="Modifier informations personnelles" isLast route='/(settings)/edit-profile' /> */}
                    </View>
                    <View style={styles.section}>
                        {/* <SettingsItem icon="notifications-outline" title="Notification" route='/notifications' /> */}
                        {/* <SettingsItem icon="help-circle-outline" title="Centre d'aide" /> */}
                        <SettingsItem icon="shield-outline" title="Politique de confidentialité" route='/(settings)/politique-confidentialite' />
                        {/* <SettingsItem icon="person-add-outline" title="Invité un ami" /> */}
                        <SettingsItem icon="log-out-outline" title="Déconnexion" isLast route='deconnexion' />
                    </View>
                </ScrollView>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#1f2937',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    section: {
        marginTop: 16,
        backgroundColor: '#1f2937',
        borderRadius: 8,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    icon: {
        marginRight: 16,
    },
    settingsText: {
        color: '#fff',
        flex: 1,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
        marginRight: 8,
    },
});


export default SentProjects;
