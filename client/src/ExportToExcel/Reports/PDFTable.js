// import { Document, Page, Font, View, Text, StyleSheet } from '@react-pdf/renderer';
// // Register Font
// // Font.register({
// //     family: "Roboto",
// //     fonts: [
// //         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
// //         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
// //         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
// //         { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
// //       ],
// // });
// Font.register({ family: 'Rubik', src: "http://fonts.gstatic.com/s/rubik/v3/4sMyW_teKWHB3K8Hm-Il6A.ttf" })
// // Create styles
// const styles1 = StyleSheet.create({
//     page: {
//         flexDirection: 'row',
//         backgroundColor: '#E4E4E4',
//         fontFamily: "Rubik",
//         direction: "rtl",
//         fontSize: "18px",
//     },
//     section: {
//         margin: 10,
//         padding: 10,
//         flexGrow: 1
//     }
// });

// // Create Document Component

// const styles = StyleSheet.create({
//     em: {
//         //   fontStyle: 'bold',
//         backgroundColor: "#efefef"
//     },
//     header:{
//         backgroundColor:"lightblue"
//     },
//     table: {

//         margin: "auto",
//         width: '90%',
//         borderWidth: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         fontSize: "5",
//         marginVertical: 12,
//         marginTop: 25,
//     },
//     tableRow: {
//         display: 'flex',
//         flexDirection: 'row',
//         borderCollapse: "collapse"
//     },
//     cell: {
//         borderWidth: 1,
//         display: 'flex',
//         justifyContent: 'center',
//         alignContent: 'center',
//         textAlign: 'center',
//         flexWrap: 'wrap'
//     }, page: {

//     }
// })

// export const PDFTable = ({ children, th, columns }) => (

//     <View style={styles.table}>
//         <View  style={[styles.tableRow, { direction: "rtl" }, th, styles.header]}>
//             {columns.map(({ colName, colFlex,header }, j) =>
//                 <View key={j} style={[styles.cell, { padding: 2, flex: colFlex || 1, fontSize: "8", maxHeight: "30px" }]}>
//                 <Text >{header}</Text> 
//                 </View>)}
//         </View>
//         {children.map((row, ind) =>
//             <View key={ind} style={[styles.tableRow, { direction: "rtl" }, th && ind === 0 ? styles.em : {}]}>
//                 {columns.map(({ colName, colFlex }, j) =>
//                     <View key={j} style={[styles.cell, { padding: 2, flex: colFlex || 1, fontSize: "8", maxHeight: "30px" }]}>
//                         {

//                             typeof (row[colName]) === 'string' || typeof (row[colName]) === 'number' ?
//                                 <Text >{row[colName]}</Text> :
//                                 typeof (row[colName]) == "object" ? <Text >kkk</Text> :
//                                     <Text >  {row[colName]}</Text>
//                         }
//                     </View>
//                 )}
//             </View>
//         )}

//     </View>
// )