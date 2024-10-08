import React, { useState, useEffect, useContext } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Button from "@mui/material/Button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import NewUserModal from "./Modals/NewUserModal";
import UserAvatar from "./userAvatar";
import { NavBarContext } from "./context";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const PageState = {
  SIGN_UP: "signUp",
  SIGN_IN: "signIn",
  NEITHER: "neither",
};

export default function NavBar() {
  const [open, setOpen] = React.useState(PageState.NEITHER);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [signUpSuccess, setSignUpSuccess] = useState(true);
  const { userInSession, setUserInSession } = useContext(NavBarContext);
  const [userName, setUserName] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const location = useLocation();

  const [isDeleteButton, setIsDeleteButton] = useState(false);
  const pattern =
    /((http:)?(\/\/)?([a-zA-Z0-9\.\:]+)?\/(eventDetails)\/([\w]+))/;

  useEffect(() => {
    setIsDeleteButton(pattern.test(location.pathname));
  }, [location.pathname, pattern]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log("Logged out with", response.status);
      if (response.ok) {
        setUserInSession(false);
      } else {
        console.error("Log Out Failed:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserInSession(false);
    setUserName(null);
    navigate("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = () => (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          navigate("/profile");
        }}
      >
        Profile
      </MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/profile");
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <UserAvatar user={userName} />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const navigate = useNavigate();
  const addEvent = () => {
    navigate("events/new");
  };
  const setSignUp = () => {
    setOpen(PageState.SIGN_UP);
    setSignUpSuccess(true);
  };

  const setSignIn = () => {
    setOpen(PageState.SIGN_IN);
    setSignUpSuccess(true);
  };

  const setUserInfo = (userData) => {
    setUserName(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  useEffect(() => {
    fetch("http://localhost:3000/user_sess", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserInSession(data.user_in_session);
      });
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserName(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <Box
      sx={{ flexGrow: 1 }}
      style={{ paddingLeft: "0px", paddingRight: "0px" }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            component="a"
            href="/"
            size="medium"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            Activity Hub
          </IconButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {userInSession && (
            <Button
              size="small"
              aria-haspopup="true"
              variant="contained"
              onClick={addEvent}
              style={{ marginRight: "15px", margin: "10px 15px 10px 0px" }}
            >
              {"ADD Event"}
            </Button>
          )}

          <NewUserModal
            open={
              (open === PageState.SIGN_UP) | (open === PageState.SIGN_IN) &&
              signUpSuccess
            }
            onClose={() => setOpen(PageState.NEITHER)}
            sessionState={open}
            setSignIn={setSignIn}
            setSignUp={setSignUp}
            setSignUpSuccess={setSignUpSuccess}
            setUserInSession={setUserInSession}
            setUserInfo={setUserInfo}
          />
          <Box sx={{ flexGrow: 1 }} />
          {userInSession ? (
            <Button
              size="small"
              aria-haspopup="true"
              variant="contained"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              size="large"
              aria-haspopup="true"
              variant="contained"
              onClick={setSignUp}
            >
              Sign Up
            </Button>
          )}

          {userInSession && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <UserAvatar user={userName} />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {userInSession && renderMobileMenu()}
      {userInSession && renderMenu()}
    </Box>
  );
}
