import { useState, useTransition, useMemo, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux"
import { InputAdornment, TextField, ListItemButton } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import "./TeacherListQuick.css";
import Typography from '@mui/material/Typography';

import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';
// import DeleteIcon from '@mui/icons-material/Delete';

import { BASE_URL } from './VARIABLES';
import axios from 'axios';
import TeacherListItem from './TeacherListItem';
import EditTeacherDialog from "./EditTeacherDialog";

import ExportMenu from './Menu/ExportMenu';
import { exportToCSV } from "./ExportToExcel/exportToExcelUtils";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import { Link, Outlet, useNavigate } from "react-router-dom";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';



import Pagination from '@mui/material/Pagination';
import TeacherListItemQuick from './TeacherListItemQuick';
import TeacherListQuickMain from './TeacherListQuickMain';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function TeacherListQuickDirector() {
    const currentUser = useSelector(st => st.index.currentUser)
    if (!currentUser)
        return <p>loading...</p>
    return <TeacherListQuickMain teacherTotalPagesUrl={"users/totalTeacherByDirectorIdPages/" + currentUser._id} teachersUrl={"teacherCourses/withTheirCoursesByDirectorIdimit/" + currentUser._id} />


}