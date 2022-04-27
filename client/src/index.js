import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './store/reducers';
import { composeWithDevTools } from "redux-devtools-extension";
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
let store = createStore(reducer, composeWithDevTools());
ReactDOM.render(<BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
</BrowserRouter>, document.getElementById('root'));