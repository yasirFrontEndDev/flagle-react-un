import React, { useEffect, useState } from "react";

import ReactTooltip from "react-tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faCircleArrowLeft,
  faCircleQuestion,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { faGear, faInfinity } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import useTheme from "@mui/material/styles/useTheme";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Link, useLocation } from "react-router-dom";

const Header = ({ setSettingsOpen, setStatsOpen, disabled }) => {
  const theme = useTheme();
  const location = useLocation(); // Get the current route
  const isDailyRoute = location.pathname === "/daily"; // Check if the route is '/daily'
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    let tooltipShown = JSON.parse(localStorage.getItem("flagle-tooltipshown"));
    let settings = JSON.parse(localStorage.getItem("flagle-settings"));
    let tooltip = document.querySelectorAll(
      `[data-tip][data-for="settingsTip"]`
    )[0];

    if (tooltipShown === null && settings.hardMode === false) {
      ReactTooltip.show(tooltip);
    } else {
      localStorage.setItem("flagle-tooltipshown", "true");
      setShowTooltip(false);
    }
  }, []);

  const toggleTheme = () => {
    theme.toggleTheme();
  };

  // const handleInfoOpen = () => {
  //     if(!disabled) {
  //         setInfoOpen(true)
  //     }
  // }

  const handleStatsOpen = () => {
    if (!disabled) {
      setStatsOpen(true);
    }
  };

  const handleSettingsOpen = () => {
    if (!disabled) {
      handleTooltipClose();
      setSettingsOpen(true);
    }
  };

  const handleTooltipClose = () => {
    setShowTooltip(false);

    localStorage.setItem("flagle-tooltipshown", "true");
  };

  return (
    <header
      style={{
        maxWidth: "600px",
        width: theme.screenWidth < 600 ? "100%" : "auto",
        margin: "0 auto",
        height:
          theme.canvasWidth === 400
            ? "60px"
            : theme.canvasWidth === 360
            ? "55px"
            : "50px",
        fontSize:
          theme.canvasWidth === 400
            ? "42px"
            : theme.canvasWidth === 360
            ? "38px"
            : "34px",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderLeft:
          theme.screenWidth >= 600
            ? `1px solid ${theme.palette.border.default}`
            : "none",
        borderBottom: `1px solid ${theme.palette.border.default}`,
        borderRight:
          theme.screenWidth >= 600
            ? `1px solid ${theme.palette.border.default}`
            : "none",
        borderBottomLeftRadius: theme.screenWidth >= 600 ? "0.3rem" : 0,
        borderBottomRightRadius: theme.screenWidth >= 600 ? "0.3rem" : 0,
      }}
    >
      <div className="header-left">
        <Link to="/">
          <FontAwesomeIcon
            className={`header-icon-${theme.canvasWidth}`}
            icon={faCircleArrowLeft}
            size="2x"
          />
        </Link>
        <FontAwesomeIcon
          onClick={handleStatsOpen}
          className={`header-icon-${theme.canvasWidth}`}
          icon={faChartColumn}
          size="2x"
        />
      </div>
      <div className="header-title">Flagle</div>
      <div className="header-right">
        <FontAwesomeIcon
          onClick={toggleTheme}
          className={`d-none  header-icon-${theme.canvasWidth}`}
          icon={theme.palette.mode === "dark" ? faMoon : faSun}
          size="2x"
        />
        <FontAwesomeIcon
          id="settings-icon"
          onClick={handleSettingsOpen}
          className={`header-icon-${theme.canvasWidth}`}
          icon={faGear}
          size="2x"
          data-tip
          data-for="settingsTip"
        />
        {showTooltip && (
          <ReactTooltip
            id="settingsTip"
            place="top"
            effect="solid"
            border={true}
            borderColor={theme.palette.border.default}
            offset={{
              top: 20,
              left:
                theme.canvasWidth === 400
                  ? 106
                  : theme.canvasWidth === 360
                  ? 102
                  : 98,
            }}
            backgroundColor={theme.palette.background.paper}
            textColor={theme.palette.text.primary}
            delayHide={600000}
            clickable={true}
          >
            <div style={{ display: "inline-flex" }}>
              <div
                style={{
                  fontSize:
                    theme.canvasWidth === 400
                      ? "16px"
                      : theme.canvasWidth === 360
                      ? "15px"
                      : "14px",
                }}
              >
                For a bigger challenge, <br />
                enable hard mode to hide <br />
                flags from the country list
              </div>
              <IconButton
                color="inherit"
                aria-label="close"
                size="small"
                onClick={handleTooltipClose}
                sx={{ paddingLeft: "15px" }}
                disableRipple={true}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </ReactTooltip>
        )}
        <Link to={isDailyRoute ? "/unlimited" : "/daily"}>
          {" "}
          {/* Toggle route */}
          <FontAwesomeIcon
            className={`header-icon-${theme.canvasWidth}`}
            icon={isDailyRoute ? faInfinity : faClock }
            size="2x"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
