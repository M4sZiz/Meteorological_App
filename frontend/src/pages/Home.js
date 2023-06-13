import { useEffect } from "react";

import Details from "./Details";

import Header from "../components/Header";
import Table from "../components/Table";

import { endpoint } from "../constants";

import { Routes, Route, useNavigate } from "react-router-dom";


const Home = () => {

    const navigate = useNavigate();

    useEffect(() => {

        if (localStorage.getItem("token")) {
            fetch(`${endpoint}/v1/auth/user/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                if (res.status !== 200) {
                    return navigate("/login", { replace: true });
                }
            });
        } else {
            return navigate("/login", { replace: true });
        }

    }, [])


    return (
        <div className="flex flex-col bg-backgrounds-body w-screen h-auto">
            <Header />
            <div className="flex flex-col justify-center w-full mx-auto max-w-screen-xl mt-5 px-5 pb-5">
                
                <div className="bg-backgrounds-card w-full h-auto mt-5 rounded-xl">
                    <div className="flex justify-center">
                        <Routes>
                            <Route path="/" element={<Table />} />
                            <Route path="/info/:id" element={<Details />} />
                            {/* <Route path="*" element={navigate('/404')} /> */}
                        </Routes>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home