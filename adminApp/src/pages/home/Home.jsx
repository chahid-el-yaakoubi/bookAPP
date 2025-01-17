import { useState, useContext, useEffect } from "react";
import Widget from "../components/widget/Widget";
import Featured from "../components/featured/Featured";
import Chart from "../components/chart/Chart";
import Layout from "../components/Layout";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { AuthContext } from "../context/AuthContect";

const Home = () => {
    const [countStyle, setCountStyle] = useState(6)
    const { data: countByCity } = useFetch(`/api/hotels/contByCity/count`)
    const { data: coutHouse } = useFetch(`/api/house-rentals/contByCity/count`)
    const { data: coutCar } = useFetch(`/api/cars//countCars/count`)
    const { data: coutShop } = useFetch(`/api/shops/countByCity`)
    const { data: countUser } = useFetch(`/api/users/count/users`)
    let { data: countCities } = useFetch(`/api/cities/countByCity/count`)
    

    const { user } = useContext(AuthContext);
    const { adminCars, adminUsers, adminHotes, adminHouses, adminShops } = user;


 

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
