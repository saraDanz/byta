import { useDispatch, useSelector } from 'react-redux';


export default function useIsReportAvaliable() {

    let configs = useSelector(st => {

        return st.config.configs;
    });
    const isRportingAvailiable = (date) => {
        let y = date.getFullYear();
debugger;
        if (configs[y]) {
            let specificConfig = configs[y].find(item => item.month == date.getMonth())
            if (!specificConfig)
                return true;
            return specificConfig.isOpen;
        }
        return true;
    }
    return isRportingAvailiable;


}