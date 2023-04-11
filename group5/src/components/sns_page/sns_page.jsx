import React, { useState } from "react";
import "./sns.css";
import Header from "../../layouts/header/header";
import Content from "../../layouts/content/content";
import Footer from "../../layouts/footer/footer";
import CreatePost from "../create_post/create_post";

export default function SNS() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <Header setShowCreate={setShowCreate} />
      <Content />
      <Footer />
      {showCreate && (
        <CreatePost setShowCreate={setShowCreate} />
      )}
    </div>
  );
}
