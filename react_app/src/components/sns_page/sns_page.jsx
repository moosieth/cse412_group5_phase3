import React, { useState } from "react";
import "./sns.css";
import Header from "../../layouts/header/header";
import Content from "../../layouts/content/content";
import Footer from "../../layouts/footer/footer";
import CreatePost from "../create_post/create_post";
import UserPage from "../../layouts/user_page/user_page";

export default function SNS() {
  const [showCreate, setShowCreate] = useState(false);
  const [showUserPage, setShowUserPage] = useState(false);

  const handleShowContent = () => {
    setShowUserPage(false);
  };

  return (
    <div>
      <Header 
        setShowCreate={setShowCreate} 
        setShowUserPage={setShowUserPage} 
        handleShowContent={handleShowContent}
      />
      {showUserPage ? <UserPage /> : <Content />}
      <Footer />
      {showCreate && <CreatePost setShowCreate={setShowCreate} />}
    </div>
  );
}
