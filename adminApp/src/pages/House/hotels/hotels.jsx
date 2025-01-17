import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import DataHotel from "./DataHotel";
import NewHotel from "./newHotel";
import SingleHotel from "./SingleHotel";

function Hotels({type}) {
    return (
        <Layout children={
            <>
                {type === "/" ? <DataHotel   /> : type === "new" ? <NewHotel /> : <SingleHotel />}
            </>
        } use="hotels" />
    );
}

export default Hotels;
    