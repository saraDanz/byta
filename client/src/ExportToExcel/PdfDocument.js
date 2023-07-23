import { Document, Page, Font, View, Text, StyleSheet } from '@react-pdf/renderer';
// Register Font
// Font.register({
//     family: "Roboto",
//     fonts: [
//         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
//         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
//         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
//         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
//       ],
// });
Font.register({ family: 'Rubik', src: "http://fonts.gstatic.com/s/rubik/v3/4sMyW_teKWHB3K8Hm-Il6A.ttf" })
// Create styles
const styles1 = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        fontFamily: "Rubik",
        direction: "rtl",
        fontSize: "18px",
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
        //   fontStyle: 'bold'
    },
    table: {
        margin: "auto",
        width: '90%',
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'column',
        fontSize: "18px",
        marginVertical: 12,
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
    }, page: {

    }
})

const Table = ({ children, col, th, columns }) => (

    <View style={styles.table}>
        {children.map((row, ind) =>
            <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.em : {}]}>
                {columns.map((colName, j) =>
                    <View key={j} style={[styles.cell, { flex: 1,fontSize:"18px",maxHeight:"30px"}]}>
                        {

                            typeof (row[colName]) === 'string' || typeof (row[colName]) === 'number' ?
                                <Text style={ { fontSize:"18"}}>{row[colName]}</Text> :
                                typeof (row[col]) == "object" ? <Text style={ { fontSize:"18"}}>kkk</Text> :
                                <Text style={ { fontSize:"18"}}>  {row[colName]}</Text>
                        }
                    </View>
                )}
            </View>
        )}
    </View>
)
const PDFDocument = ({ columns, data }) => (
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

