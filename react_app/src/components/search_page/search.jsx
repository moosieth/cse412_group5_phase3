import React, { useState } from "react";
import "./search.css";
import Header from "../../layouts/header/header";
import Footer from "../../layouts/footer/footer";
import CreatePost from "../create_post/create_post";

export default function SearchResults(props) {
  const results = props.results;


  return (
    <div>
      <Header/>
      
      <Footer/>
    </div>
  );
}
