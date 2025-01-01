import Layout from "../components/Layout";
import CityDetails from "./CityDetails";
import DataCities from "./DataCities";
import NewCity from "./NewCity";
// import NewHouseRentals from "./newHouseRentals";
// import SingleHouseRentals from "./SingleHouseRentals";

function Cities({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataCities /> : type === "new" ? <NewCity /> : type === "edit" ? <NewCity /> : <CityDetails />}
            </>
        } use="cities" />
    );
}

export default Cities;
