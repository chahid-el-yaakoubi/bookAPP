import Layout from "../../components/Layout";
import DataHotel from "./DataHotel";
import NewHotel from "./newHotel";
import SingleHotel from "./SingleHotel";
import UpdateHotel from "./UpdateHotel";

function Hotels({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataHotel /> : type === "new" ? <NewHotel /> : type === "edit" ? <UpdateHotel /> : <SingleHotel />}
            </>
        } use="hotels" />
    );
}

export default Hotels;
    