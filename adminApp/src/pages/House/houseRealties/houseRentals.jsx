import Layout from "../../components/Layout";
import DataHouseRentals from "./DatahouseRentals";
import NewHouseRentals from "./NewHouseRentals";
// import NewHouseRentals from "./newHouseRentals";
// import SingleHouseRentals from "./SingleHouseRentals";

function HouseRentals({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataHouseRentals /> : type === "new" ? <NewHouseRentals /> : type === "edit" ? <NewHouseRentals /> : <NewHouseRentals />}
            </>
        } use="housesSales" />
    );
}

export default HouseRentals;
    