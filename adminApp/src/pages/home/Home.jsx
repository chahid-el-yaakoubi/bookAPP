import { useState, useContext, useEffect } from "react";
import Widget from "../components/widget/Widget";
import Featured from "../components/featured/Featured";
import Chart from "../components/chart/Chart";
import Layout from "../components/Layout";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../context/AuthContect";
import Cookies from "js-cookie";

const Home = () => {

    const token = Cookies.get("user");
    console.log(token);

    const { user } = useContext(AuthContext);
    const { adminCars, adminUsers, adminHotes, adminHouses, adminShops } = user;

    let idCount = "all";
    if (!adminUsers) {
        idCount = user._id
    }

    const { data: countByCity } = useFetch(`/api/hotels/contByCity/count/${idCount}`)
    const { data: coutHouse } = useFetch(`/api/house-rentals/contByCity/count/${idCount}`)
    const { data: coutCar } = useFetch(`/api/cars//countCars/count/${idCount}`)
    const { data: coutShop } = useFetch(`/api/shops/countByCity/count/${idCount}`)
    const { data: countUser } = useFetch(`/api/users/count/users`)
    let { data: countCities } = useFetch(`/api/cities/countByCity/count`)




    return (
        <Layout children={<>
            <div className={`flex  gap-4 p-4`}>
                {adminUsers && (
                    <Widget type="cities" count={countCities} />
                )}
                {adminHotes && (
                    <Widget type="hotel" count={countByCity} />
                )}
                {adminHouses && (
                    <Widget type="house" count={coutHouse} />
                )}
                {adminCars && (
                    <Widget type="cars" count={coutCar} />
                )}
                {adminShops && (
                    <Widget type="shops" count={coutShop} />
                )}
                {adminUsers && (
                    <Widget type="user" count={countUser} />
                )}
            </div>


            <div className="flex gap-5 mt-10 p-5">
                <Featured />
                <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
            </div>

        </>} use="dashbord" />
    );
};

export default Home;
