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

    const {data:countByCity} = useFetch(`/api/hotels/contByCity`)
    const {data:coutHouse} = useFetch(`/api/house-rentals/contByCity`)
    const {data:coutCar} = useFetch(`/api/cars/countByCity`)
    const {data:coutShop} = useFetch(`/api/shops/countByCity`)
    const {data:countUser} = useFetch(`/api/users/count/users`)
    let {data:countCities} = useFetch(`/api/cities/countByCity/count`)


    

    return (
        <Layout children={<>
            <div className="grid grid-cols-1 xl:grid-cols-2 ">
            <div className="flex gap-5 p-5  ">
                <Widget type="cities"  count={countCities} />
                <Widget type="hotel" count={countByCity}  />
                <Widget type="house" count={coutHouse} />

                
            </div>
            <div className="flex gap-5 p-5  ">
                
                <Widget type="cars" count={coutCar} />
                <Widget type="shops" count={coutShop} />
                <Widget type="user"  count={countUser}/>  

                    
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
