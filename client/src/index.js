import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { combineReducers } from "redux";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './store/reducers';
import { composeWithDevTools } from "redux-devtools-extension";
import { settingReducer } from './store/reducers/setting';
import { configReducer } from './store/reducers/config';
import { BASE_URL } from './VARIABLES';
import axios from "axios";
import {saveCurrentYear} from "./store/actions/variable"
import { variableReducer } from './store/reducers/variable';
// import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
// import Spinner from './components/Spinner';
// import SeasonDisplay from './components/seasonDisplay';

// class App extends React.Component{
//     state = { lat: null , errorMessage: '' }

//     componentWillMount(){
//             window.navigator.geolocation.getCurrentPosition(
//                 position => this.setState({ lat: position.coords.latitude}),
//                 err => this.setState({ errorMessage: err.message })
//             );
//     }

//     renderContent(){
//           if(this.state.errorMessage !== '' && !this.state.lat){
//                 return <div>Error: {this.state.errorMessage}</div>
//           }

//           if(!this.state.errorMessage && this.state.lat){
//                 return <SeasonDisplay lat={this.state.lat} />;
//           }

//           return <Spinner message="Please accept location request" />;
//     }

//     render(){
//         return (<div className="border red">{this.renderContent()}</div>);
//     }

// }
let store = createStore(combineReducers({ 
    index: reducer, 
    setting: settingReducer,
    variable: variableReducer,
     config: configReducer }), composeWithDevTools());
// const THEME = createMuiTheme({
//     typography: {
//      "fontFamily": `"Rubik", "Helvetica", "Arial", sans-serif`,

//     }
//  });

const app = document.getElementById('root');

// create a root
const root = createRoot(app);
axios.get(BASE_URL + "variables/years/currentYear").then((res) => {
    console.log(res.data);
    store.dispatch(saveCurrentYear(res.data.value))
})
    .catch((er) => {
        console.log(er)
        alert("תקלה בהגדרת שנה נוכחית")
    })

//render app to root
root.render(<BrowserRouter>
    <Provider store={store}>
        <div dir="rtl">
            <App /></div>
    </Provider>
</BrowserRouter>);

