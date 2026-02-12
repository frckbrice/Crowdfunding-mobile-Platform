import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

const PdfDocoument = memo(({ uri, cache }: { uri: string, cache: boolean }) => {
    // const source = { uri: 'http://www.pdf995.com/samples/pdf.pdf', cache: true };

    return (
        <View style={styles.container}>
            <Pdf
                source={{ uri, cache }}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                style={styles.pdf} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: '100%',
    }
});

export default PdfDocoument;
