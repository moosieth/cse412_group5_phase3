import React from "react";

export default function Content() {
  return (
    <section>
      <form>
        <label htmlFor="Text">Text:</label>
        <input type="text" id="feeling" name="feeling" />
        <br />
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message"></textarea>
        <br />
        <button type="submit">Share</button>
      </form>
    </section>
  );
}
