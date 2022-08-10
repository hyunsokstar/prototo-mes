import React from "react";
import axios from "axios";
import api from "../utils/api"
import LoginForm from '../components/LoginForm'
import userSlice from "../slices/user"

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducer';
import { useEffect } from "react";
import router, { useRouter } from 'next/router'


interface LayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
    const isLoggedIn = useSelector((state: RootState) => !!state.user.me.email);
    const user = useSelector((state: RootState) => state.user.me);
    const dispatch = useDispatch();

    const logOut = () => {
        alert("로그아웃 성공");
        localStorage.removeItem("mes-token")
        router.push('/')

    }

    const loginCheck = async () => {
        console.log("login check");

        const current_token = localStorage.getItem("mes-token");
        console.log("current_token : ", current_token);
        

        const login_user = await axios.post(`${api.cats}/login_check`, {},{
            withCredentials: true,
            headers: {
              Authorization: "Bearer "+current_token,
            },
          });

          console.log("login_user : ", login_user);
          

          if (login_user.data.success) {
            dispatch(
                userSlice.actions.setUser({
                    email: login_user.data.data.email,
                    name: login_user.data.data.name,
                    accessToken: current_token,
                }),
            );
        }
        
    }

    useEffect(()=> {
        loginCheck();
    }, [])

    return (
        <div>
            {isLoggedIn ? <span>{user.name} 님 안녕하세요 <button onClick = {() => logOut()}>로그 아웃</button> </span> : (
                <LoginForm />
            )}
            {children}
        </div>
    );
};

export default AppLayout;

