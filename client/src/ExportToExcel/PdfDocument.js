import { Document, Page,Font, View, Text, StyleSheet } from '@react-pdf/renderer';
// Register Font
Font.register({
    family: "Roboto",
    src:"https://fonts.googleapis.com/css2?family=Miriam+Libre:wght@400;700&display=swap"
     
  });
// Create styles
const styles1 = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component

const styles = StyleSheet.create({
    em: {
        fontStyle: 'bold'
    },
    table: {
        width: '100%',
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 12
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    cell: {
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap'
    }
})

const Table = ({ children, col, th ,columns}) => (
    <View style={styles.table}>
        {children.map((row, ind) =>
            <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.em : {}]}>
                {columns.map((colName, j) =>
                    <View key={j} style={[styles.cell, { flex:1, height: 40 }]}>
                        {
                            typeof (row[colName]) === 'string' || typeof (row[colName]) === 'number' ?
                                <Text>{row[colName]}</Text> :
                                typeof(row[col])=="object"?<Text>kkk</Text>:
                                 row[colName]
                        }
                    </View>
                )}
            </View>
        )}
    </View>
)
const PDFDocument = ({columns,data}) => (
    <Document>
        <Page size="A4" style={styles1.page}>
            <Table
                th
                columns={columns}
                col={['20%', '60%', '20%']}
                children={data} />

        </Page>
    </Document>
);
export default PDFDocument;

