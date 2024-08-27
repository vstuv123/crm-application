import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import './NotFound.css';
import { Link } from "react-router-dom";
import MetaData from './MetaData';

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <MetaData title={"CRM - PAGE NOT FOUND"} />
      <ErrorIcon />

      <Typography>Page Not Found </Typography>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;