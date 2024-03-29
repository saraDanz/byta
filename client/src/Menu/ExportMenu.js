import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material';

export default function ExportMenu({ items, disabled }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                disabled={disabled || false}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                הורדה
      </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {items.map((item, index) => {
                    if(item.type=="divider")return <Divider/>
                    return <MenuItem key={index} onClick={item.onClick}>
                        {item.icon}{item.text}</MenuItem>
                })}

            </Menu>
        </div>)
}
// ExportMenu.propTypes={
//     items:propTypes
// }
