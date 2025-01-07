import Layout from "../../components/Layout";
import DataCars from "./DataCars";
import NewCar from "./NewCar";
import SingleCars from "./SingleCars";

// import NewHouseRentals from "./newHouseRentals";
// import SingleHouseRentals from "./SingleHouseRentals";

function Cars({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataCars /> : type === "new" ? <NewCar /> : type === "edit" ? <NewCar /> : type="single" ? <SingleCars />  : <SingleCars /> }
            </>
        } use="cars" />
    );
}

export default Cars;
    