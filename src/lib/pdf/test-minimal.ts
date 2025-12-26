import { pdf, Document, Page, Text, View, StyleSheet } from '@alexandernanberg/react-pdf-renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: { padding: 30 },
  text: { fontSize: 12, fontFamily: 'Helvetica' },
});

const MinimalDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.text}>Hello World - Test PDF</Text>
      </View>
    </Page>
  </Document>
);

export const testMinimalPDF = async (): Promise<Blob> => {
  console.log('Starting minimal PDF test...');
  const blob = await pdf(<MinimalDoc />).toBlob();
  console.log('Minimal PDF generated successfully!');
  return blob;
};
