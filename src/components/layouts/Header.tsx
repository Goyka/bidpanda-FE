import { Link, useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../../apis/user-mypage/UserInfoApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { profileImageState } from "./../../atoms/profileImage";

function Header() {
  const [profileImage, setProfileImage] = useState("");
  const setProfileImg = useSetRecoilState(profileImageState);
  const navigate = useNavigate();
  const removeToken = () => {
    localStorage.removeItem("authorization");
    localStorage.removeItem("authorization_refresh");
  };
  const isToken = localStorage.getItem("authorization");

  useEffect(() => {
    if (isToken) {
      getUserInfoApi().then((data) => {
        setProfileImage(data.data.profileImageUrl);
        setProfileImg(data.data.profileImageUrl);
      });
    }
  }, []);

  const LogoutHandler = () => {
    try {
      if (isToken) {
        removeToken();
        toast.success("로그아웃 되었습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!isToken ? (
        <nav className={navStyle}>
          <button className="text-gray-600 text-xl ml-[330px] ">
            <Link to={"/login"}>login</Link>
          </button>
        </nav>
      ) : (
        <nav className={navStyle}>
          <button className="text-gray-600 text-xl ml-[175px]">
            <Link to={"/notification"}>notification</Link>
          </button>
          <button
            onClick={LogoutHandler}
            className="text-gray-600 text-xl ml-2 "
          >
            logout
          </button>
          <img
            className="w-[35px] h-[35px] ml-2 cursor-pointer rounded-full object-cover shadow-md"
            src={profileImage}
            alt="mypage&profile"
            onClick={() => navigate("/mypage")}
          />
        </nav>
      )}
    </>
  );
}
export default Header;

const navStyle =
  "bg-white w-[390px] h-[105%] flex flex-row py-1 border-b-2 rounded-b-[15px]";
