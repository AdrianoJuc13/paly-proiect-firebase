import { useState, useEffect } from "react";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { firebase } from "../../firebaseConfig.js";
import { toast } from "react-toastify";

import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import "bootstrap/dist/css/bootstrap.min.css";
// import "antd/dist/antd.min.css";
import "../../assets/style/styles.css";

const { Item } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

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

  function getName() {
    var user = firebase.auth().currentUser;
    if (user) return user.email;
    return <LoadingOutlined />;
  }
  return (
    <Menu
      mode="horizontal"
      selectedKeys={[current]}
      style={{ fontWeight: "700" }}
    >
      <Item key="/user">User: {getName()}</Item>
      <Item
        key="/"
        onClick={(e) => {
          setCurrent(e.key);
          navigate("/");
        }}
        icon={<AppstoreOutlined />}
      >
        Lista Comenzi
      </Item>

      <Item
        key="/adaugaComanda"
        onClick={(e) => {
          setCurrent(e.key);
          navigate("/adaugaComanda");
        }}
        icon={<UserAddOutlined />}
      >
        Adauga Comanda
      </Item>

      <Item
        style={{ marginLeft: "auto" }}
        key="#"
        onClick={() => {
          handleSignout();
          navigate("/login");
        }}
        icon={<LoginOutlined />}
      >
        Delogare
      </Item>
    </Menu>
  );
};

export default TopNav;
