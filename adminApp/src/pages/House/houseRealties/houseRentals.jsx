import Layout from "../../components/Layout";
import DataHouseRentals from "./DatahouseRentals";
import NewHouseRentals from "./NewHouseRentals";
import SingleHouseRentals from "./SingleHouseRentals";
// import NewHouseRentals from "./newHouseRentals";
// import SingleHouseRentals from "./SingleHouseRentals";

function HouseRentals({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataHouseRentals /> : type === "new" ? <NewHouseRentals /> : type === "edit" ? <NewHouseRentals /> : type="single" ? <SingleHouseRentals />  : <SingleHouseRentals /> }
            </>
        } use="housesSales" />
    );
}

export default HouseRentals;
    