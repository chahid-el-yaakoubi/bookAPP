import { useState } from "react";
import Sidebar from "../components/sideBar/SideBar";
import NavBar from "../components/navBar/NavBar";
import Widget from "../components/widget/Widget";
import Featured from "../components/featured/Featured";
import Chart from "../components/chart/Chart";
import Layout from "../components/Layout";
import axios from "axios";
import useFetch from "../../hooks/useFetch";

const Home = () => {

    const {data:contByCity} = useFetch(`/api/hotels/contByCity`)
    console.log(contByCity)

    return (
        <Layout children={<>
            <div className="">
            <div className="flex gap-5 p-5  ">
                <Widget type="user" />
                <Widget type="order" count={contByCity}  />
                <Widget type="earning" />
                <Widget type="balance" />
                <Widget type="order" />
                    
            </div>
            <div className="flex gap-5 p-5">
                <Widget type="user" />  

            </div>

            </div>
            
  
            <div className="flex gap-5 mt-10 p-5">
                <Featured />
                <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
            </div>

        </>} use="dashbord" />
    );
};

export default Home;
