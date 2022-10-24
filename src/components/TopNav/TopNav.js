import { useState, useEffect } from "react";
import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import { firebase } from "../../firebaseConfig.js";
import { toast } from "react-toastify";

import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.min.css";
import "../../assets/style/styles.css";

const { Item } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const location = useLocation();

  const handleSignout = async () => {
    try {
      window.localStorage.removeItem("user");
      await firebase.auth().signOut();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    location.pathname && setCurrent(location.pathname);
  }, [location.pathname]);

  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <a href="/">Lista Comenzi</a>
      </Item>

      <Item
        key="/adaugaComanda"
        onClick={(e) => setCurrent(e.key)}
        icon={<UserAddOutlined />}
      >
        <a href="/adaugaComanda">Adauga Comanda</a>
      </Item>

      <Item onClick={() => handleSignout()} icon={<LoginOutlined />}>
        <a href="/login">Delogare</a>
      </Item>
    </Menu>
  );
};

export default TopNav;
