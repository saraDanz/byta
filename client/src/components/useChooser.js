import { useState } from "react";

export default function useChooser(columns) {
    let [all, setAll] = useState(columns);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false)
    }
    const getSelectedFields = () => {
        return all.filter(item => item.isSelected == false
            )
    }
}