import React, { useState, useEffect } from "react";
import UserProfile from "../user_profile/user_profile";
import axios from "axios";

export default function UserPage({ friendID }) {
    return (
        <div>
          {/* Other components */}
          <UserProfile friendID={friendID} />
          {/* Other components */}
        </div>
      );
}