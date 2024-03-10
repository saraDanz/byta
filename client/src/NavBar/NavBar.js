

import { Link } from "react-router-dom";
import M from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

import PersonAdd from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {Logout} from '@mui/icons-material';
import { Avatar, Typography } from "@mui/material";
import UserNavBar from "./UserNavBar";

import { Menu, Segment, Icon } from 'semantic-ui-react'


const NavBar = ({ user ,handleMenuClick}) => {
    let userRole=user?user.role:0;
    return( <>
        <Menu pointing secondary>
            {userRole>0 && <UserNavBar userRole={userRole} />}




            <Menu.Item position="left">
                {userRole>0 &&
                    <Typography >
                        {user.firstName}
                    </Typography>}
                <Avatar sx={{  width: 30, height: 30 }} >
                    <AccountCircleIcon onClick={handleMenuClick} />
                </Avatar>

            </Menu.Item>


        </Menu>
        {/* <M
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Link to="login"><MenuItem>
                <Avatar />  כניסה
            </MenuItem></Link>

            {userRole && <Divider />}
            {userRole && userRole != 1 && <Link to="addUser" > <MenuItem>
                <ListItemIcon>
                    <PersonAdd fontSize="small" />
                </ListItemIcon>
                הוספת מורה

            </MenuItem></Link>}

            {userRole && <MenuItem onClick={logOutf}>
                <ListItemIcon >
                    <Logout fontSize="small" />
                </ListItemIcon>
                יציאה
            </MenuItem>}
        </M> */}
        </>)
}
export default NavBar;