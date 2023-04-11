import React from "react";
import "./sns.css";

export default function SNS() {
  return (
    <div>
      <h1>Welcome to the SNS Feeling Page</h1>
      <p>Share how you're feeling with your friends!</p>
      <form>
        <label htmlFor="feeling">Feeling:</label>
        <input type="text" id="feeling" name="feeling" />
        <br />
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message"></textarea>
        <br />
        <button type="submit">Share</button>
      </form>
    </div>
  );
}
